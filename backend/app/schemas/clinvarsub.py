import datetime
from typing import Optional, Union
from uuid import UUID

import clinvar_api.client as clinvar_api_client
import clinvar_api.models as clinvar_api_models
from pydantic import BaseModel, ConfigDict

from app.models.clinvarsub import (
    ResponseMessage,
    SubmissionActivityKind,
    SubmissionActivityStatus,
    SubmissionThreadStatus,
    VariantPresence,
)


class SubmittingOrgBase(BaseModel):
    owner: UUID | None = None
    label: str


class SubmittingOrgCreate(SubmittingOrgBase):
    model_config = ConfigDict(from_attributes=True)

    clinvar_api_token: str


class SubmittingOrgUpdate(SubmittingOrgBase):
    model_config = ConfigDict(from_attributes=True)

    clinvar_api_token: str | None = None


class SubmittingOrgInDbBase(SubmittingOrgBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created: datetime.datetime
    updated: datetime.datetime


class SubmittingOrgRead(SubmittingOrgInDbBase):
    owner: UUID


class SubmittingOrgInDb(SubmittingOrgInDbBase):
    clinvar_api_token: str


class SubmissionThreadBase(BaseModel):
    effective_scv: Optional[str] = None
    effective_presence: Optional[VariantPresence] = None
    desired_presence: VariantPresence
    status: SubmissionThreadStatus


class SubmissionThreadCreate(SubmissionThreadBase):
    model_config = ConfigDict(from_attributes=True)

    submittingorg_id: UUID
    primary_variant_desc: str


class SubmissionThreadUpdate(SubmissionThreadBase):
    model_config = ConfigDict(from_attributes=True)


class SubmissionThreadInDbBase(SubmissionThreadBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created: datetime.datetime
    updated: datetime.datetime
    submittingorg_id: UUID
    primary_variant_desc: str


class SubmissionThreadRead(SubmissionThreadInDbBase):
    model_config = ConfigDict(from_attributes=True)


class SubmissionThreadInDb(SubmissionThreadInDbBase):
    model_config = ConfigDict(from_attributes=True)


class SubmissionActivityBase(BaseModel):
    kind: SubmissionActivityKind
    status: SubmissionActivityStatus
    request_payload: Optional[clinvar_api_models.SubmissionContainer]
    request_timestamp: Optional[datetime.datetime]
    response_payload: Union[
        ResponseMessage,
        clinvar_api_models.Created,
        clinvar_api_client.RetrieveStatusResult,
        None,
    ]
    response_timestamp: Optional[datetime.datetime]


class SubmissionActivityCreate(SubmissionActivityBase):
    model_config = ConfigDict(from_attributes=True)

    submissionthread_id: UUID


class SubmissionActivityUpdate(SubmissionActivityBase):
    model_config = ConfigDict(from_attributes=True)


class SubmissionActivityInDbBase(SubmissionActivityBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created: datetime.datetime
    submissionthread_id: UUID


class SubmissionActivityRead(SubmissionActivityInDbBase):
    model_config = ConfigDict(from_attributes=True)


class SubmissionActivityInDb(SubmissionActivityInDbBase):
    model_config = ConfigDict(from_attributes=True)
