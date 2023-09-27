from app import crud, models, schemas
from app.api import deps
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/", response_model=list[schemas.AdminMessage])
def read_adminmsgs(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> list[schemas.AdminMessage]:
    """Retrieve all admin messages"""
    users = [
        schemas.AdminMessage.model_validate(db_obj)
        for db_obj in crud.adminmessage.get_multi(db, skip=skip, limit=limit)
    ]
    return users
