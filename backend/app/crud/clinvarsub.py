from typing import Any, Optional, Tuple
from uuid import UUID

from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CrudBase
from app.models.clinvarsub import (
    SubmissionActivity,
    SubmissionActivityKind,
    SubmissionThread,
    SubmittingOrg,
)
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

    async def update(
        self, session: AsyncSession, *, db_obj: SubmittingOrg, obj_in: SubmittingOrgUpdate | dict[str, Any]
    ) -> SubmittingOrg:
        """Override to prevent updating token if not set."""
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        if "token" in update_data and not update_data.get("token"):
            update_data.pop("token")
        super().update(session, db_obj=db_obj, obj_in=update_data)



class CrudSubmissionThread(
    CrudBase[SubmissionThread, SubmissionThreadCreate, SubmissionThreadUpdate]
):
    def query_by_user(
        self, *, user_id: str | UUID, primary_variant_desc: Optional[str]
    ) -> Select[Tuple[SubmissionThread]]:
        """Return query filtered by user (order by label).

        :param user_id: User ID.
        :param primary_variant_desc: Optionally, a primary variant ID to filter by.
        """
        stmt = (
            select(self.model)
            .join(SubmittingOrg)
            .filter(self.model.submittingorg_id == SubmittingOrg.id)
            .filter(SubmittingOrg.owner == user_id)
        )
        if primary_variant_desc:
            stmt = stmt.filter(self.model.primary_variant_desc == primary_variant_desc)
        return stmt.order_by(SubmittingOrg.label)

    async def get_by_primaryvariantid(
        self, session: AsyncSession, *, submittingorg_id: str | UUID, primary_variant_desc: str
    ) -> Optional[SubmissionThread]:
        """Return any submission with matching submitting org and variant ID."""
        query = select(self.model).filter(
            self.model.submittingorg_id == submittingorg_id,
            self.model.primary_variant_desc == primary_variant_desc,
        )
        result = await session.execute(query)
        return result.scalars().first()


class CrudSubmissionActivity(
    CrudBase[SubmissionActivity, SubmissionActivityCreate, SubmissionActivityUpdate]
):
    def query_by_submissionthread(
        self, *, submissionthread_id: str | UUID, kind: Optional[SubmissionActivityKind] = None
    ) -> Select[Tuple[SubmissionActivity]]:
        """Return query filtered by submission thread (ordered by timestamp).

        :param user_id: User ID.
        :param kind: Optionally, an ``ActivyKind`` to filter by
        """
        query = select(self.model).filter(self.model.submissionthread_id == submissionthread_id)
        if kind:
            query = query.filter(self.model.kind == kind)
        return query.order_by(self.model.created.desc())
