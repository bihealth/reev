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


@router.get("/list", response_model=list[schemas.BookmarkRead])
async def list_bookmarks(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(deps.get_db)):
    """List bookmarks."""
    return await crud.bookmark.get_multi(db, skip=skip, limit=limit)


@router.get("/get", response_model=schemas.BookmarkRead)
async def get_bookmark(id: str, db: AsyncSession = Depends(deps.get_db)):
    """Get a bookmark."""
    return await crud.bookmark.get(db, id=id)


@router.delete("/delete", response_model=schemas.BookmarkRead)
async def delete_bookmark(id: str, db: AsyncSession = Depends(deps.get_db)):
    """Delete a bookmark."""
    return await crud.bookmark.remove(db, id=id)
