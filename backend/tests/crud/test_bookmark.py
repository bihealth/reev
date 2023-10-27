import uuid

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.schemas.bookmark import BookmarkCreate, BookmarkTypes


@pytest.fixture
def bookmark_create() -> BookmarkCreate:
    return BookmarkCreate(
        obj_type=BookmarkTypes.gene,
        obj_id=str(uuid.uuid4()),
        user=uuid.uuid4(),
    )


@pytest.mark.asyncio
async def test_create_get_bookmark(db_session: AsyncSession, bookmark_create: BookmarkCreate):
    bookmark_postcreate = await crud.bookmark.create(session=db_session, obj_in=bookmark_create)
    stored_item = await crud.bookmark.get(session=db_session, id=bookmark_postcreate.id)
    assert stored_item
    assert bookmark_postcreate.id == stored_item.id
    assert bookmark_postcreate.obj_type == stored_item.obj_type
    assert bookmark_postcreate.obj_id == stored_item.obj_id


@pytest.mark.asyncio
async def test_delete_bookmark(db_session: AsyncSession, bookmark_create: BookmarkCreate):
    bookmark_postcreate = await crud.bookmark.create(session=db_session, obj_in=bookmark_create)
    await crud.bookmark.remove(session=db_session, id=bookmark_postcreate.id)


@pytest.mark.asyncio
async def test_get_multi_by_user(db_session: AsyncSession, bookmark_create: BookmarkCreate):
    bookmark_postcreate = await crud.bookmark.create(session=db_session, obj_in=bookmark_create)
    stored_items = await crud.bookmark.get_multi_by_user(
        session=db_session, user_id=bookmark_postcreate.user
    )
    assert stored_items
    assert len(stored_items) == 1
    assert bookmark_postcreate.id == stored_items[0].id
    assert bookmark_postcreate.obj_type == stored_items[0].obj_type
    assert bookmark_postcreate.obj_id == stored_items[0].obj_id


@pytest.mark.asyncio
async def test_get_by_user_and_obj(db_session: AsyncSession, bookmark_create: BookmarkCreate):
    bookmark_postcreate = await crud.bookmark.create(session=db_session, obj_in=bookmark_create)
    stored_item = await crud.bookmark.get_by_user_and_obj(
        session=db_session,
        user_id=bookmark_postcreate.user,
        obj_type=bookmark_postcreate.obj_type,
        obj_id=bookmark_postcreate.obj_id,
    )
    assert stored_item
    assert bookmark_postcreate.id == stored_item.id
    assert bookmark_postcreate.obj_type == stored_item.obj_type
    assert bookmark_postcreate.obj_id == stored_item.obj_id
