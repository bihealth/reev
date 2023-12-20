import uuid

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.schemas.acmgseqvar import (
    AcmgRank,
    AcmgSeqVarCreate,
    Criteria,
    Evidence,
    Presence,
    SeqVarCriteria,
)


@pytest.fixture
def acmgseqvar_create() -> AcmgSeqVarCreate:
    """Create a AcmgSeqVarCreate object."""
    pm4 = SeqVarCriteria(
        criteria=Criteria.PM4,
        presence=Presence.Absent,
        evidence=Evidence.PathogenicModerate,
    )
    rank = AcmgRank(
        comment="No comment",
        criterias=[pm4],
    )
    return AcmgSeqVarCreate(
        user=uuid.uuid4(),
        seqvar_name="chr0:123:A:C",
        acmg_rank=rank,
    )


@pytest.mark.anyio
async def test_create_get_acmgseqvar(db_session: AsyncSession, acmgseqvar_create: AcmgSeqVarCreate):
    """Test creating and retrieving a acmgseqvar."""
    acmgseqvar_postcreate = await crud.acmgseqvar.create(
        session=db_session, obj_in=acmgseqvar_create
    )
    stored_item = await crud.acmgseqvar.get(
        session=db_session,
        id=acmgseqvar_postcreate.id,
    )
    assert stored_item
    assert acmgseqvar_postcreate.user == stored_item.user
    assert acmgseqvar_postcreate.seqvar_name == stored_item.seqvar_name
    assert acmgseqvar_postcreate.acmg_rank == stored_item.acmg_rank


@pytest.mark.anyio
async def test_delete_acmgseqvar(db_session: AsyncSession, acmgseqvar_create: AcmgSeqVarCreate):
    """Test deleting a acmgseqvar."""
    acmgseqvar_postcreate = await crud.acmgseqvar.create(
        session=db_session, obj_in=acmgseqvar_create
    )
    await crud.acmgseqvar.remove(session=db_session, id=acmgseqvar_postcreate.id)


@pytest.mark.anyio
async def test_get_multi_by_user(db_session: AsyncSession, acmgseqvar_create: AcmgSeqVarCreate):
    """Test get_multi_by_user."""
    acmgseqvar_postcreate = await crud.acmgseqvar.create(
        session=db_session, obj_in=acmgseqvar_create
    )
    stored_item = await crud.acmgseqvar.get_multi_by_user(
        session=db_session,
        user_id=acmgseqvar_postcreate.user,
    )
    assert stored_item
    assert acmgseqvar_postcreate.user == stored_item[0].user
    assert acmgseqvar_postcreate.seqvar_name == stored_item[0].seqvar_name
    assert acmgseqvar_postcreate.acmg_rank == stored_item[0].acmg_rank


@pytest.mark.anyio
async def test_get_by_user(db_session: AsyncSession, acmgseqvar_create: AcmgSeqVarCreate):
    """Test get_by_user."""
    acmgseqvar_postcreate = await crud.acmgseqvar.create(
        session=db_session, obj_in=acmgseqvar_create
    )
    stored_item = await crud.acmgseqvar.get_by_user(
        session=db_session,
        user_id=acmgseqvar_postcreate.user,
        seqvar_name=acmgseqvar_postcreate.seqvar_name,
    )
    assert stored_item
    assert acmgseqvar_postcreate.user == stored_item.user
    assert acmgseqvar_postcreate.seqvar_name == stored_item.seqvar_name
    assert acmgseqvar_postcreate.acmg_rank == stored_item.acmg_rank
