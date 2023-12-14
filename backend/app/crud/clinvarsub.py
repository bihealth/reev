from typing import Optional, Tuple
from uuid import UUID

from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CrudBase
from app.models.clinvarsub import ActivityKind, SubmissionActivity, SubmissionThread, SubmittingOrg
from app.schemas.clinvarsub import (
    SubmissionActivityCreate,
    SubmissionActivityUpdate,
    SubmissionThreadCreate,
    SubmissionThreadUpdate,
    SubmittingOrgCreate,
    SubmittingOrgUpdate,
)


class CrudClinvarSubmittingOrg(CrudBase[SubmittingOrg, SubmittingOrgCreate, SubmittingOrgUpdate]):
    def query_by_owner(self, *, user_id: str | UUID) -> Select[Tuple[SubmittingOrg]]:
        """Return query filtered by owner (order by label)."""
        return select(self.model).filter(self.model.owner == user_id).order_by(self.model.label)


class CrudSubmissionThread(
    CrudBase[SubmissionThread, SubmissionThreadCreate, SubmissionThreadUpdate]
):
    def query_by_user(
        self, *, user_id: str | UUID, primary_variant_id: Optional[str]
    ) -> Select[Tuple[SubmissionThread]]:
        """Return query filtered by user (order by label).

        :param user_id: User ID.
        :param primary_variant_id: Optionally, a primary variant ID to filter by.
        """
        stmt = (
            select(self.model)
            .join(SubmittingOrg)
            .filter(self.model.submittingorg == SubmittingOrg.id)
            .filter(SubmittingOrg.owner == user_id)
        )
        if primary_variant_id:
            stmt = stmt.filter(self.model.primary_variant_id == primary_variant_id)
        return stmt.order_by(SubmittingOrg.label)

    async def get_by_primaryvariantid(
        self, session: AsyncSession, *, submittingorg_id: str | UUID, primary_variant_id: str
    ) -> Optional[SubmissionThread]:
        """Return any submission with matching submitting org and variant ID."""
        query = select(self.model).filter(
            self.model.submittingorg == submittingorg_id,
            self.model.primary_variant_id == primary_variant_id,
        )
        result = await session.execute(query)
        return result.scalars().first()


class CrudSubmissionActivity(
    CrudBase[SubmissionActivity, SubmissionActivityCreate, SubmissionActivityUpdate]
):
    def query_by_submissionthread(
        self, *, submissionthread: str | UUID, kind: Optional[ActivityKind] = None
    ) -> Select[Tuple[SubmissionActivity]]:
        """Return query filtered by submission thread (ordered by timestamp).

        :param user_id: User ID.
        :param kind: Optionally, an ``ActivyKind`` to filter by
        """
        query = select(self.model).filter(self.model.submissionthread == submissionthread)
        if kind:
            query = query.filter(self.model.kind == kind)
        return query.order_by(self.model.created.desc())
