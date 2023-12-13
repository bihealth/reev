from typing import Any, Tuple

from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CrudBase
from app.models.clinvarsub import SubmissionActivity, SubmissionThread, SubmittingOrg
from app.schemas.clinvarsub import (
    SubmissionActivityCreate,
    SubmissionActivityUpdate,
    SubmissionThreadCreate,
    SubmissionThreadUpdate,
    SubmittingOrgCreate,
    SubmittingOrgUpdate,
)


class CrudClinvarSubmittingOrg(CrudBase[SubmittingOrg, SubmittingOrgCreate, SubmittingOrgUpdate]):
    def query_by_owner(self, *, user_id: Any) -> Select[Tuple[SubmittingOrg]]:
        """Return query filtered by owner (order by label)."""
        return select(self.model).filter(self.model.owner == user_id).order_by(self.model.label)


class CrudSubmissionThread(
    CrudBase[SubmissionThread, SubmissionThreadCreate, SubmissionThreadUpdate]
):
    pass


class CrudSubmissionActivity(
    CrudBase[SubmissionActivity, SubmissionActivityCreate, SubmissionActivityUpdate]
):
    pass
