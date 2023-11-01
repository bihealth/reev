from typing import Any, Sequence

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CrudBase
from app.models.caseinfo import CaseInfo
from app.schemas.caseinfo import CaseInfoCreate, CaseInfoUpdate


class CrudCaseInfo(CrudBase[CaseInfo, CaseInfoCreate, CaseInfoUpdate]):
    async def get_by_user(self, session: AsyncSession, *, user_id: Any) -> CaseInfo | None:
        query = select(self.model).filter(self.model.user == user_id)
        result = await session.execute(query)
        return result.scalars().first()
