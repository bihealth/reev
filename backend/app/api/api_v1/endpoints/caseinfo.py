from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas
from app.api import deps
from app.api.deps import current_active_superuser, current_active_user
from app.models.user import User

router = APIRouter()


@router.post("/create", response_model=schemas.CaseInfoCreate)
async def create_caseinfo(
    caseinfo: schemas.CaseInfoCreate,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Create a new Case Information.

    :param caseinfo: Case Information to create
    :type caseinfo: dict or :class:`.schemas.CaseInfoCreate`
    :return: Case Information
    :rtype: dict
    """
    caseinfo.user = user.id
    return await crud.caseinfo.create(db, obj_in=caseinfo)


@router.get(
    "/list-all",
    dependencies=[Depends(current_active_superuser)],
    response_model=list[schemas.CaseInfoRead],
)
async def list_caseinfos(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(deps.get_db)):
    """
    List all Case Information. Available only for superusers.

    :param skip: number of Case Information to skip
    :type skip: int
    :param limit: maximum number of Case Information to return
    :type limit: int
    :return: list of Case Information
    :rtype: list
    """
    return await crud.caseinfo.get_multi(db, skip=skip, limit=limit)


@router.get(
    "/get-by-id",
    dependencies=[Depends(current_active_superuser)],
    response_model=schemas.CaseInfoRead,
)
async def get_caseinfo(id: str, db: AsyncSession = Depends(deps.get_db)):
    """
    Get a Case Information by id. Available only for superusers.

    :param id: Case Information id
    :type id: uuid
    :return: Case Information
    :rtype: dict
    """
    response = await crud.caseinfo.get(db, id=id)
    if not response:
        raise HTTPException(status_code=404, detail="Case Information not found")
    else:
        return response


@router.delete(
    "/delete-by-id",
    dependencies=[Depends(current_active_superuser)],
    response_model=schemas.CaseInfoRead,
)
async def delete_caseinfo(id: str, db: AsyncSession = Depends(deps.get_db)):
    """
    Delete a Case Information by id. Available only for superusers.

    :param id: Case Information id
    :type id: uuid
    :return: Case Information
    :rtype: dict
    """
    response = await crud.caseinfo.remove(db, id=id)
    if not response:
        raise HTTPException(status_code=404, detail="Case Information not found")
    else:
        return response


@router.get("/list", response_model=list[schemas.CaseInfoRead])
async def list_caseinfos_for_user(
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    List all Case Information for a current user.

    :return: list of Case Information
    :rtype: list
    """
    return await crud.caseinfo.get_multi_by_user(db, user_id=user.id)


@router.get("/get", response_model=schemas.CaseInfoRead)
async def get_caseinfo_for_user(
    db: AsyncSession = Depends(deps.get_db), user: User = Depends(current_active_user)
):
    """
    Get a Case Information for a current user.

    :return: Case Information
    :rtype: dict
    """
    caseinfo = await crud.caseinfo.get_by_user(db, user_id=user.id)
    if not caseinfo:
        raise HTTPException(status_code=404, detail="Case Information not found")
    return caseinfo


@router.put("/update", response_model=schemas.CaseInfoRead)
@router.patch("/update", response_model=schemas.CaseInfoRead)
async def update_caseinfo_for_user(
    caseinfoupdate: schemas.CaseInfoUpdate,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Update a Case Information for a current user.

    :param caseinfo: Case Information to update
    :type caseinfo: dict or :class:`.schemas.CaseInfoUpdate`
    :return: Case Information
    :rtype: dict
    """
    caseinfoupdate.user = user.id
    caseinfo = await crud.caseinfo.get_by_user(db, user_id=user.id)
    if not caseinfo:
        raise HTTPException(status_code=404, detail="Case Information not found")
    return await crud.caseinfo.update(db, db_obj=caseinfo, obj_in=caseinfoupdate)


@router.delete("/delete", response_model=schemas.CaseInfoRead)
async def delete_caseinfo_for_user(
    db: AsyncSession = Depends(deps.get_db), user: User = Depends(current_active_user)
):
    """
    Delete a Case Information for a current user.

    :return: Case Information
    :rtype: dict
    """
    caseinfo = await crud.caseinfo.get_by_user(db, user_id=user.id)
    if not caseinfo:
        raise HTTPException(status_code=404, detail="Case Information not found")
    return await crud.caseinfo.remove(db, id=caseinfo.id)
