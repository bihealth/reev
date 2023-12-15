"""Business logic for ClinVar submission."""

import asyncio
import datetime
import logging
import typing
import uuid
import xml.etree.ElementTree as ET

import clinvar_api.client as clinvar_api_client
import httpx
from clinvar_api.models import Created
from pydantic import SecretStr
from sqlalchemy.ext.asyncio import AsyncConnection, AsyncEngine, AsyncSession, AsyncTransaction
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.db import session
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


class SubmissionActivityHandler:
    """Broker for performing ClinVar submission activities."""

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
        self.engine = engine or session.engine

    async def run(self):
        """Kick-off the submission activity handling."""
        async with AsyncSession(self.engine) as session:
            activity = await crud.submissionactivity.get(session, id=self.uuid)
            if not activity:
                logger.warning("No submission activity found for %s", self.uuid)
                return
            thread = await crud.submissionthread.get(session, id=activity.submissionthread_id)
            if not thread:
                logger.warning("Submission thread not found for %s", activity.submissionthread)
                return
            # Ensure that the thread and activity are in the correct state.
            if activity.status != SubmissionActivityStatus.WAITING:
                logger.warning("Activity status is not submitted: %s", activity.status)
                return
            if not thread.status.is_waiting() and not thread.status.is_in_progress():
                logger.warning("Thread status is not waiting/in progress: %s", thread.status)
                return
            # Update the activity and thread status to IN_PROGRESS.
            # import pdb; pdb.set_trace()
            thread_new, activity_new = await self._update_status(
                session,
                thread,
                activity,
                SubmissionThreadStatus.IN_PROGRESS,
                SubmissionActivityStatus.IN_PROGRESS,
            )
            # Now perform the actual handling.
            # import pdb; pdb.set_trace()
            # await self._dispatch_run(session, activity_new, thread_new)
            try:
                await self._dispatch_run(session, activity_new, thread_new)
            except Exception as err:
                # Update the activity and thread status to FAILED.
                logger.debug("Marking activity and thread as failed: %s", err)
                await self._update_status(
                    session,
                    thread,
                    activity,
                    SubmissionThreadStatus.FAILED,
                    SubmissionActivityStatus.FAILED,
                    err_msg=str(err),
                )
                raise  # XXX dev / debug only

    async def _dispatch_run(
        self, session: AsyncSession, activity: SubmissionActivity, thread: SubmissionThread
    ):
        """Dispatch the activity to the appropriate handler."""
        if activity.kind == SubmissionActivityKind.RETRIEVE:
            await self._handle_retrieve(session, activity, thread)
        elif activity.kind == SubmissionActivityKind.CREATE:
            # import pdb; pdb.set_trace()
            await self._handle_create(session, activity, thread)
        elif activity.kind == SubmissionActivityKind.UPDATE:
            await self._handle_update(session, activity, thread)
        elif activity.kind == SubmissionActivityKind.DELETE:
            await self._handle_delete(session, activity, thread)
        else:
            raise ValueError(f"Unknown activity kind: {activity.kind}")

    async def _handle_retrieve(
        self, session: AsyncSession, activity: SubmissionActivity, thread: SubmissionThread
    ):
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
            submissionthread_id=await thread.awaitable_attrs.id, kind=SubmissionActivityKind.CREATE
        ).limit(1)
        activity_create_db = (await session.execute(query)).scalars().first()
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
        clinvar_client = await self._clinvar_client(session, thread)
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
            session,
            db_obj=activity,
            obj_in={
                "status": activity_status,
                "request_timestamp": request_timestamp,
                "response_timestamp": response_timestamp,
                "response_payload": response.model_dump(mode="json"),
            },
        )
        logger.debug("updating thread status to %s", thread_status)
        await crud.submissionthread.update(session, db_obj=thread, obj_in={"status": thread_status})
        # When still waiting, create activity for the next retrieval.
        if thread_status == SubmissionThreadStatus.WAITING:
            await self._schedule_next_retrieve(session, thread)
        else:
            logger.debug("retrieval complete, no further job")

    async def _handle_create(
        self, session: AsyncSession, activity_db: SubmissionActivity, thread: SubmissionThread
    ):
        """Submit a new submission to ClinVar.

        This will try to submit the already prepared payload to ClinVar and
        store the response or store an error message.  In the case of a
        successful post, the SCV can be parsed from the ``Created`` response.

        A RETRIEVE action must be performed periodically to eventually
        retrieve the effective SCV once ClinVar has finished processing.
        """
        logger.debug("handling submission to ClinVar")
        activity = SubmissionActivityInDb.model_validate(activity_db)
        logger.debug("activity: %s", activity.model_dump(mode="json"))
        if not activity.request_payload:
            raise ValueError("No request payload found in activity record")
        # import pdb; pdb.set_trace()
        clinvar_client = await self._clinvar_client(session, thread)
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
            session,
            db_obj=activity_db,
            obj_in={
                "status": activity_status,
                "request_timestamp": request_timestamp,
                "response_timestamp": response_timestamp,
                "response_payload": response.model_dump(mode="json"),
            },
        )
        thread_new = await crud.submissionthread.update(
            session, db_obj=thread, obj_in={"status": thread_status}
        )
        # wait for all attributes to be present
        await asyncio.gather(activity_new.awaitable_attrs.id, thread_new.awaitable_attrs.id)
        logger.debug(
            "activity after update: %s",
            SubmissionActivityInDb.model_validate(activity_new).model_dump(mode="json"),
        )
        logger.debug(
            "thread after update: %s",
            SubmissionThreadInDb.model_validate(thread_new).model_dump(mode="json"),
        )
        # Create activity for the next retrieval.
        await self._schedule_next_retrieve(session, thread)

    async def _clinvar_client(
        self, session: AsyncSession, thread: SubmissionThread
    ) -> clinvar_api_client.AsyncClient:
        submittingorg_db = await crud.submittingorg.get(
            session, id=await thread.awaitable_attrs.submittingorg_id
        )
        if not submittingorg_db:
            raise ValueError("No submitting org found")
        submittingorg = SubmittingOrgInDb.model_validate(submittingorg_db)
        auth_token = SecretStr(submittingorg.clinvar_api_token)
        clinvar_config = clinvar_api_client.Config(
            auth_token=auth_token,
            use_testing=not settings.CLINVAR_USE_PRODUCTION,
        )
        return clinvar_api_client.AsyncClient(clinvar_config)

    async def _handle_update(
        self, session: AsyncSession, activity: SubmissionActivity, thread: SubmissionThread
    ):
        """Handle an update activity."""
        raise NotImplementedError

    async def _handle_delete(
        self, session: AsyncSession, activity: SubmissionActivity, thread: SubmissionThread
    ):
        """Handle a delete activity."""
        raise NotImplementedError

    async def _update_status(
        self,
        session: AsyncSession,
        thread: SubmissionThread,
        activity: SubmissionActivity,
        thread_status: SubmissionThreadStatus,
        activity_status: SubmissionActivityStatus,
        err_msg: typing.Optional[str] = None,
    ) -> typing.Tuple[SubmissionThread, SubmissionActivity]:
        """Update the status of a thread and activity.

        In the future, this must be done in a transaction.
        """
        try:
            # import pdb; pdb.set_trace()
            thread_new = await crud.submissionthread.update(
                session, db_obj=thread, obj_in={"status": thread_status}
            )
            # import pdb; pdb.set_trace()
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
                session, db_obj=activity, obj_in=update
            )
            # import pdb; pdb.set_trace()
            return thread_new, activity_new
        except Exception as err:
            # import pdb; pdb.set_trace()
            logger.error("Failed to update thread and/or activity status: %s", err)
            return thread, activity

    async def _schedule_next_retrieve(self, session: AsyncSession, thread: SubmissionThread):
        logger.debug("creating new activity for next retrieval of %s", thread.id)
        create_obj = SubmissionActivityCreate(
            submissionthread_id=thread.id,
            kind=SubmissionActivityKind.RETRIEVE,
            status=SubmissionActivityStatus.WAITING,
            request_payload=None,
            request_timestamp=None,
            response_payload=None,
            response_timestamp=None,
        )
        activity_next = await crud.submissionactivity.create(session, obj_in=create_obj)
        logger.debug("scheduling next execution in %f sec", RETRY_WAIT_SECONDS)
        res = handle_submission_activity.apply_async(
            args=(str(activity_next.id),), countdown=RETRY_WAIT_SECONDS
        )
        logger.debug("res = %s", res)
