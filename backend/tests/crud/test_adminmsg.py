import typing

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.schemas.adminmsg import AdminMessageCreate, AdminMessageUpdate


@pytest.fixture
def adminmessage_create(faker: typing.Any) -> AdminMessageCreate:
    return AdminMessageCreate(
        title=faker.sentence(),
        text=faker.paragraph(),
        enabled=True,
        active_start=faker.past_date(),
        active_stop=faker.future_date(),
    )


@pytest.mark.asyncio
async def test_create_get_adminmessage(
    db_session: AsyncSession, adminmessage_create: AdminMessageCreate
):
    adminmessage_postcreate = await crud.adminmessage.create(
        session=db_session, obj_in=adminmessage_create
    )
    stored_item = await crud.adminmessage.get(session=db_session, id=adminmessage_postcreate.id)
    assert stored_item
    assert adminmessage_postcreate.id == stored_item.id
    assert adminmessage_postcreate.text == stored_item.text
    assert adminmessage_postcreate.active_start == stored_item.active_start
    assert adminmessage_postcreate.active_stop == stored_item.active_stop


@pytest.mark.asyncio
async def test_create_update_adminmessage(
    db_session: AsyncSession, faker: typing.Any, adminmessage_create: AdminMessageCreate
) -> None:
    adminmessage_update = AdminMessageUpdate(
        title=faker.sentence(),
    )
    adminmessage_postcreate = await crud.adminmessage.create(
        session=db_session, obj_in=adminmessage_create
    )
    adminmessage_postupdate = await crud.adminmessage.update(
        session=db_session, db_obj=adminmessage_postcreate, obj_in=adminmessage_update
    )
    assert adminmessage_postupdate
    assert adminmessage_postupdate.title == adminmessage_update.title


@pytest.mark.asyncio
async def test_delete_adminmessage(
    db_session: AsyncSession, adminmessage_create: AdminMessageCreate
):
    adminmessage_postcreate = await crud.adminmessage.create(
        session=db_session, obj_in=adminmessage_create
    )
    await crud.adminmessage.remove(session=db_session, id=adminmessage_postcreate.id)
    adminmessage_postdelete = await crud.adminmessage.get(
        session=db_session, id=adminmessage_postcreate.id
    )
    assert adminmessage_postdelete is None
