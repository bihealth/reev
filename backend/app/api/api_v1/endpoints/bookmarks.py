from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas
from app.api import deps
from app.core import auth

router = APIRouter()


@router.post("/create", response_model=schemas.BookmarkCreate)
async def create_bookmark(
    bookmark: schemas.BookmarkCreate, db: AsyncSession = Depends(deps.get_db)
):
    """
    Create a new bookmark.

    **Parameters**
    * **obj_type**: type of object to bookmark
    * **obj_id**: id of object to bookmark
    * **user**: user id of user who created the bookmark

    **Response**
    * **id**: id of the bookmark
    * **obj_type**: type of object to bookmark
    * **obj_id**: id of object to bookmark
    * **user**: user id of user who created the bookmark
    """
    return await crud.bookmark.create(db, obj_in=bookmark)


@router.get("/list-all", response_model=list[schemas.BookmarkRead])
async def list_bookmarks(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(deps.get_db)):
    """
    List bookmarks. Available only for superusers.

    **Parameters**
    * **skip**: number of bookmarks to skip
    * **limit**: maximum number of bookmarks to return

    **Response**
    * List of bookmarks
    """
    user = auth.fastapi_users.current_user(active=True, superuser=True)
    if user:
        return await crud.bookmark.get_multi(db, skip=skip, limit=limit)
    else:
        raise HTTPException(status_code=403, detail="Not enough permissions")


@router.get("/get-by-id", response_model=schemas.BookmarkRead)
async def get_bookmark(id: str, db: AsyncSession = Depends(deps.get_db)):
    """
    Get a bookmark by id. Available only for superusers.

    **Parameters**
    * **id**: id of the bookmark

    **Response**
    * **id**: id of the bookmark
    * **obj_type**: type of object to bookmark
    * **obj_id**: id of object to bookmark
    * **user**: user id of user who created the bookmark
    """
    user = auth.fastapi_users.current_user(active=True, superuser=True)
    if user:
        return await crud.bookmark.get(db, id=id)
    else:
        raise HTTPException(status_code=403, detail="Not enough permissions")


@router.delete("/delete-by-id", response_model=schemas.BookmarkRead)
async def delete_bookmark(id: str, db: AsyncSession = Depends(deps.get_db)):
    """
    Delete a bookmark. Available only for superusers.

    **Parameters**
    * **id**: id of the bookmark

    **Response**
    * **id**: id of the bookmark
    * **obj_type**: type of object to bookmark
    * **obj_id**: id of object to bookmark
    * **user**: user id of user who created the bookmark
    """
    user = auth.fastapi_users.current_user(active=True, superuser=True)
    if user:
        return await crud.bookmark.remove(db, id=id)
    else:
        raise HTTPException(status_code=403, detail="Not enough permissions")


@router.get("/list", response_model=list[schemas.BookmarkRead])
async def list_bookmarks_for_user(
    user_id: str, skip: int = 0, limit: int = 100, db: AsyncSession = Depends(deps.get_db)
):
    """
    List bookmarks for a user.

    **Parameters**
    * **user_id**: id of the user
    * **skip**: number of bookmarks to skip
    * **limit**: maximum number of bookmarks to return

    **Response**
    * List of bookmarks for the user
    """
    return await crud.bookmark.get_multi_by_user(db, user_id=user_id, skip=skip, limit=limit)


@router.get("/get", response_model=schemas.BookmarkRead)
async def get_bookmark_for_user(
    user_id: str, obj_type: str, obj_id: str, db: AsyncSession = Depends(deps.get_db)
):
    """
    Get a bookmark for a user by obj_type and obj_id.

    **Parameters**
    * **user_id**: id of the user
    * **obj_type**: type of object to bookmark
    * **obj_id**: id of object to bookmark

    **Response**
    * **id**: id of the bookmark
    * **obj_type**: type of object to bookmark
    * **obj_id**: id of object to bookmark
    * **user**: user id of user who created the bookmark
    """
    return await crud.bookmark.get_by_user_and_obj(
        db, user_id=user_id, obj_type=obj_type, obj_id=obj_id
    )


@router.delete("/delete", response_model=schemas.BookmarkRead)
async def delete_bookmark_for_user(
    user_id: str, obj_type: str, obj_id: str, db: AsyncSession = Depends(deps.get_db)
):
    """
    Delete a bookmark for a user by obj_type and obj_id.

    **Parameters**
    * **user_id**: id of the user
    * **obj_type**: type of object to bookmark
    * **obj_id**: id of object to bookmark

    **Response**
    * **id**: id of the bookmark
    * **obj_type**: type of object to bookmark
    * **obj_id**: id of object to bookmark
    * **user**: user id of user who created the bookmark
    """
    return await crud.bookmark.remove_by_user_and_obj(
        db, user_id=user_id, obj_type=obj_type, obj_id=obj_id
    )
