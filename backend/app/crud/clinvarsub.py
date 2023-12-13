from typing import Any, Sequence

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
    pass


class CrudSubmissionThread(
    CrudBase[SubmissionThread, SubmissionThreadCreate, SubmissionThreadUpdate]
):
    pass


class CrudSubmissionActivity(
    CrudBase[SubmissionActivity, SubmissionActivityCreate, SubmissionActivityUpdate]
):
    pass
