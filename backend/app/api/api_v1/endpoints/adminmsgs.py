from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=list[schemas.AdminMessageRead])
async def read_adminmsgs(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> list[schemas.AdminMessageRead]:
    """
    Retrieve all admin messages.

    :return: list of admin messages
    :rtype: list
    """
    users = [
        schemas.AdminMessageRead.model_validate(db_obj)
        for db_obj in await crud.adminmessage.get_multi(db, skip=skip, limit=limit)
    ]
    return users
