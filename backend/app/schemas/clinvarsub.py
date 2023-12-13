import datetime
from typing import Optional, Union
from uuid import UUID

import clinvar_api.client as clinvar_api_client
import clinvar_api.models as clinvar_api_models
from pydantic import BaseModel, ConfigDict

from app.models.clinvarsub import ActivityKind, Presence, ResponseMessage, Status


class SubmittingOrgBase(BaseModel):
    owner: UUID | None = None
    label: str


class SubmittingOrgCreate(SubmittingOrgBase):
    clinvar_api_token: str


class SubmittingOrgUpdate(SubmittingOrgBase):
    clinvar_api_token: str | None = None


class SubmittingOrgInDbBase(SubmittingOrgBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID


class SubmittingOrgRead(SubmittingOrgInDbBase):
    owner: UUID


class SubmittingOrgInDb(SubmittingOrgInDbBase):
    clinvar_api_token: str


class SubmissionThreadBase(BaseModel):
    effective_scv: Optional[str] = None
    effective_presence: Optional[Presence] = None
    desired_presence: Presence
    status: Status


class SubmissionThreadCreate(SubmissionThreadBase):
    submittingorg: UUID
    primary_variant_id: str


class SubmissionThreadUpdate(SubmissionThreadBase):
    pass


class SubmissionThreadInDbBase(SubmissionThreadBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    submittingorg: UUID


class SubmissionThreadRead(SubmissionThreadInDbBase):
    pass


class SubmissionThreadInDb(SubmissionThreadInDbBase):
    pass


class SubmissionActivityBase(BaseModel):
    kind: ActivityKind
    status: Status
    request_payload: Union[clinvar_api_models.SubmissionContainer, None]
    request_timestamp: datetime.datetime
    response_status: Optional[Status]
    response_payload: Union[
        ResponseMessage,
        clinvar_api_models.Created,
        clinvar_api_client.RetrieveStatusResult,
        None,
    ]
    response_timestamp: Optional[datetime.datetime]


class SubmissionActivityCreate(SubmissionActivityBase):
    model_config = ConfigDict(from_attributes=True)

    submissionthread: UUID


class SubmissionActivityUpdate(SubmissionActivityBase):
    pass


class SubmissionActivityInDbBase(SubmissionActivityBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    clinvarsub: UUID


class SubmissionActivityRead(SubmissionActivityInDbBase):
    pass
