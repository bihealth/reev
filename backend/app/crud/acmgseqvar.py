from typing import Any, Sequence

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CrudBase
from app.models.acmgseqvar import AcmgSeqVar
from app.schemas.acmgseqvar import AcmgSeqVarCreate, AcmgSeqVarUpdate


class CrudAcmgSeqVar(CrudBase[AcmgSeqVar, AcmgSeqVarCreate, AcmgSeqVarUpdate]):
    async def get_multi_by_user(
        self, session: AsyncSession, *, skip: int = 0, limit: int = 100, user_id: Any
    ) -> Sequence[AcmgSeqVar]:
        query = select(self.model).filter(self.model.user == user_id).offset(skip).limit(limit)
        result = await session.execute(query)
        all_scalars: Sequence[AcmgSeqVar] = result.scalars().all()  # type: ignore[assignment]
        return all_scalars

    async def get_by_user(
        self, session: AsyncSession, *, user_id: Any, seqvar_name: Any
    ) -> AcmgSeqVar | None:
        query = select(self.model).filter(
            self.model.user == user_id, self.model.seqvar_name == seqvar_name
        )
        result = await session.execute(query)
        return result.scalars().first()
