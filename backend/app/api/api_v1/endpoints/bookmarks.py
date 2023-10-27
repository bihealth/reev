from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas
from app.api import deps
from app.core import auth
from app.models.user import User

router = APIRouter()

current_active_user = auth.fastapi_users.current_user(active=True)
current_superuser = auth.fastapi_users.current_user(active=True, superuser=True)


@router.post("/create", response_model=schemas.BookmarkCreate)
async def create_bookmark(
    bookmark: schemas.BookmarkCreate,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Create a new bookmark.

    :param obj_type: type of object to bookmark
    :type obj_type: str (enum) - "gene", "seqvar", "strucvar"
    :param obj_id: id of object to bookmark
    :type obj_id: uuid
    :return: bookmark
    :rtype: dict
    """
    bookmark.user = user.id
    return await crud.bookmark.create(db, obj_in=bookmark)


@router.get(
    "/list-all",
    dependencies=[Depends(current_superuser)],
    response_model=list[schemas.BookmarkRead],
)
async def list_bookmarks(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(deps.get_db)):
    """
    List all bookmarks. Available only for superusers.

    :param skip: number of bookmarks to skip
    :type skip: int
    :param limit: maximum number of bookmarks to return
    :type limit: int
    :return: list of bookmarks
    :rtype: list
    """
    return await crud.bookmark.get_multi(db, skip=skip, limit=limit)


@router.get(
    "/get-by-id", dependencies=[Depends(current_superuser)], response_model=schemas.BookmarkRead
)
async def get_bookmark(id: str, db: AsyncSession = Depends(deps.get_db)):
    """
    Get a bookmark by id. Available only for superusers.

    :param id: id of the bookmark
    :type id: uuid
    :return: bookmark
    :rtype: dict
    """
    user = auth.fastapi_users.current_user(active=True, superuser=True)
    if user:
        return await crud.bookmark.get(db, id=id)
    else:
        raise HTTPException(status_code=403, detail="Not enough permissions")


@router.delete(
    "/delete-by-id", response_model=schemas.BookmarkRead, dependencies=[Depends(current_superuser)]
)
async def delete_bookmark(id: str, db: AsyncSession = Depends(deps.get_db)):
    """
    Delete a bookmark. Available for superusers and bookmark owners.

    :param id: id of the bookmark
    :type id: uuid
    :return: bookmark which was deleted
    :rtype: dict
    """
    return await crud.bookmark.remove(db, id=id)


@router.get("/list", response_model=list[schemas.BookmarkRead])
async def list_bookmarks_for_user(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    List bookmarks for a current user.

    :param skip: number of bookmarks to skip
    :type skip: int
    :param limit: maximum number of bookmarks to return
    :type limit: int
    :return: list of bookmarks
    :rtype: list
    """
    return await crud.bookmark.get_multi_by_user(db, user_id=user.id, skip=skip, limit=limit)


@router.get("/get", response_model=schemas.BookmarkRead)
async def get_bookmark_for_user(
    obj_type: str,
    obj_id: str,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Get a bookmark for a current user by obj_type and obj_id.

    :param obj_type: type of object to bookmark
    :type obj_type: str (enum) - "gene", "seqvar", "strucvar"
    :param obj_id: id of object to bookmark
    :type obj_id: uuid
    :return: bookmark
    :rtype: dict
    """
    return await crud.bookmark.get_by_user_and_obj(
        db, user_id=user.id, obj_type=obj_type, obj_id=obj_id
    )


@router.delete("/delete", response_model=schemas.BookmarkRead)
async def delete_bookmark_for_user(
    obj_type: str,
    obj_id: str,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Delete a bookmark for a current user by obj_type and obj_id.

    :param obj_type: type of object to bookmark
    :type obj_type: str (enum) - "gene", "seqvar", "strucvar"
    :param obj_id: id of object to bookmark
    :type obj_id: uuid
    :return: bookmark which was deleted
    :rtype: dict
    :raises HTTPException: if bookmark not found
    """
    bookmark = await crud.bookmark.get_by_user_and_obj(
        db, user_id=user.id, obj_type=obj_type, obj_id=obj_id
    )
    if bookmark:
        return await crud.bookmark.remove(db, id=bookmark.id)
    else:
        raise HTTPException(status_code=404, detail="Bookmark not found")
