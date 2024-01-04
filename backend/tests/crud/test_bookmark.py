import uuid

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.schemas.bookmark import BookmarkCreate, BookmarkTypes
from tests.conftest import ObjNames


@pytest.fixture
def bookmark_create(obj_names: ObjNames) -> BookmarkCreate:
    """Fixture for creating a bookmark."""
    return BookmarkCreate(
        obj_type=BookmarkTypes.gene,
        obj_id=obj_names.gene[0],
        user=uuid.uuid4(),
    )


@pytest.mark.anyio
async def test_create_get_bookmark(db_session: AsyncSession, bookmark_create: BookmarkCreate):
    """Test creating and retrieving a bookmark."""
    # act:
    bookmark_postcreate = await crud.bookmark.create(session=db_session, obj_in=bookmark_create)
    stored_item = await crud.bookmark.get(session=db_session, id=bookmark_postcreate.id)
    # assert:
    assert stored_item
    assert bookmark_postcreate.id == stored_item.id
    assert bookmark_postcreate.obj_type == stored_item.obj_type
    assert bookmark_postcreate.obj_id == stored_item.obj_id


@pytest.mark.anyio
async def test_delete_bookmark(db_session: AsyncSession, bookmark_create: BookmarkCreate):
    """Test deleting a bookmark."""
    # act:
    bookmark_postcreate = await crud.bookmark.create(session=db_session, obj_in=bookmark_create)
    # assert:
    await crud.bookmark.remove(session=db_session, id=bookmark_postcreate.id)


@pytest.mark.anyio
async def test_get_multi_by_user(db_session: AsyncSession, bookmark_create: BookmarkCreate):
    """Test retrieving multiple bookmarks by user."""
    # act:
    bookmark_postcreate = await crud.bookmark.create(session=db_session, obj_in=bookmark_create)
    stored_items = await crud.bookmark.get_multi_by_user(
        session=db_session, user_id=bookmark_postcreate.user
    )
    # assert:
    assert stored_items
    assert len(stored_items) == 1
    assert bookmark_postcreate.id == stored_items[0].id
    assert bookmark_postcreate.obj_type == stored_items[0].obj_type
    assert bookmark_postcreate.obj_id == stored_items[0].obj_id


@pytest.mark.anyio
async def test_get_by_user_and_obj(db_session: AsyncSession, bookmark_create: BookmarkCreate):
    """Test retrieving a bookmark by user and object."""
    # act:
    bookmark_postcreate = await crud.bookmark.create(session=db_session, obj_in=bookmark_create)
    stored_item = await crud.bookmark.get_by_user_and_obj(
        session=db_session,
        user_id=bookmark_postcreate.user,
        obj_type=bookmark_postcreate.obj_type,
        obj_id=bookmark_postcreate.obj_id,
    )
    # assert:
    assert stored_item
    assert bookmark_postcreate.id == stored_item.id
    assert bookmark_postcreate.obj_type == stored_item.obj_type
    assert bookmark_postcreate.obj_id == stored_item.obj_id
