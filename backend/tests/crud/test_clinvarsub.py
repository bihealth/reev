import uuid

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.schemas.clinvarsub import SubmittingOrgCreate


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
