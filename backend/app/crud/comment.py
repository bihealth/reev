from typing import Any, Sequence

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CrudBase
from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentUpdate


class CrudComment(CrudBase[Comment, CommentCreate, CommentUpdate]):
    async def get_multi_by_user(
        self, session: AsyncSession, *, user_id: Any, skip: int = 0, limit: int = 100
    ) -> Sequence[Comment]:
        query = select(self.model).filter(self.model.user == user_id).offset(skip).limit(limit)
        result = await session.execute(query)
        return result.scalars().all()

    async def get_by_user_and_obj(
        self, session: AsyncSession, *, user_id: Any, obj_type: Any, obj_id: Any
    ) -> Comment | None:
        query = select(self.model).filter(
            self.model.user == user_id, self.model.obj_type == obj_type, self.model.obj_id == obj_id
        )
        result = await session.execute(query)
        return result.scalars().first()
