import typing
import uuid

import pytest
from faker.providers.lorem import Provider as LoremProvider
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.schemas.clinvarsub import SubmittingOrgCreate, SubmittingOrgUpdate


@pytest.fixture
def clinvarsub_create() -> SubmittingOrgCreate:
    return SubmittingOrgCreate(label="test", clinvar_api_token="le-token", owner=uuid.uuid4())


@pytest.mark.anyio
async def test_create_get_submittingorg(
    db_session: AsyncSession, clinvarsub_create: SubmittingOrgCreate
):
    """Test creating and retrieving a SubmittingOrg."""
    submittingorg_postcreate = await crud.submittingorg.create(
        session=db_session, obj_in=clinvarsub_create
    )
    stored_item = await crud.submittingorg.get(session=db_session, id=submittingorg_postcreate.id)
    assert stored_item
    assert submittingorg_postcreate.id == stored_item.id
    assert submittingorg_postcreate.label == stored_item.label
    assert submittingorg_postcreate.clinvar_api_token == stored_item.clinvar_api_token


@pytest.mark.anyio
async def test_create_update_adminmessage(
    db_session: AsyncSession, faker: LoremProvider, clinvarsub_create: SubmittingOrgCreate
) -> None:
    submittingorg_update = SubmittingOrgUpdate(
        label=faker.sentence(),
        clinvar_api_token=faker.word(),
    )
    submittingorg_postcreate = await crud.submittingorg.create(
        session=db_session, obj_in=clinvarsub_create
    )
    submittingorg_postupdate = await crud.submittingorg.update(
        session=db_session, db_obj=submittingorg_postcreate, obj_in=submittingorg_update
    )
    assert submittingorg_postupdate
    assert submittingorg_postupdate.label == submittingorg_update.label


@pytest.mark.anyio
async def test_delete_submittingorg(
    db_session: AsyncSession, clinvarsub_create: SubmittingOrgCreate
):
    """Test deleting a submittingorg."""
    submittingorg_postcreate = await crud.submittingorg.create(
        session=db_session, obj_in=clinvarsub_create
    )
    await crud.submittingorg.remove(session=db_session, id=submittingorg_postcreate.id)
