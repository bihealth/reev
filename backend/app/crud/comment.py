from operator import or_
from typing import Any, Sequence, Tuple

from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CrudBase
from app.models.comment import Comment
from app.models.user import User
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

    def query_by_object(
        self, *, obj_type: Any, obj_id: Any, user: User | None
    ) -> Select[Tuple[Comment]]:
        return (
            select(self.model)
            .filter(
                self.model.obj_type == obj_type,
                self.model.obj_id == obj_id,
                or_(self.model.public == True, self.model.user == user.id if user else False),
            )
            .order_by(self.model.created.desc())
        )
