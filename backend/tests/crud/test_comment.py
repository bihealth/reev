import uuid

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.schemas.comment import CommentCreate, CommentTypes
from tests.conftest import ObjNames


@pytest.fixture
def bookmark_create(obj_names: ObjNames) -> CommentCreate:
    """Fixture for creating a comment."""
    return CommentCreate(
        obj_type=CommentTypes.gene,
        obj_id=obj_names.gene[0],
        user=uuid.uuid4(),
        text="This is a test comment.",
    )


@pytest.mark.anyio
async def test_create_get_bookmark(db_session: AsyncSession, bookmark_create: CommentCreate):
    """Test creating and retrieving a comment."""
    # act:
    bookmark_postcreate = await crud.comment.create(session=db_session, obj_in=bookmark_create)
    stored_item = await crud.comment.get(session=db_session, id=bookmark_postcreate.id)
    # assert:
    assert stored_item
    assert bookmark_postcreate.id == stored_item.id
    assert bookmark_postcreate.obj_type == stored_item.obj_type
    assert bookmark_postcreate.obj_id == stored_item.obj_id


@pytest.mark.anyio
async def test_delete_bookmark(db_session: AsyncSession, bookmark_create: CommentCreate):
    """Test deleting a comment."""
    # act:
    bookmark_postcreate = await crud.comment.create(session=db_session, obj_in=bookmark_create)
    # assert:
    await crud.comment.remove(session=db_session, id=bookmark_postcreate.id)


@pytest.mark.anyio
async def test_get_multi_by_user(db_session: AsyncSession, bookmark_create: CommentCreate):
    """Test retrieving multiple bookmarks by user."""
    # act:
    bookmark_postcreate = await crud.comment.create(session=db_session, obj_in=bookmark_create)
    stored_items = await crud.comment.get_multi_by_user(
        session=db_session, user_id=bookmark_postcreate.user
    )
    # assert:
    assert stored_items
    assert len(stored_items) == 1
    assert bookmark_postcreate.id == stored_items[0].id
    assert bookmark_postcreate.obj_type == stored_items[0].obj_type
    assert bookmark_postcreate.obj_id == stored_items[0].obj_id


@pytest.mark.anyio
async def test_get_by_user_and_obj(db_session: AsyncSession, bookmark_create: CommentCreate):
    """Test retrieving a comment by user and object."""
    # act:
    bookmark_postcreate = await crud.comment.create(session=db_session, obj_in=bookmark_create)
    stored_item = await crud.comment.get_by_user_and_obj(
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
