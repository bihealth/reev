from typing import Any, List

from sqlalchemy import and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CrudBase
from app.models.bookmark import Bookmark
from app.schemas.bookmark import BookmarkCreate, BookmarkUpdate


class CrudBookmark(CrudBase[Bookmark, BookmarkCreate, BookmarkUpdate]):
    async def get_multi_by_user(
        self, session: AsyncSession, *, user_id: str, skip: int = 0, limit: int = 100
    ) -> List[Bookmark]:
        query = (
            select(self.model).filter(and_(self.model.user == user_id)).offset(skip).limit(limit)
        )
        result = await session.execute(query)
        return result.scalars().all()

    async def get_by_user_and_obj(
        self, session: AsyncSession, *, user_id: str, obj_type: str, obj_id: str
    ) -> Bookmark:
        query = select(self.model).filter(
            and_(
                self.model.user == user_id,
                self.model.obj_type == obj_type,
                self.model.obj_id == obj_id,
            )
        )
        result = await session.execute(query)
        return result.scalars().first()

    async def remove_by_user_and_obj(
        self, session: AsyncSession, *, user_id: str, obj_type: str, obj_id: str
    ) -> Bookmark:
        query = select(self.model).filter(
            and_(
                self.model.user == user_id,
                self.model.obj_type == obj_type,
                self.model.obj_id == obj_id,
            )
        )
        result = await session.execute(query)
        obj = result.scalars().first()
        if obj:
            await session.delete(obj)
            await session.commit()
        return obj
