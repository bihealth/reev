"""Business logic for ClinVar submission."""

import asyncio
import datetime
import logging
import typing
import uuid

import clinvar_api.client as clinvar_api_client
from clinvar_api.models import Created
from pydantic import SecretStr
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession

from app import crud
from app.core.config import settings
from app.db import session as app_db_session
from app.models.clinvarsub import (
    ResponseMessage,
    SubmissionActivity,
    SubmissionActivityKind,
    SubmissionActivityStatus,
    SubmissionThread,
    SubmissionThreadStatus,
)
from app.schemas.clinvarsub import (
    SubmissionActivityCreate,
    SubmissionActivityInDb,
    SubmissionThreadInDb,
    SubmittingOrgInDb,
)
from app.worker import handle_submission_activity

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

#: Number of seconds to wait before retrying the next fetch.
RETRY_WAIT_SECONDS = 10 if settings.DEBUG else 10 * 60


class SubmissionException(Exception):
    """Base class for problems with the submission."""

    def __init__(self, msg: str, *args, **kwargs):  # pragma: no cover
        super().__init__(msg, *args, **kwargs)
        logger.warning(msg)


class MissingRecord(SubmissionException):
    """Exception on missing activity / thread."""


class InvalidState(SubmissionException):
    """Exception on invalid state of activity / thread."""


class DatabaseProblem(SubmissionException):
    """Exception on database problem."""


class _KindHandlerBase:
    """Base class for per-kind handler.

    The main purpose of the existance is to encapsulate the session,
    activity, and thread.
    """

    def __init__(
        self, session: AsyncSession, activity: SubmissionActivity, thread: SubmissionThread
    ):
        """Initialise the handler."""
        #: The session to use.
        self.session = session
        #: The activity to process.
        self.activity = activity
        #: The activity's thread.
        self.thread = thread

    async def run(self) -> None:  # pragma: no cover
        """perform the handler's work."""
        raise NotImplementedError

    async def make_clinvar_client(self) -> clinvar_api_client.AsyncClient:
        """Construct and return a ClinVar API client."""
        submittingorg_db = await crud.submittingorg.get(
            self.session, id=await self.thread.awaitable_attrs.submittingorg_id
        )
        if not submittingorg_db:  # pragma: no cover
            raise ValueError("No submitting org found")
        submittingorg = SubmittingOrgInDb.model_validate(submittingorg_db)
        auth_token = SecretStr(submittingorg.clinvar_api_token)
        clinvar_config = clinvar_api_client.Config(
            auth_token=auth_token,
            use_testing=not settings.CLINVAR_USE_PRODUCTION,
        )
        return clinvar_api_client.AsyncClient(clinvar_config)

    async def schedule_next_retrieve(self) -> None:
        """Schedule the next retrieval of the SCV."""
        logger.debug("creating new activity for next retrieval of %s", self.thread.id)
        create_obj = SubmissionActivityCreate(
            submissionthread_id=self.thread.id,
            kind=SubmissionActivityKind.RETRIEVE,
            status=SubmissionActivityStatus.WAITING,
            request_payload=None,
            request_timestamp=None,
            response_payload=None,
            response_timestamp=None,
        )
        activity_next = await crud.submissionactivity.create(self.session, obj_in=create_obj)
        logger.debug("scheduling next execution in %f sec", RETRY_WAIT_SECONDS)
        handle_submission_activity.apply_async(
            args=(str(activity_next.id),), countdown=RETRY_WAIT_SECONDS
        )


class _CreateHandler(_KindHandlerBase):
    """Handle CREATE events."""

    async def run(self) -> None:
        """Submit a new submission to ClinVar.

        This will try to submit the already prepared payload to ClinVar and
        store the response or store an error message.  In the case of a
        successful post, the SCV can be parsed from the ``Created`` response.

        A RETRIEVE action must be performed periodically to eventually
        retrieve the effective SCV once ClinVar has finished processing.
        """
        logger.debug("handling submission to ClinVar")
        activity = SubmissionActivityInDb.model_validate(self.activity)
        logger.debug("activity: %s", activity.model_dump(mode="json"))
        if not activity.request_payload:  # pragma: no cover
            raise ValueError("No request payload found in activity record")
        clinvar_client = await self.make_clinvar_client()
        request_timestamp = datetime.datetime.utcnow()
        response: ResponseMessage | Created
        try:
            logger.debug("submitting payload to ClinVar")
            response = await clinvar_client.submit_data(activity.request_payload)
            logger.debug("response: %s", response.model_dump(mode="json"))
            response_timestamp = datetime.datetime.utcnow()
            activity_status = SubmissionActivityStatus.WAITING
            thread_status = SubmissionThreadStatus.WAITING
        except Exception as err:
            logger.debug("submission failed: %s", err)
            response = ResponseMessage(text=f"Submission failed: {err}")
            response_timestamp = datetime.datetime.utcnow()
            activity_status = SubmissionActivityStatus.FAILED
            thread_status = SubmissionThreadStatus.FAILED
        logger.debug(
            "updating submission activity and thread; activity status=%s, thread_status=%s",
            activity_status,
            thread_status,
        )
        activity_new = await crud.submissionactivity.update(
            self.session,
            db_obj=self.activity,
            obj_in={
                "status": activity_status,
                "request_timestamp": request_timestamp,
                "response_timestamp": response_timestamp,
                "response_payload": response.model_dump(mode="json"),
            },
        )
        thread_new = await crud.submissionthread.update(
            self.session, db_obj=self.thread, obj_in={"status": thread_status}
        )
        # wait for all attributes to be present
        await asyncio.gather(activity_new.awaitable_attrs.id, thread_new.awaitable_attrs.id)
        logger.debug(
            "after update; thread=%s, activity=%s",
            SubmissionThreadInDb.model_validate(thread_new).model_dump(mode="json"),
            SubmissionActivityInDb.model_validate(activity_new).model_dump(mode="json"),
        )
        # Create activity for the next retrieval unless failed.
        if thread_status != SubmissionThreadStatus.FAILED:
            await self.schedule_next_retrieve()


class _RetrieveHandler(_KindHandlerBase):
    """Handle RETRIEVE events."""

    async def run(self) -> None:
        """Attempt to retrieve the ClinVar status for a previous CREATE.

        This will first attempt to get the latest ``SubmissionActivity``
        with kind ``CREATE``.  The activity must be in status ``WAITING``.
        Otherwise, processing the activity will fail.

        After the corresponding ``SubmissionActivity`` has been found, the
        submission ID is extracted from its response payload.  This is then
        used for retrieving the status from the ClinVar API.

        If ClinVar is not done yet with processing the submission, another
        try will be made in ``RETRY_WAIT_SECONDS`` seconds.
        """
        logger.debug("handling retrieval of ClinVar status")
        # Find the corresponding CREATE activity.
        query = crud.submissionactivity.query_by_submissionthread(
            submissionthread_id=await self.thread.awaitable_attrs.id,
            kind=SubmissionActivityKind.CREATE,
        ).limit(1)
        activity_create_db = (await self.session.execute(query)).scalars().first()
        if not activity_create_db:
            raise ValueError("No CREATE activity found")
        logger.debug("found CREATE activity: %s", activity_create_db)
        # Ensure that its status is WAITING and parse out the ``Created`` payload.
        activity_create = SubmissionActivityInDb.model_validate(activity_create_db)
        if activity_create.status != SubmissionActivityStatus.WAITING:
            raise ValueError(f"Activity is in wrong status: {activity_create.status}")
        created = Created.model_validate(activity_create.response_payload)
        logger.debug("parsed created payload: %s", created)
        # Now retrieve the status from ClinVar and store it in the result.
        clinvar_client = await self.make_clinvar_client()
        request_timestamp = datetime.datetime.utcnow()
        response: ResponseMessage | clinvar_api_client.RetrieveStatusResult
        try:
            response = await clinvar_client.retrieve_status(created.id)
            response_timestamp = datetime.datetime.utcnow()
        except Exception as err:
            # An error occured (network issues, code issues, etc.).  This means
            # that this retrieval failed a new retrieval job should be started.
            response = ResponseMessage(text=f"Retrieval failed: {err}")
            response_timestamp = datetime.datetime.utcnow()
            activity_status = SubmissionActivityStatus.FAILED
            thread_status = SubmissionThreadStatus.FAILED
        else:
            # We could receive a response, so there has been no network error etc.
            # We need to look into the response itself to see if the ClinVar server
            # is still working on it, is done, or found an error.
            assert isinstance(response, clinvar_api_client.RetrieveStatusResult)
            status_str = response.status.actions[0].status
            if status_str in ("submitted", "processing"):
                # ClinVar is still working on it, so we need to try again later.
                thread_status = SubmissionThreadStatus.WAITING
                # The activity status is complete, though.
                activity_status = SubmissionActivityStatus.COMPLETE_IN_PROGRESS
            elif status_str == "processed":
                # The processing is complete, both for activity and thread.
                thread_status = SubmissionThreadStatus.SUCCESS
                activity_status = SubmissionActivityStatus.COMPLETE_SUCCESS
            elif status_str == "error":
                # ClinVar found an error in the validation or sanity checking so
                # the whole submission thread is failed.
                thread_status = SubmissionThreadStatus.FAILED
                activity_status = SubmissionActivityStatus.COMPLETE_FAILURE
            else:
                # This should never happen, but we'll be defensive.
                logger.error("Unknown status: %s", status_str)
                thread_status = SubmissionThreadStatus.FAILED
                activity_status = SubmissionActivityStatus.FAILED
        # Update the database records.
        logger.debug("updating activity status to %s", activity_status)
        await crud.submissionactivity.update(
            self.session,
            db_obj=self.activity,
            obj_in={
                "status": activity_status,
                "request_timestamp": request_timestamp,
                "response_timestamp": response_timestamp,
                "response_payload": response.model_dump(mode="json"),
            },
        )
        logger.debug("updating thread status to %s", thread_status)
        await crud.submissionthread.update(
            self.session, db_obj=self.thread, obj_in={"status": thread_status}
        )
        # When still waiting, create activity for the next retrieval.
        if thread_status == SubmissionThreadStatus.WAITING:
            await self.schedule_next_retrieve()
        else:
            logger.debug("retrieval complete, no further job")


class _HandlerWithSession:
    """Used by :ref:`SubmissionActivityHandler` once a session has been established."""

    @classmethod
    async def create(
        cls, session: AsyncSession, activity_uuid: uuid.UUID | str
    ) -> "_HandlerWithSession":
        """Create a new instance.

        This has been put into a classmethod so we can have it async.

        :raises MissingRecord: If the activity or thread is not found.
        :raises InvalidState: If the activity or thread is in the wrong state.
        """
        # Fetch activity and thread / verify that they are present.
        activity = await crud.submissionactivity.get(session, id=activity_uuid)
        if not activity:  # pragma: no cover
            raise MissingRecord(f"No submission activity found for {activity_uuid}")
        thread = await crud.submissionthread.get(session, id=activity.submissionthread_id)
        if not thread:  # pragma: no cover
            raise MissingRecord(f"Submission thread not found for {activity.submissionthread_id}")
        # Ensure that the thread and activity are in the correct state.
        if activity.status != SubmissionActivityStatus.WAITING:  # pragma: no cover
            raise InvalidState(f"Activity status is not submitted: {activity.status}")
        if (
            not thread.status.is_waiting() and not thread.status.is_in_progress()
        ):  # pragma: no cover
            raise InvalidState(f"Thread status is not waiting/in progress: {thread.status}")
        # Actually perform the creation.
        return cls(session, activity, thread)

    def __init__(
        self, session: AsyncSession, activity: SubmissionActivity, thread: SubmissionThread
    ):
        """Initialise the handler."""
        #: The session to use.
        self.session = session
        #: The activity to process.
        self.activity = activity
        #: The activity's thread.
        self.thread = thread

    async def update_status(
        self,
        thread_status: SubmissionThreadStatus,
        activity_status: SubmissionActivityStatus,
        err_msg: typing.Optional[str] = None,
    ):
        """Update the status of a ``self.thread`` and ``self.activity``.

        In the future, this must be done in a transaction.

        :param thread_status: The new thread status.
        :param activity_status: The new activity status.
        :raises DatabaseProblem: If there is a problem with the database.
        """
        try:
            thread_new = await crud.submissionthread.update(
                self.session, db_obj=self.thread, obj_in={"status": thread_status}
            )
            if activity_status == SubmissionActivityStatus.FAILED:
                update = {
                    "status": SubmissionActivityStatus.FAILED,
                    "response_timestamp": datetime.datetime.utcnow(),
                    "response_payload": ResponseMessage(
                        text=f"Submission failed: {err_msg or 'unknown error'}"
                    ).model_dump(mode="json"),
                }
            else:
                update = {"status": activity_status}
            activity_new = await crud.submissionactivity.update(
                self.session, db_obj=self.activity, obj_in=update
            )
            self.thread = thread_new
            self.activity = activity_new
        except Exception as err:  # pragma: no cover
            raise DatabaseProblem(f"Failed to update thread and/or activity status: {err}") from err

    async def run(self) -> None:
        """Dispatch the activity to the appropriate handler."""
        handler: _KindHandlerBase
        if self.activity.kind == SubmissionActivityKind.CREATE:
            handler = _CreateHandler(self.session, self.activity, self.thread)
        elif self.activity.kind == SubmissionActivityKind.RETRIEVE:
            handler = _RetrieveHandler(self.session, self.activity, self.thread)
        else:  # pragma: no cover
            raise ValueError(f"Unknown activity kind: {self.activity.kind}")
        await handler.run()


class SubmissionActivityHandler:
    """Facade class for performing ClinVar submission activities."""

    def __init__(self, submissionactivity_id: str, engine: typing.Optional[AsyncEngine] = None):
        """Initialise the handler.

        :param submissionactivity_id: String with UUID of the activity to process.
        :param engine:
            SQLAlchemy engine to use (for dependency injection), defaults to
            ``app.db.session.engine``.
        """
        #: UUID of :ref:`SubmissionActivity` to process.
        self.uuid = uuid.UUID(submissionactivity_id)
        #: SQLAlchemy engine to use.
        self.engine = engine or app_db_session.engine

    async def run(self):
        """Kick-off the submission activity handling.

        :raises MissingRecord: If the activity or thread is not found.
        :raises InvalidState: If the activity or thread is in the wrong state.
        :raises DatabaseProblem: If there is a problem with the database.
        """
        async with AsyncSession(self.engine) as session:
            # Construct the actual handler for doing the work.  This may raise
            # and we will let it bubble up.
            inner = await _HandlerWithSession.create(session, self.uuid)
            # Update the activity and thread status to IN_PROGRESS.
            await inner.update_status(
                SubmissionThreadStatus.IN_PROGRESS,
                SubmissionActivityStatus.IN_PROGRESS,
            )
            # Now perform the actual processing.
            try:
                await inner.run()
            except Exception as err:
                # Update the activity and thread status to FAILED.
                logger.debug("Marking activity and thread as failed: %s", err)
                await self.update_status(
                    SubmissionThreadStatus.FAILED,
                    SubmissionActivityStatus.FAILED,
                    err_msg=str(err),
                )
