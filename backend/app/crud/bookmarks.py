from typing import Any, Sequence

from sqlalchemy import and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CrudBase
from app.models.bookmark import Bookmark
from app.schemas.bookmark import BookmarkCreate, BookmarkUpdate


class CrudBookmark(CrudBase[Bookmark, BookmarkCreate, BookmarkUpdate]):
    async def get_multi_by_user(
        self, session: AsyncSession, *, user_id: Any, skip: int = 0, limit: int = 100
    ) -> Sequence[Bookmark]:
        query = select(self.model).filter(self.model.user == user_id).offset(skip).limit(limit)
        result = await session.execute(query)
        return result.scalars().all()

    async def get_by_user_and_obj(
        self, session: AsyncSession, *, user_id: Any, obj_type: Any, obj_id: Any
    ) -> Bookmark | None:
        query = select(self.model).filter(
            self.model.user == user_id, self.model.obj_type == obj_type, self.model.obj_id == obj_id
        )
        result = await session.execute(query)
        return result.scalars().first()
