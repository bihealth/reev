import typing

import pytest
from app import crud
from app.schemas.adminmsg import AdminMessageCreate, AdminMessageUpdate
from sqlalchemy.orm import Session


@pytest.fixture
def adminmessage_create(faker: typing.Any) -> AdminMessageCreate:
    return AdminMessageCreate(
        title=faker.sentence(),
        text=faker.paragraph(),
        enabled=True,
        active_start=faker.past_date(),
        active_stop=faker.future_date(),
    )


def test_create_get_adminmessage(db: Session, adminmessage_create: AdminMessageCreate) -> None:
    adminmessage_postcreate = crud.adminmessage.create(db=db, obj_in=adminmessage_create)
    stored_item = crud.adminmessage.get(db=db, id=adminmessage_postcreate.id)
    assert stored_item
    assert adminmessage_postcreate.id == stored_item.id
    assert adminmessage_postcreate.uuid == stored_item.uuid
    assert adminmessage_postcreate.text == stored_item.text
    assert adminmessage_postcreate.active_start == stored_item.active_start
    assert adminmessage_postcreate.active_stop == stored_item.active_stop


def test_create_update_adminmessage(
    db: Session, faker: typing.Any, adminmessage_create: AdminMessageCreate
) -> None:
    adminmessage_update = AdminMessageUpdate(
        title=faker.sentence(),
    )
    adminmessage_postcreate = crud.adminmessage.create(db=db, obj_in=adminmessage_create)
    adminmessage_postupdate = crud.adminmessage.update(
        db=db, db_obj=adminmessage_postcreate, obj_in=adminmessage_update
    )
    assert adminmessage_postupdate
    assert adminmessage_postupdate.title == adminmessage_update.title


def test_delete_adminmessage(db: Session, adminmessage_create: AdminMessageCreate) -> None:
    adminmessage_postcreate = crud.adminmessage.create(db=db, obj_in=adminmessage_create)
    crud.adminmessage.remove(db=db, id=adminmessage_postcreate.id)
    adminmessage_postdelete = crud.adminmessage.get(db=db, id=adminmessage_postcreate.id)
    assert adminmessage_postdelete is None
