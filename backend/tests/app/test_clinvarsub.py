"""Tests for the ``app.clinvarsub`` module.

Primarily, this module implements the ClinVar submission code that uses
celery for processing in the background.

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

import clinvar_api.client as clinvar_api_client
import pytest
from clinvar_api.exceptions import QueryFailed, SubmissionFailed
from clinvar_api.models import Created, SubmissionContainer
from freezegun import freeze_time
from pytest_mock import MockerFixture
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession

from app import crud
from app.clinvarsub import (
    RETRY_WAIT_SECONDS,
    SubmissionActivityHandler,
    _HandlerWithSession,
    _ModifyHandler,
    _RetrieveHandler,
)
from app.models.clinvarsub import (
    ResponseMessage,
    SubmissionActivity,
    SubmissionActivityKind,
    SubmissionActivityStatus,
    SubmissionThread,
    SubmissionThreadStatus,
    SubmittingOrg,
)
from tests.utils import FREEZE_TIME, FREEZE_TIME_1SEC, FREEZE_TIME_2SEC, async_return

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
    # mock out the _ModifyHandler
    mock_ModifyHandler_obj = mocker.MagicMock()
    mock_ModifyHandler_obj.run.return_value = async_return(None)
    mock_ModifyHandler = mocker.Mock(return_value=mock_ModifyHandler_obj)
    mocker.patch("app.clinvarsub._ModifyHandler", new=mock_ModifyHandler)
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
        mock_ModifyHandler_obj.run.assert_called_once()
        mock_RetrieveHandler_obj.run.assert_not_called()
    else:
        mock_ModifyHandler_obj.run.assert_not_called()
        mock_RetrieveHandler_obj.run.assert_called_once()
    await db_session.refresh(submissionthread)
    assert submissionthread.status == SubmissionThreadStatus.IN_PROGRESS
    await db_session.refresh(submissionactivity)
    assert submissionactivity.status == SubmissionActivityStatus.IN_PROGRESS


# -- _ModifyHandler -----------------------------------------------------------


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
    handler = _ModifyHandler(db_session, submissionactivity, submissionthread)
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
    submissionactivity: SubmissionActivity,  # kind=CREATE
    mocker: MockerFixture,
):
    # arrange:
    # mock out clinvar_api_client.AsyncClient; raise on submit_data
    mock_Client_obj = mocker.MagicMock()
    mock_Client_obj.submit_data.side_effect = mocker.Mock(
        side_effect=QueryFailed("fail for testing")
    )
    mock_Client = mocker.Mock(return_value=mock_Client_obj)
    mocker.patch("app.clinvarsub.clinvar_api_client.AsyncClient", new=mock_Client)
    # mock out worker.handle_submission_activity.apply_async
    mock_apply_async = mocker.Mock()
    mocker.patch("app.worker.handle_submission_activity.apply_async", new=mock_apply_async)
    # adjust activity and thread to be in the right state
    fake_payload = {"submission_name": "fake payload"}
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
    handler = _ModifyHandler(db_session, submissionactivity, submissionthread)
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
            submission_name=fake_payload["submission_name"],
        )
    )
    # check the activity and thread state
    await db_session.refresh(submissionthread)
    assert submissionthread.status == SubmissionThreadStatus.FAILED
    await db_session.refresh(submissionactivity)
    assert submissionactivity.status == SubmissionActivityStatus.FAILED
    with freeze_time(FREEZE_TIME_1SEC):
        assert submissionactivity.response_timestamp == datetime.datetime.utcnow()
    assert submissionactivity.response_payload == {"text": "Submission failed: fail for testing"}
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


@pytest.mark.anyio
@freeze_time(FREEZE_TIME)
@pytest.mark.parametrize(
    "status_str, e_thread_status, e_activity_status,",
    (
        (
            "submitted",
            SubmissionThreadStatus.WAITING,
            SubmissionActivityStatus.COMPLETE_IN_PROGRESS,
        ),
        (
            "processing",
            SubmissionThreadStatus.WAITING,
            SubmissionActivityStatus.COMPLETE_IN_PROGRESS,
        ),
        (
            "processed",
            SubmissionThreadStatus.SUCCESS,
            SubmissionActivityStatus.COMPLETE_SUCCESS,
        ),
        (
            "error",
            SubmissionThreadStatus.FAILED,
            SubmissionActivityStatus.COMPLETE_FAILURE,
        ),
        (
            "INVALID",
            SubmissionThreadStatus.FAILED,
            SubmissionActivityStatus.FAILED,
        ),
    ),
)
async def test_retrieve_handler_run_retrieval_worked(
    db_session: AsyncSession,
    submissionthread: SubmissionThread,
    submissionactivity: SubmissionActivity,  # kind=CREATE
    submissionactivity_kind_retrieve: SubmissionActivity,  # kind=RETRIEVE
    mocker: MockerFixture,
    status_str: typing.Literal["submitted", "processing", "processed", "error", "INVALID"],
    e_thread_status: SubmissionThreadStatus,
    e_activity_status: SubmissionActivityStatus,
):
    # arrange:
    # mock out clinvar_api_client.AsyncClient; result status is status_str
    mock_Client_obj = mocker.MagicMock()
    mock_Client_obj.retrieve_status.side_effect = mocker.Mock(
        return_value=async_return(
            clinvar_api_client.RetrieveStatusResult.model_validate(
                {
                    "status": {
                        "actions": [
                            {
                                "id": "some-id",
                                "responses": [],
                                "status": status_str,
                                "target_db": "clinvar",
                                "updated": FREEZE_TIME,
                            }
                        ]
                    },
                    "summaries": {},
                }
            )
        )
    )
    mock_Client = mocker.Mock(return_value=mock_Client_obj)
    mocker.patch("app.clinvarsub.clinvar_api_client.AsyncClient", new=mock_Client)
    # mock out worker.handle_submission_activity.apply_async
    mock_apply_async = mocker.Mock()
    mocker.patch("app.worker.handle_submission_activity.apply_async", new=mock_apply_async)
    # adjust activity and thread to be in the right state
    fake_payload = {"id": "123"}
    submissionactivity = await crud.submissionactivity.update(
        db_session,
        db_obj=submissionactivity,
        obj_in={
            "kind": SubmissionActivityKind.CREATE,
            "status": SubmissionActivityStatus.WAITING,
            "response_payload": fake_payload,
        },
    )
    submissionactivity_kind_retrieve = await crud.submissionactivity.update(
        db_session,
        db_obj=submissionactivity_kind_retrieve,
        obj_in={"status": SubmissionActivityStatus.WAITING},
    )
    submissionthread = await crud.submissionthread.update(
        db_session, db_obj=submissionthread, obj_in={"status": SubmissionThreadStatus.WAITING}
    )

    # act:
    handler = _RetrieveHandler(db_session, submissionactivity_kind_retrieve, submissionthread)
    with freeze_time(FREEZE_TIME_2SEC):  # new activity should have a different timestamp
        await handler.run()

    # assert:
    # check call to submit_data
    mock_Client_obj.retrieve_status.assert_called_once_with(fake_payload["id"])
    # check the activity and thread state
    await db_session.refresh(submissionthread)
    assert submissionthread.status == e_thread_status
    await db_session.refresh(submissionactivity_kind_retrieve)
    assert submissionactivity_kind_retrieve.status == e_activity_status
    with freeze_time(FREEZE_TIME_2SEC):
        assert submissionactivity_kind_retrieve.response_timestamp == datetime.datetime.utcnow()
    assert submissionactivity_kind_retrieve.response_payload == {
        "status": {
            "actions": [
                {
                    "id": "some-id",
                    "responses": [],
                    "status": status_str,
                    "target_db": "clinvar",
                    "updated": FREEZE_TIME,
                }
            ]
        },
        "summaries": {},
    }
    # check newly created activity
    res = await db_session.execute(
        crud.submissionactivity.query_by_submissionthread(submissionthread_id=submissionthread.id)
    )
    latest_activity = res.scalars().first()
    assert latest_activity
    assert await latest_activity.awaitable_attrs.id
    if e_thread_status == SubmissionThreadStatus.WAITING:
        assert latest_activity.id != submissionactivity_kind_retrieve.id
        assert latest_activity.kind == SubmissionActivityKind.RETRIEVE
        # check call to apply_async
        mock_apply_async.assert_called_once_with(
            args=(str(latest_activity.id),), countdown=RETRY_WAIT_SECONDS
        )
    else:
        assert latest_activity.id == submissionactivity_kind_retrieve.id
        assert latest_activity.kind == SubmissionActivityKind.RETRIEVE
        # check that no call to apply_async was performed
        mock_apply_async.assert_not_called()


@pytest.mark.anyio
@freeze_time(FREEZE_TIME)
async def test_retrieve_handler_run_retrieval_failed(
    db_session: AsyncSession,
    submissionthread: SubmissionThread,
    submissionactivity: SubmissionActivity,  # kind=CREATE
    submissionactivity_kind_retrieve: SubmissionActivity,  # kind=RETRIEVE
    mocker: MockerFixture,
):
    # arrange:
    # mock out clinvar_api_client.AsyncClient; raise on retrieve_status
    mock_Client_obj = mocker.MagicMock()
    mock_Client_obj.retrieve_status.side_effect = mocker.Mock(
        side_effect=SubmissionFailed("fail for testing")
    )
    mock_Client = mocker.Mock(return_value=mock_Client_obj)
    mocker.patch("app.clinvarsub.clinvar_api_client.AsyncClient", new=mock_Client)
    # mock out worker.handle_submission_activity.apply_async
    mock_apply_async = mocker.Mock()
    mocker.patch("app.worker.handle_submission_activity.apply_async", new=mock_apply_async)
    # adjust activity and thread to be in the right state
    fake_payload = {"id": "123"}
    submissionactivity = await crud.submissionactivity.update(
        db_session,
        db_obj=submissionactivity,
        obj_in={
            "kind": SubmissionActivityKind.CREATE,
            "status": SubmissionActivityStatus.WAITING,
            "response_payload": fake_payload,
        },
    )
    submissionactivity_kind_retrieve = await crud.submissionactivity.update(
        db_session,
        db_obj=submissionactivity_kind_retrieve,
        obj_in={"status": SubmissionActivityStatus.WAITING},
    )
    submissionthread = await crud.submissionthread.update(
        db_session, db_obj=submissionthread, obj_in={"status": SubmissionThreadStatus.WAITING}
    )

    # act:
    handler = _RetrieveHandler(db_session, submissionactivity_kind_retrieve, submissionthread)
    with freeze_time(FREEZE_TIME_1SEC):  # new activity should have a different timestamp
        await handler.run()

    # assert:
    # check call to retrieve_status
    mock_Client_obj.retrieve_status.assert_called_once_with(fake_payload["id"])
    # check the activity and thread state
    await db_session.refresh(submissionthread)
    assert submissionthread.status == SubmissionThreadStatus.FAILED
    await db_session.refresh(submissionactivity_kind_retrieve)
    assert submissionactivity_kind_retrieve.status == SubmissionActivityStatus.FAILED
    with freeze_time(FREEZE_TIME_1SEC):
        assert submissionactivity_kind_retrieve.response_timestamp == datetime.datetime.utcnow()
    assert submissionactivity_kind_retrieve.response_payload == {
        "text": "Retrieval failed: fail for testing"
    }
    # check that we don't have a newly created activity
    res = await db_session.execute(
        crud.submissionactivity.query_by_submissionthread(submissionthread_id=submissionthread.id)
    )
    latest_activity = res.scalars().first()
    assert latest_activity
    assert await latest_activity.awaitable_attrs.id
    assert latest_activity.id == submissionactivity_kind_retrieve.id
    assert latest_activity.kind == SubmissionActivityKind.RETRIEVE
    # check call to apply_async not performed
    mock_apply_async.assert_not_called()


# -- SubmissionActivityHandler ------------------------------------------------


@pytest.mark.anyio
async def test_submission_activity_handler_create_success(
    db_engine: AsyncEngine,
    submissionactivity: SubmissionActivity,  # kind=CREATE
    mocker: MockerFixture,
):
    # arrange:
    # mock out _HandlerWithSession
    mock_HandlerWithSession_obj = mocker.MagicMock(name="mock_HandlerWithSession_obj")
    mock_HandlerWithSession_obj.update_status.return_value = async_return(None)
    mock_HandlerWithSession_obj.run.return_value = async_return(None)
    mock_HandlerWithSession_create = mocker.Mock(
        name="mock_HandlerWithSession_create",
        return_value=async_return(mock_HandlerWithSession_obj),
    )
    mocker.patch("app.clinvarsub._HandlerWithSession.create", new=mock_HandlerWithSession_create)

    # act:
    handler = SubmissionActivityHandler(submissionactivity.id, db_engine)
    await handler.run()

    # assert:
    # check call to create
    mock_HandlerWithSession_create.assert_called_once_with(mocker.ANY, submissionactivity.id)
    mock_HandlerWithSession_obj.update_status.assert_called_once_with(
        SubmissionThreadStatus.IN_PROGRESS,
        SubmissionActivityStatus.IN_PROGRESS,
    )
    mock_HandlerWithSession_obj.run.assert_called_once_with()


@pytest.mark.anyio
async def test_submission_activity_handler_create_failed(
    db_engine: AsyncEngine,
    submissionactivity: SubmissionActivity,  # kind=CREATE
    mocker: MockerFixture,
):
    # arrange:
    # mock out _HandlerWithSession
    mock_HandlerWithSession_obj = mocker.MagicMock(name="mock_HandlerWithSession_obj")
    mock_HandlerWithSession_obj.update_status.return_value = async_return(None)
    mock_HandlerWithSession_obj.run.side_effect = mocker.Mock(
        side_effect=Exception("fail for testing")
    )
    mock_HandlerWithSession_create = mocker.Mock(
        name="mock_HandlerWithSession_create",
        return_value=async_return(mock_HandlerWithSession_obj),
    )
    mocker.patch("app.clinvarsub._HandlerWithSession.create", new=mock_HandlerWithSession_create)

    # act:
    handler = SubmissionActivityHandler(submissionactivity.id, db_engine)
    await handler.run()

    # assert:
    # check call to create
    mock_HandlerWithSession_create.assert_called_once_with(mocker.ANY, submissionactivity.id)
    assert mock_HandlerWithSession_obj.update_status.call_count == 2
    mock_HandlerWithSession_obj.update_status.assert_has_calls(
        (
            mocker.call(
                SubmissionThreadStatus.IN_PROGRESS,
                SubmissionActivityStatus.IN_PROGRESS,
            ),
            mocker.call(
                SubmissionThreadStatus.FAILED,
                SubmissionActivityStatus.FAILED,
                err_msg="fail for testing",
            ),
        )
    )
