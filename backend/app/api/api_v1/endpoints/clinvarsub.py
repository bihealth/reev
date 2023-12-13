"""Endpoints for the ClinVar submission API."""

from fastapi import APIRouter, Depends, HTTPException
from fastapi_pagination.cursor import CursorPage
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas
from app.api import deps
from app.api.deps import current_active_user
from app.models.user import User

router = APIRouter()


# -- SumbmittingOrg -----------------------------------------------------------


@router.get("/submittingorgs", response_model=CursorPage[schemas.SubmittingOrgRead])
async def list_submittingorgs(
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    List submitting orgs of current user in paginated fashion.

    :return: Paginated list of results.
    """
    query = crud.submittingorg.query_by_owner(user_id=user.id)
    return await paginate(db, query)


@router.post("/submittingorgs", response_model=schemas.SubmittingOrgRead)
async def create_submittingorg(
    submittingorg: schemas.SubmittingOrgCreate,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Create a new submitting org.

    :param submittingorg: Data of submitting org to create.
    :return: Created submitting org.
    """
    submittingorg.owner = user.id
    return await crud.submittingorg.create(db, obj_in=submittingorg)


@router.get(
    "/submittingorgs/{submittingorg_id}",
    response_model=schemas.SubmittingOrgRead,
)
async def get_submittingorg_by_id(
    submittingorg_id: str,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Retrieve submitting org (current user must be owner).

    :param id: Submitting org UUID.
    :return: Submitting org data.
    """
    response = await crud.submittingorg.get(db, id=submittingorg_id)
    if not response:
        raise HTTPException(status_code=404, detail="submitting org not found")
    elif response.owner != user.id:
        raise HTTPException(status_code=403, detail="user not owner of submitting org")
    else:
        return response


@router.put(
    "/submittingorgs/{submittingorg_id}",
    response_model=schemas.SubmittingOrgRead,
)
async def update_submittingorg(
    submittingorg_id: str,
    submittingorg: schemas.SubmittingOrgUpdate,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Update submitting org (current user must be owner).

    :return: Paginated list of results.
    """
    submittingorg_db = await crud.submittingorg.get(db, id=submittingorg_id)
    if not submittingorg_db:
        raise HTTPException(status_code=404, detail="submitting org not found")
    elif submittingorg_db.owner != user.id:
        raise HTTPException(status_code=403, detail="user not owner of submitting org")
    else:
        return await crud.submittingorg.update(db, db_obj=submittingorg_db, obj_in=submittingorg)


@router.delete(
    "/submittingorgs/{submittingorg_id}",
    response_model=schemas.SubmittingOrgRead,
)
async def delete_submittingorg(
    submittingorg_id: str,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Update submitting org (current user must be owner).

    :return: Paginated list of results.
    """
    submittingorg_db = await crud.submittingorg.get(db, id=submittingorg_id)
    if not submittingorg_db:
        raise HTTPException(status_code=404, detail="submitting org not found")
    elif submittingorg_db.owner != user.id:
        raise HTTPException(status_code=403, detail="user not owner of submitting org")
    else:
        return await crud.submittingorg.remove(db, id=submittingorg_id)


# -- SubmissionThread ---------------------------------------------------------

# -- SubmissionActivity -------------------------------------------------------
