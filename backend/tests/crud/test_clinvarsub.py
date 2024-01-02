import logging

import pytest
from faker.providers.lorem import Provider as LoremProvider
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.models.clinvarsub import SubmissionActivityStatus, SubmissionThreadStatus, VariantPresence
from app.schemas.clinvarsub import (
    SubmissionActivityCreate,
    SubmissionThreadCreate,
    SubmissionThreadUpdate,
    SubmittingOrgCreate,
    SubmittingOrgUpdate,
)


@pytest.mark.anyio
async def test_create_get_submittingorg(
    db_session: AsyncSession, submittingorg_create: SubmittingOrgCreate
):
    """Test creating and retrieving a SubmittingOrg."""
    # act:
    submittingorg_postcreate = await crud.submittingorg.create(
        session=db_session, obj_in=submittingorg_create
    )
    stored_item = await crud.submittingorg.get(session=db_session, id=submittingorg_postcreate.id)
    # assert:
    assert stored_item
    assert submittingorg_postcreate.id == stored_item.id
    assert submittingorg_postcreate.label == stored_item.label
    assert submittingorg_postcreate.clinvar_api_token == stored_item.clinvar_api_token


@pytest.mark.anyio
async def test_create_update_submittingorg(
    db_session: AsyncSession, faker: LoremProvider, submittingorg_create: SubmittingOrgCreate
) -> None:
    # arrange:
    submittingorg_update = SubmittingOrgUpdate(
        label=faker.sentence(),
        clinvar_api_token=faker.word(),
    )
    submittingorg_postcreate = await crud.submittingorg.create(
        session=db_session, obj_in=submittingorg_create
    )
    # act:
    submittingorg_postupdate = await crud.submittingorg.update(
        session=db_session, db_obj=submittingorg_postcreate, obj_in=submittingorg_update
    )
    # assert:
    assert submittingorg_postupdate
    assert submittingorg_postupdate.label == submittingorg_update.label


@pytest.mark.anyio
async def test_delete_submittingorg(
    db_session: AsyncSession, submittingorg_create: SubmittingOrgCreate
):
    """Test deleting a submittingorg."""
    # arrange:
    submittingorg_postcreate = await crud.submittingorg.create(
        session=db_session, obj_in=submittingorg_create
    )
    # act:
    await crud.submittingorg.remove(session=db_session, id=submittingorg_postcreate.id)
    # assert:
    # In this case, you might want to assert that the item no longer exists in the database.


@pytest.mark.anyio
async def test_create_get_submissionthread(
    db_session: AsyncSession, submissionthread_create: SubmissionThreadCreate
):
    """Test creating and retrieving a SubmittingOrg."""
    # act:
    submissionthread_postcreate = await crud.submissionthread.create(
        session=db_session, obj_in=submissionthread_create
    )
    stored_item = await crud.submissionthread.get(
        session=db_session, id=submissionthread_postcreate.id
    )
    # assert:
    assert stored_item
    assert submissionthread_postcreate.id == stored_item.id
    assert submissionthread_postcreate.desired_presence == stored_item.desired_presence
    assert submissionthread_postcreate.status == stored_item.status
    assert submissionthread_postcreate.submittingorg_id == stored_item.submittingorg_id
    assert submissionthread_postcreate.primary_variant_desc == stored_item.primary_variant_desc


@pytest.mark.anyio
async def test_create_update_submissionthread(
    db_session: AsyncSession, submissionthread_create: SubmissionThreadCreate
) -> None:
    """Test creating and updating a submissionthread."""
    # arrange:
    submissionthread_update = SubmissionThreadUpdate(
        status=SubmissionThreadStatus.IN_PROGRESS,
        effective_scv="SCV000000001",
        desired_presence=VariantPresence.PRESENT,
        effective_presence=VariantPresence.PRESENT,
    )
    # act:
    submissionthread_postcreate = await crud.submissionthread.create(
        session=db_session, obj_in=submissionthread_create
    )
    submissionthread_postupdate = await crud.submissionthread.update(
        session=db_session, db_obj=submissionthread_postcreate, obj_in=submissionthread_update
    )
    # assert:
    assert submissionthread_postupdate
    assert submissionthread_postcreate.status == submissionthread_update.status
    assert submissionthread_postcreate.desired_presence == submissionthread_update.desired_presence
    assert submissionthread_postcreate.effective_scv == submissionthread_update.effective_scv
    assert (
        submissionthread_postcreate.effective_presence == submissionthread_update.effective_presence
    )
    assert (
        submissionthread_postcreate.primary_variant_desc
        == submissionthread_create.primary_variant_desc
    )
    assert submissionthread_postcreate.submittingorg_id == submissionthread_create.submittingorg_id


@pytest.mark.anyio
async def test_delete_submissionthread(
    db_session: AsyncSession, submissionthread_create: SubmissionThreadCreate
):
    """Test deleting a submissionthread."""
    submissionthread_postcreate = await crud.submissionthread.create(
        session=db_session, obj_in=submissionthread_create
    )
    await crud.submissionthread.remove(session=db_session, id=submissionthread_postcreate.id)


@pytest.mark.anyio
async def test_create_get_submissionactivity(
    db_session: AsyncSession, submissionactivity_create: SubmissionActivityCreate
):
    """Test creating and retrieving a SubmittingOrg."""
    # arrange:
    submissionactivity_postcreate = await crud.submissionactivity.create(
        session=db_session, obj_in=submissionactivity_create
    )
    # act:
    stored_item = await crud.submissionactivity.get(
        session=db_session, id=submissionactivity_postcreate.id
    )
    # assert:
    assert stored_item
    assert submissionactivity_postcreate.id == stored_item.id
    assert submissionactivity_postcreate.submissionthread_id == stored_item.submissionthread_id
    assert submissionactivity_postcreate.kind == stored_item.kind
    assert submissionactivity_postcreate.status == stored_item.status
    assert submissionactivity_postcreate.request_payload == stored_item.request_payload
    assert submissionactivity_postcreate.request_timestamp == stored_item.request_timestamp
    assert submissionactivity_postcreate.response_payload == stored_item.response_payload
    assert submissionactivity_postcreate.response_timestamp == stored_item.response_timestamp
