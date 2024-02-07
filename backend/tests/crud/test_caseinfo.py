import uuid

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.schemas.caseinfo import (
    CaseInfoCreate,
    DiseaseTerm,
    Ethnicity,
    HpoTerm,
    Inheritance,
    Sex,
    Zygosity,
)


@pytest.fixture
def case_create() -> CaseInfoCreate:
    return CaseInfoCreate(
        pseudonym="test1",
        diseases=[DiseaseTerm(omim_id="string", name="string")],
        hpo_terms=[HpoTerm(term_id="string", name="string")],
        inheritance=Inheritance.Unknown,
        affected_family_members=True,
        sex=Sex.Unknown,
        age_of_onset_month=20,
        ethnicity=Ethnicity.Unknown,
        zygosity=Zygosity.Unknown,
        family_segregation=True,
        user=uuid.uuid4(),
    )


@pytest.mark.anyio
async def test_create_get_caseinfo(db_session: AsyncSession, case_create: CaseInfoCreate):
    """Test creating and retrieving a caseinfo."""
    # act:
    caseinfo_postcreate = await crud.caseinfo.create(session=db_session, obj_in=case_create)
    stored_item = await crud.caseinfo.get(session=db_session, id=caseinfo_postcreate.id)
    # assert:
    assert stored_item
    assert caseinfo_postcreate.id == stored_item.id
    assert caseinfo_postcreate.pseudonym == stored_item.pseudonym
    assert caseinfo_postcreate.diseases == stored_item.diseases
    assert caseinfo_postcreate.hpo_terms == stored_item.hpo_terms
    assert caseinfo_postcreate.inheritance == stored_item.inheritance
    assert caseinfo_postcreate.affected_family_members == stored_item.affected_family_members
    assert caseinfo_postcreate.sex == stored_item.sex
    assert caseinfo_postcreate.age_of_onset_month == stored_item.age_of_onset_month
    assert caseinfo_postcreate.ethnicity == stored_item.ethnicity
    assert caseinfo_postcreate.zygosity == stored_item.zygosity
    assert caseinfo_postcreate.family_segregation == stored_item.family_segregation


@pytest.mark.anyio
async def test_delete_caseinfo(db_session: AsyncSession, case_create: CaseInfoCreate):
    """Test deleting a caseinfo."""
    # act:
    caseinfo_postcreate = await crud.caseinfo.create(session=db_session, obj_in=case_create)
    # assert:
    await crud.caseinfo.remove(session=db_session, id=caseinfo_postcreate.id)


@pytest.mark.anyio
async def test_get_multi_by_user(db_session: AsyncSession, case_create: CaseInfoCreate):
    """Test retrieving multiple caseinfos by user."""
    # act:
    caseinfo_postcreate = await crud.caseinfo.create(session=db_session, obj_in=case_create)
    stored_items = await crud.caseinfo.get_multi_by_user(
        session=db_session, user_id=caseinfo_postcreate.user
    )
    # assert:
    assert stored_items
    assert len(stored_items) == 1
    assert caseinfo_postcreate.id == stored_items[0].id
    assert caseinfo_postcreate.pseudonym == stored_items[0].pseudonym
    assert caseinfo_postcreate.diseases == stored_items[0].diseases
    assert caseinfo_postcreate.hpo_terms == stored_items[0].hpo_terms
    assert caseinfo_postcreate.inheritance == stored_items[0].inheritance
    assert caseinfo_postcreate.affected_family_members == stored_items[0].affected_family_members
    assert caseinfo_postcreate.sex == stored_items[0].sex
    assert caseinfo_postcreate.age_of_onset_month == stored_items[0].age_of_onset_month
    assert caseinfo_postcreate.ethnicity == stored_items[0].ethnicity
    assert caseinfo_postcreate.zygosity == stored_items[0].zygosity
    assert caseinfo_postcreate.family_segregation == stored_items[0].family_segregation


@pytest.mark.anyio
async def test_get_by_user(db_session: AsyncSession, case_create: CaseInfoCreate):
    """Test retrieving a caseinfo by user."""
    # act:
    caseinfo_postcreate = await crud.caseinfo.create(session=db_session, obj_in=case_create)
    stored_item = await crud.caseinfo.get_by_user(
        session=db_session,
        user_id=caseinfo_postcreate.user,
    )
    # assert:
    assert stored_item
    assert caseinfo_postcreate.id == stored_item.id
    assert caseinfo_postcreate.pseudonym == stored_item.pseudonym
    assert caseinfo_postcreate.diseases == stored_item.diseases
    assert caseinfo_postcreate.hpo_terms == stored_item.hpo_terms
    assert caseinfo_postcreate.inheritance == stored_item.inheritance
    assert caseinfo_postcreate.affected_family_members == stored_item.affected_family_members
    assert caseinfo_postcreate.sex == stored_item.sex
    assert caseinfo_postcreate.age_of_onset_month == stored_item.age_of_onset_month
    assert caseinfo_postcreate.ethnicity == stored_item.ethnicity
    assert caseinfo_postcreate.zygosity == stored_item.zygosity
    assert caseinfo_postcreate.family_segregation == stored_item.family_segregation
