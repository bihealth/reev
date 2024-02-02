from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas
from app.api import deps
from app.api.deps import current_active_superuser, current_active_user
from app.models.user import User

router = APIRouter()


@router.post("/create", response_model=schemas.AcmgSeqVarCreate)
async def create_acmgseqvar(
    acmgseqvar: schemas.AcmgSeqVarCreate,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Create a new ACMG Sequence Variant.

    :param acmgseqvar: ACMG Sequence Variant to create
    :type acmgseqvar: dict or :class:`.schemas.AcmgSeqVarCreate`
    :return: ACMG Sequence Variant
    :rtype: dict
    """
    acmgseqvar.user = user.id
    return await crud.acmgseqvar.create(db, obj_in=acmgseqvar)


@router.get(
    "/list-all",
    dependencies=[Depends(current_active_superuser)],
    response_model=list[schemas.AcmgSeqVarRead],
)
async def list_acmgseqvars(
    skip: int = 0, limit: int = 100, db: AsyncSession = Depends(deps.get_db)
):
    """
    List all ACMG Sequence Variants. Available only for superusers.

    :param skip: number of ACMG Sequence Variants to skip
    :type skip: int
    :param limit: maximum number of ACMG Sequence Variants to return
    :type limit: int
    :return: list of ACMG Sequence Variants
    :rtype: list
    """
    return await crud.acmgseqvar.get_multi(db, skip=skip, limit=limit)


@router.get(
    "/get-by-id",
    dependencies=[Depends(current_active_superuser)],
    response_model=schemas.AcmgSeqVarRead,
)
async def get_acmgseqvar(id: str, db: AsyncSession = Depends(deps.get_db)):
    """
    Get a ACMG Sequence Variant by id. Available only for superusers.

    :param id: ACMG Sequence Variant id
    :type id: uuid
    :return: ACMG Sequence Variant
    :rtype: dict
    """
    result = await crud.acmgseqvar.get(db, id)
    if not result:  # pragma: no cover
        raise HTTPException(status_code=404, detail="ACMG Sequence Variant not found")
    else:
        return result


@router.get("/list", response_model=list[schemas.AcmgSeqVarRead])
async def list_acmgseqvars_by_user(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    List ACMG Sequence Variants by user.

    :return: list of ACMG Sequence Variants
    :rtype: list
    """
    return await crud.acmgseqvar.get_multi_by_user(db, user_id=user.id, skip=skip, limit=limit)


@router.get("/get", response_model=schemas.AcmgSeqVarRead)
async def get_acmgseqvar_by_user(
    seqvar: str,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
    user_agent: Annotated[str | None, Header()] = None,
):
    """
    Get a ACMG Sequence Variant by id.

    :param id: ACMG Sequence Variant id
    :type id: uuid
    :return: ACMG Sequence Variant
    :rtype: dict
    :raises HTTPException 404: ACMG Sequence Variant not found
    :note: If user_agent is browser, return 204 Response
    """
    result = await crud.acmgseqvar.get_by_user(db, user_id=user.id, seqvar_name=seqvar)
    if not result:  # pragma: no cover
        # if user_agent is browser, return 204, else 404
        if user_agent and "Mozilla" in user_agent:
            return Response(status_code=204)
        else:
            raise HTTPException(status_code=404, detail="ACMG Sequence Variant not found")
    else:
        return result


@router.put("/update", response_model=schemas.AcmgSeqVarRead)
@router.patch("/update", response_model=schemas.AcmgSeqVarRead)
async def update_acmgseqvar(
    acmgseqvar: schemas.AcmgSeqVarUpdate,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Update a ACMG Sequence Variant.

    :param acmgseqvar: ACMG Sequence Variant to update
    :type acmgseqvar: dict or :class:`.schemas.AcmgSeqVarUpdate`
    :return: ACMG Sequence Variant
    :rtype: dict
    """
    acmgseqvar.user = user.id
    result = await crud.acmgseqvar.get_by_user(
        db, user_id=user.id, seqvar_name=acmgseqvar.seqvar_name
    )
    if not result:  # pragma: no cover
        raise HTTPException(status_code=404, detail="ACMG Sequence Variant not found")
    else:
        return await crud.acmgseqvar.update(db, db_obj=result, obj_in=acmgseqvar)


@router.delete(
    "/delete-by-id",
    dependencies=[Depends(current_active_superuser)],
    response_model=schemas.AcmgSeqVarRead,
)
async def delete_acmgseqvar(id: str, db: AsyncSession = Depends(deps.get_db)):
    """
    Delete a ACMG Sequence Variant by id. Available only for superusers.

    :param id: ACMG Sequence Variant id
    :type id: uuid
    :return: ACMG Sequence Variant
    :rtype: dict
    """
    result = await crud.acmgseqvar.get(db, id)
    if not result:  # pragma: no cover
        raise HTTPException(status_code=404, detail="ACMG Sequence Variant not found")
    else:
        return await crud.acmgseqvar.remove(db, id=id)


@router.delete("/delete", response_model=schemas.AcmgSeqVarRead)
async def delete_acmgseqvar_by_user(
    seqvar: str,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
    user_agent: Annotated[str | None, Header()] = None,
):
    """
    Delete a ACMG Sequence Variant by id.

    :param id: ACMG Sequence Variant id
    :type id: uuid
    :return: ACMG Sequence Variant
    :rtype: dict
    """
    result = await crud.acmgseqvar.get_by_user(db, user_id=user.id, seqvar_name=seqvar)
    if not result:  # pragma: no cover
        # if user_agent is browser, return 204, else 404
        if user_agent and "Mozilla" in user_agent:
            return Response(status_code=204)
        else:
            raise HTTPException(status_code=404, detail="ACMG Sequence Variant not found")
    else:
        return await crud.acmgseqvar.remove(db, id=result.id)
