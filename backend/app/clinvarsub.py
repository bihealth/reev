"""Business logic for ClinVar submission."""

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
from app.db import session
from app.models.clinvarsub import (
    ActivityKind,
    ResponseMessage,
    Status,
    SubmissionActivity,
    SubmissionThread,
)
from app.schemas.clinvarsub import (
    SubmissionActivityCreate,
    SubmissionActivityInDb,
    SubmittingOrgInDb,
)
from app.worker import handle_submission_activity

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#: Number of seconds to wait before retrying the next fetch.
RETRY_WAIT_SECONDS = 10  # 10 * 60


class SubmissionActivityHandler:
    """Broker for performing ClinVar submission activities."""

    def __init__(self, submissionactivity: str, engine: typing.Optional[AsyncEngine] = None):
        """Initialise the handler.

        :param submissionactivity: String with UUID of the activity to process.
        :param engine:
            SQLAlchemy engine to use (for dependency injection), defaults to
            ``app.db.session.engine``.
        """
        #: UUID of :ref:`SubmissionActivity` to process.
        self.uuid = uuid.UUID(submissionactivity)
        #: SQLAlchemy engine to use.
        self.engine = engine or session.engine

    async def run(self):
        """Kick-off the submission activity handling."""
        async with AsyncSession(self.engine) as session:
            activity = await crud.submissionactivity.get(session, id=self.uuid)
            if not activity:
                logger.warning("No submission activity found for %s", self.uuid)
                return
            thread = await crud.submissionthread.get(session, id=activity.submissionthread)
            if not thread:
                logger.warning("Submission thread not found for %s", self.activity.submissionthread)
                return
            # Ensure that the thread and activity are in the correct state.
            if activity.status != Status.SUBMITTED:
                logger.warning("Activity status is not submitted: %s", activity.status)
                return
            if thread.status != Status.SUBMITTED:
                logger.warning("Thread status is not submitted: %s", thread.status)
                return
            # Update the activity and thread status to PROCESSING.
            self._update_status(session, thread, activity, Status.PROCESSING)
            # Now perform the actual handling.
            try:
                await self._dispatch_run(activity, thread)
            except Exception as err:
                # Update the activity and thread status to FAILED.
                logger.debug("Marking activity and thread as failed: %s", err)
                self._update_status(session, thread, activity, Status.FAILED, err_msg=str(err))

    async def _dispatch_run(
        self, session: AsyncSession, activity: SubmissionActivity, thread: SubmissionThread
    ):
        """Dispatch the activity to the appropriate handler."""
        if activity.kind == ActivityKind.RETRIEVE:
            await self._handle_retrieve(session, activity, thread)
        elif activity.kind == ActivityKind.CREATE:
            await self._handle_create(session, activity, thread)
        elif activity.kind == ActivityKind.UPDATE:
            await self._handle_update(session, activity, thread)
        elif activity.kind == ActivityKind.DELETE:
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
            submissionthread=thread.id, kind=ActivityKind.CREATE
        ).limit(1)
        activity_create_db = (await session.execute(query)).scalars().first()
        if not activity_create_db:
            raise ValueError("No CREATE activity found")
        logger.debug("found CREATE activity: %s", activity_create_db)
        # Ensure that its status is WAITING and parse out the ``Created`` payload.
        activity_create = SubmissionActivityInDb.model_validate(activity_create_db)
        if activity_create.status != Status.WAITING:
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
            response_status = Status.COMPLETE
            status = Status.COMPLETE
        except Exception as err:
            response = ResponseMessage(text=f"Retrieval failed: {err}")
            response_timestamp = datetime.datetime.utcnow()
            response_status = Status.FAILED
            status = Status.FAILED
        logger.debug("retrieval response: %s, status: %s", response.model_dump(), response_status)
        # Update the database records.
        await crud.submissionactivity.update(
            session,
            db_obj=activity,
            obj_in={
                "status": status,
                "request_timestamp": request_timestamp,
                "response_status": response_status,
                "response_timestamp": response_timestamp,
                "response_payload": response.model_dump(mode="json"),
            },
        )
        await crud.submissionthread.update(
            session, db_obj=thread, obj_in={"status": Status.WAITING}
        )
        # Create a new activity and submit to ClinVar.
        if status == Status.WAITING:
            logger.debug("creating new activity for next retrieval")
            create_obj = SubmissionActivityCreate(
                submissionthread=thread.id,
                kind=ActivityKind.RETRIEVE,
                status=Status.INITIAL,
                request_payload=None,
                request_timestamp=request_timestamp,
                response_status=None,
                response_payload=None,
                response_timestamp=None,
            )
            activity_next = await crud.submissionactivity.create(session, obj_in=create_obj)
            logger.debug("scheduling next execution in %f sec")
            handle_submission_activity.apply_async(
                args=(activity_next.id,), countdown=RETRY_WAIT_SECONDS
            )

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
        activity = SubmissionActivityInDb.model_validate(activity_db)
        if not activity.request_payload:
            raise ValueError("No request payload found in activity record")
        clinvar_client = await self._clinvar_client(session, thread)
        request_timestamp = datetime.datetime.utcnow()
        response: ResponseMessage | Created
        try:
            response = await clinvar_client.submit_data(activity.request_payload)
            response_timestamp = datetime.datetime.utcnow()
            response_status = Status.SUBMITTED
            status = Status.WAITING
        except Exception as err:
            response = ResponseMessage(text=f"Submission failed: {err}")
            response_timestamp = datetime.datetime.utcnow()
            response_status = Status.FAILED
            status = Status.FAILED
        _ = await crud.submissionactivity.update(
            session,
            db_obj=activity_db,
            obj_in={
                "status": status,
                "request_timestamp": request_timestamp,
                "response_status": response_status,
                "response_timestamp": response_timestamp,
                "response_payload": response.model_dump(mode="json"),
            },
        )
        _ = await crud.submissionthread.update(session, db_obj=thread, obj_in={"status": status})

    async def _clinvar_client(
        self, session: AsyncSession, thread: SubmissionThread
    ) -> clinvar_api_client.AsyncClient:
        submittingorg_db = await crud.submittingorg.get(session, id=thread.submittingorg)
        if not submittingorg_db:
            raise ValueError("No submitting org found")
        submittingorg = SubmittingOrgInDb.model_validate(submittingorg_db)
        auth_token = SecretStr(submittingorg.clinvar_api_token)
        clinvar_config = clinvar_api_client.Config(auth_token=auth_token)
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
        status: Status,
        err_msg: typing.Optional[str] = None,
    ):
        """Update the status of a thread and activity.

        In the future, this must be done in a transaction.
        """
        try:
            thread = await crud.submissionthread.update(
                session, db_obj=thread, obj_in={"status": status}
            )
            if status == Status.FAILED:
                update = {
                    "status": Status.FAILED,
                    "response_status": Status.FAILED,
                    "response_timestamp": datetime.datetime.utcnow(),
                    "response_payload": ResponseMessage(
                        text=f"Submission failed: {err_msg or 'unknown error'}"
                    ).model_dump(mode="json"),
                }
            else:
                update = {"status": status}
            activity = await crud.submissionactivity.update(session, db_obj=activity, obj_in=update)
        except Exception as err:
            logger.error("Failed to update thread and/or activity status: %s", err)
            return
