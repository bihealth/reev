from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas
from app.api import deps
from app.api.deps import current_active_superuser, current_active_user, current_verified_user
from app.models.user import User

router = APIRouter()


@router.post("/create", response_model=schemas.CommentCreate)
async def create_comment(
    comment: schemas.CommentCreate,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_verified_user),
):
    """
    Create a new comment.

    :param comment: comment to create
    :type comment: dict or :class:`.schemas.CommentCreate`
    :return: comment
    :rtype: dict
    """
    comment.user = user.id
    return await crud.comment.create(db, obj_in=comment)


@router.get(
    "/list-all",
    dependencies=[Depends(current_active_user)],
    response_model=list[schemas.CommentRead],
)
async def list_comments(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(deps.get_db)):
    """
    List all comments. Available only for superusers.

    :param skip: number of comments to skip
    :type skip: int
    :param limit: maximum number of comments to return
    :type limit: int
    :return: list of comments
    :rtype: list
    """
    return await crud.comment.get_multi(db, skip=skip, limit=limit)


@router.get(
    "/get-by-id",
    dependencies=[Depends(current_active_superuser)],
    response_model=schemas.CommentRead,
)
async def get_comment(id: str, db: AsyncSession = Depends(deps.get_db)):
    """
    Get a comment by id. Available only for superusers.

    :param id: id of the comment
    :type id: uuid
    :return: comment
    :rtype: dict
    """
    result = await crud.comment.get(db, id=id)
    if not result:  # pragma: no cover
        raise HTTPException(status_code=404, detail="Comment not found")
    else:
        return result


@router.delete(
    "/delete-by-id",
    response_model=schemas.CommentRead,
    dependencies=[Depends(current_active_superuser)],
)
async def delete_comment(id: str, db: AsyncSession = Depends(deps.get_db)):
    """
    Delete a comment. Available for superusers and comment owners.

    :param id: id of the comment
    :type id: uuid
    :return: comment which was deleted
    :rtype: dict
    """
    result = await crud.comment.remove(db, id=id)
    if not result:  # pragma: no cover
        raise HTTPException(status_code=404, detail="Comment not found")
    else:
        return result


@router.get("/list", response_model=list[schemas.CommentRead])
async def list_comments_for_user(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    List comments for a current user.

    :param skip: number of comments to skip
    :type skip: int
    :param limit: maximum number of comments to return
    :type limit: int
    :return: list of comments
    :rtype: list
    """
    return await crud.comment.get_multi_by_user(db, user_id=user.id, skip=skip, limit=limit)


@router.get("/get", response_model=schemas.CommentRead)
async def get_comment_for_user(
    obj_type: str,
    obj_id: str,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
    user_agent: Annotated[str | None, Header()] = None,
):
    """
    Get a comment for a current user by obj_type and obj_id.

    :param obj_type: type of object to comment
    :type obj_type: str (enum) - "gene", "seqvar", "strucvar"
    :param obj_id: id of object to comment
    :type obj_id: uuid
    :return: comment
    :rtype: dict
    :raises HTTPException 404: if comment not found
    :note: if user_agent is browser, return 204
    """
    result = await crud.comment.get_by_user_and_obj(
        db, user_id=user.id, obj_type=obj_type, obj_id=obj_id
    )
    if not result:  # pragma: no cover
        # if user_agent is browser, return 204, else 404
        if user_agent and "Mozilla" in user_agent:
            raise HTTPException(status_code=204)
        else:
            raise HTTPException(status_code=404, detail="Comment not found")
    else:
        return result


@router.delete("/delete", response_model=schemas.CommentRead)
async def delete_comment_for_user(
    obj_type: str,
    obj_id: str,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
    user_agent: Annotated[str | None, Header()] = None,
):
    """
    Delete a comment for a current user by obj_type and obj_id.

    :param obj_type: type of object to comment
    :type obj_type: str (enum) - "gene", "seqvar", "strucvar"
    :param obj_id: id of object to comment
    :type obj_id: uuid
    :return: comment which was deleted
    :rtype: dict
    :raises HTTPException 404: if comment not found
    :note: if user_agent is browser, return 204 Response
    """
    comment = await crud.comment.get_by_user_and_obj(
        db, user_id=user.id, obj_type=obj_type, obj_id=obj_id
    )
    if comment:
        return await crud.comment.remove(db, id=comment.id)
    else:  # pragma: no cover
        # if user_agent is browser, return 204, else 404
        if user_agent and "Mozilla" in user_agent:
            return Response(status_code=204)
        else:
            raise HTTPException(status_code=404, detail="Comment not found")
