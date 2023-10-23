from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas
from app.api import deps

router = APIRouter()


@router.post("/create", response_model=schemas.BookmarkCreate)
async def create_bookmark(
    bookmark: schemas.BookmarkCreate, db: AsyncSession = Depends(deps.get_db)
):
    """Create a new bookmark."""
    return await crud.bookmark.create(db, obj_in=bookmark)
