"""Tests for the ``app.clinvarsub`` module.

Primarily, this module implements the ClinVar submission code that uses
celery for processing in the background.  We test the components in
some kind of integration and the whole process.

We attempt to cover most of the error handling branches as there is a
large number of moving parts involved here and we want to make sure that
the code is robust.

The following is a list of major sources of failures of the whole process
as observed during development:

- ClinVar will reject submissions if the automated validation fails
- actual network issues
- there may be logic errors in the code
- there may be improper use of ``await`` as SQLAlchemy uses a lot of
  lazy loading; workarounds with ``awaitable_attrs`` were necessary

We do not attempt to test the following error cases:

- problems with the RabbitMQ message queue
- problems with the database
"""

import datetime
import typing

import pytest
from clinvar_api.models import Created, SubmissionContainer
from clinvar_api.exceptions import SubmissionFailed
from freezegun import freeze_time
from pytest_mock import MockerFixture
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.clinvarsub import RETRY_WAIT_SECONDS, _CreateHandler, _HandlerWithSession
from app.models.clinvarsub import (
    ResponseMessage,
    SubmissionActivity,
    SubmissionActivityKind,
    SubmissionActivityStatus,
    SubmissionThread,
    SubmissionThreadStatus,
    SubmittingOrg,
)
from tests.utils import FREEZE_TIME, FREEZE_TIME_1SEC, async_return

# -- _HandlerWithSession ------------------------------------------------------


@pytest.mark.anyio
async def test_handler_with_session_update_status_in_progress(
    db_session: AsyncSession,
    submissionthread: SubmissionThread,
    submissionactivity: SubmissionActivity,
):
    # arrange:
    submissionactivity = await crud.submissionactivity.update(
        db_session,
        db_obj=submissionactivity,
        obj_in={"kind": SubmissionActivityKind.CREATE, "status": SubmissionActivityStatus.WAITING},
    )
    submissionthread = await crud.submissionthread.update(
        db_session, db_obj=submissionthread, obj_in={"status": SubmissionThreadStatus.WAITING}
    )

    # act:
    handler = await _HandlerWithSession.create(db_session, submissionactivity.id)
    await handler.update_status(
        SubmissionThreadStatus.IN_PROGRESS,
        SubmissionActivityStatus.IN_PROGRESS,
    )

    # assert:
    await db_session.refresh(submissionthread)
    assert submissionthread.status == SubmissionThreadStatus.IN_PROGRESS
    await db_session.refresh(submissionactivity)
    assert submissionactivity.status == SubmissionActivityStatus.IN_PROGRESS
    assert submissionactivity.response_timestamp == None
    assert submissionactivity.response_payload == None


@pytest.mark.anyio
@freeze_time(FREEZE_TIME)
async def test_handler_with_session_update_status_failed(
    db_session: AsyncSession,
    submissionthread: SubmissionThread,
    submissionactivity: SubmissionActivity,
):
    # arrange:
    submissionactivity = await crud.submissionactivity.update(
        db_session,
        db_obj=submissionactivity,
        obj_in={"kind": SubmissionActivityKind.CREATE, "status": SubmissionActivityStatus.WAITING},
    )
    submissionthread = await crud.submissionthread.update(
        db_session, db_obj=submissionthread, obj_in={"status": SubmissionThreadStatus.WAITING}
    )

    # act:
    handler = await _HandlerWithSession.create(db_session, submissionactivity.id)
    await handler.update_status(
        SubmissionThreadStatus.FAILED,
        SubmissionActivityStatus.FAILED,
    )

    # assert:
    await db_session.refresh(submissionthread)
    assert submissionthread.status == SubmissionThreadStatus.FAILED
    await db_session.refresh(submissionactivity)
    assert submissionactivity.status == SubmissionActivityStatus.FAILED
    assert submissionactivity.response_timestamp == datetime.datetime.utcnow()
    assert submissionactivity.response_payload == {"text": "Submission failed: unknown error"}


@pytest.mark.anyio
@pytest.mark.parametrize("kind", ("create", "retrieve"))
async def test_handler_with_session_update_status_in_progress_then_run(
    db_session: AsyncSession,
    submissionthread: SubmissionThread,
    submissionactivity: SubmissionActivity,
    mocker: MockerFixture,
    kind: typing.Literal["create", "retrieve"],
):
    # arrange:
    # mock out the _CreateHandler
    mock_CreateHandler_obj = mocker.MagicMock()
    mock_CreateHandler_obj.run.return_value = async_return(None)
    mock_CreateHandler = mocker.Mock(return_value=mock_CreateHandler_obj)
    mocker.patch("app.clinvarsub._CreateHandler", new=mock_CreateHandler)
    # mock out the _RetrieveHandler
    mock_RetrieveHandler_obj = mocker.MagicMock()
    mock_RetrieveHandler_obj.run.return_value = async_return(None)
    mock_RetrieveHandler = mocker.MagicMock(return_value=mock_RetrieveHandler_obj)
    mocker.patch("app.clinvarsub._RetrieveHandler", new=mock_RetrieveHandler)
    # adjust the activity/thread to be in the right state
    submissionactivity = await crud.submissionactivity.update(
        db_session,
        db_obj=submissionactivity,
        obj_in={
            "kind": SubmissionActivityKind.CREATE
            if kind == "create"
            else SubmissionActivityKind.RETRIEVE,
            "status": SubmissionActivityStatus.WAITING,
        },
    )
    submissionthread = await crud.submissionthread.update(
        db_session, db_obj=submissionthread, obj_in={"status": SubmissionThreadStatus.WAITING}
    )

    # act:
    handler = await _HandlerWithSession.create(db_session, submissionactivity.id)
    await handler.update_status(
        SubmissionThreadStatus.IN_PROGRESS,
        SubmissionActivityStatus.IN_PROGRESS,
    )
    await handler.run()

    # assert:
    if kind == "create":
        mock_CreateHandler_obj.run.assert_called_once()
        mock_RetrieveHandler_obj.run.assert_not_called()
    else:
        mock_CreateHandler_obj.run.assert_not_called()
        mock_RetrieveHandler_obj.run.assert_called_once()
    await db_session.refresh(submissionthread)
    assert submissionthread.status == SubmissionThreadStatus.IN_PROGRESS
    await db_session.refresh(submissionactivity)
    assert submissionactivity.status == SubmissionActivityStatus.IN_PROGRESS


# -- _CreateHandler -----------------------------------------------------------


@pytest.mark.anyio
@freeze_time(FREEZE_TIME)
async def test_create_handler_run_success(
    db_session: AsyncSession,
    submissionthread: SubmissionThread,
    submissionactivity: SubmissionActivity,
    mocker: MockerFixture,
):
    # arrange:
    # mock out clinvar_api_client.AsyncClient
    mock_Client_obj = mocker.MagicMock()
    mock_Client_obj.submit_data.return_value = async_return(Created(id="123"))
    mock_Client = mocker.Mock(return_value=mock_Client_obj)
    mocker.patch("app.clinvarsub.clinvar_api_client.AsyncClient", new=mock_Client)
    # mock out worker.handle_submission_activity.apply_async
    mock_apply_async = mocker.Mock()
    mocker.patch("app.worker.handle_submission_activity.apply_async", new=mock_apply_async)
    # adjust activity and thread to be in the right state
    fake_payload = {"submission_name": "fake_payload"}
    submissionactivity = await crud.submissionactivity.update(
        db_session,
        db_obj=submissionactivity,
        obj_in={
            "kind": SubmissionActivityKind.CREATE,
            "status": SubmissionActivityStatus.WAITING,
            "request_payload": fake_payload,
        },
    )
    submissionthread = await crud.submissionthread.update(
        db_session, db_obj=submissionthread, obj_in={"status": SubmissionThreadStatus.WAITING}
    )

    # act:
    handler = _CreateHandler(db_session, submissionactivity, submissionthread)
    with freeze_time(FREEZE_TIME_1SEC):  # new activity should have a different timestamp
        await handler.run()

    # assert:
    # check call to submit_data
    mock_Client_obj.submit_data.assert_called_once_with(
        SubmissionContainer(
            assertion_criteria=None,
            behalf_org_id=None,
            clinvar_deletion=None,
            clinvar_submission=None,
            clinvar_submission_release_status=None,
            submission_name="fake_payload",
        )
    )
    # check the activity and thread state
    await db_session.refresh(submissionthread)
    assert submissionthread.status == SubmissionThreadStatus.WAITING
    await db_session.refresh(submissionactivity)
    assert submissionactivity.status == SubmissionActivityStatus.WAITING
    with freeze_time(FREEZE_TIME_1SEC):
        assert submissionactivity.response_timestamp == datetime.datetime.utcnow()
    assert submissionactivity.response_payload == {"id": "123"}
    # check newly created activity
    res = await db_session.execute(
        crud.submissionactivity.query_by_submissionthread(submissionthread_id=submissionthread.id)
    )
    latest_activity = res.scalars().first()
    assert latest_activity
    assert await latest_activity.awaitable_attrs.id
    assert latest_activity.id != submissionactivity
    assert latest_activity.kind == SubmissionActivityKind.RETRIEVE
    # check call to apply_async
    mock_apply_async.assert_called_once_with(
        args=(str(latest_activity.id),),
        countdown=RETRY_WAIT_SECONDS,
    )

@pytest.mark.anyio
@freeze_time(FREEZE_TIME)
async def test_create_handler_run_failure(
    db_session: AsyncSession,
    submissionthread: SubmissionThread,
    submissionactivity: SubmissionActivity,
    mocker: MockerFixture,
):
    # arrange:
    # mock out clinvar_api_client.AsyncClient; raise on submit_data
    mock_Client_obj = mocker.MagicMock()
    mock_Client_obj.submit_data.side_effect = mocker.Mock(side_effect=SubmissionFailed('fail for testing'))
    mock_Client = mocker.Mock(return_value=mock_Client_obj)
    mocker.patch("app.clinvarsub.clinvar_api_client.AsyncClient", new=mock_Client)
    # mock out worker.handle_submission_activity.apply_async
    mock_apply_async = mocker.Mock()
    mocker.patch("app.worker.handle_submission_activity.apply_async", new=mock_apply_async)
    # adjust activity and thread to be in the right state
    fake_payload = {"submission_name": "fake_payload"}
    submissionactivity = await crud.submissionactivity.update(
        db_session,
        db_obj=submissionactivity,
        obj_in={
            "kind": SubmissionActivityKind.CREATE,
            "status": SubmissionActivityStatus.WAITING,
            "request_payload": fake_payload,
        },
    )
    submissionthread = await crud.submissionthread.update(
        db_session, db_obj=submissionthread, obj_in={"status": SubmissionThreadStatus.WAITING}
    )

    # act:
    handler = _CreateHandler(db_session, submissionactivity, submissionthread)
    with freeze_time(FREEZE_TIME_1SEC):  # new activity should have a different timestamp
        await handler.run()

    # assert:
    # check call to submit_data
    mock_Client_obj.submit_data.assert_called_once_with(
        SubmissionContainer(
            assertion_criteria=None,
            behalf_org_id=None,
            clinvar_deletion=None,
            clinvar_submission=None,
            clinvar_submission_release_status=None,
            submission_name="fake_payload",
        )
    )
    # check the activity and thread state
    await db_session.refresh(submissionthread)
    assert submissionthread.status == SubmissionThreadStatus.FAILED
    await db_session.refresh(submissionactivity)
    assert submissionactivity.status == SubmissionActivityStatus.FAILED
    with freeze_time(FREEZE_TIME_1SEC):
        assert submissionactivity.response_timestamp == datetime.datetime.utcnow()
    assert submissionactivity.response_payload == {'text': 'Submission failed: fail for testing'}
    # check that we don't have a newly created activity
    res = await db_session.execute(
        crud.submissionactivity.query_by_submissionthread(submissionthread_id=submissionthread.id)
    )
    latest_activity = res.scalars().first()
    assert latest_activity
    assert await latest_activity.awaitable_attrs.id
    assert latest_activity.id == submissionactivity.id
    assert latest_activity.kind == SubmissionActivityKind.CREATE
    # check call to apply_async not performed
    mock_apply_async.assert_not_called()



# -- _RetrieveHandler ---------------------------------------------------------

# missing create activity on retrieve

# -- SubmissionActivityHandler ------------------------------------------------


@pytest.mark.anyio
async def test_submission_activity_handler_create_success_implicit_engine():
    pass


# failures on creation below


@pytest.mark.anyio
async def test_submission_activity_handler_create_success_explicit_engine():
    pass


@pytest.mark.anyio
async def test_submission_activity_handler_create_failure_activity_missing():
    pass


@pytest.mark.anyio
async def test_submission_activity_handler_create_failure_thread_missing():
    pass


@pytest.mark.anyio
async def test_submission_activity_handler_create_failure_activity_invalid_state():
    pass


@pytest.mark.anyio
async def test_submission_activity_handler_create_failure_thread_invalid_state():
    pass


# missing SubmittingOrg

# missing create activity on retrieve
