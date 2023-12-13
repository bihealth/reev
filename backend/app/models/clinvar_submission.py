"""Models for the ClinVar submission."""

import datetime
import enum
import uuid as uuid_module
from typing import TYPE_CHECKING, Optional, Union

import clinvar_api.client as clinvar_api_client
import clinvar_api.models as clinvar_api_models
import pydantic  # noqa
from fastapi_users_db_sqlalchemy.generics import GUID
from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    Enum,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
    Uuid,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base

UUID_ID = uuid_module.UUID


class ClinvarSubmittingOrg(Base):
    """Information about a submitting organisation for ClinVar.

    These are owned by a single user at the moment.
    """

    __tablename__ = "clinvarsubmissionuserorg"

    if TYPE_CHECKING:  # pragma: no cover
        id: UUID_ID
        owner: UUID_ID
        label: str
        clinvar_api_token: str


@enum.unique
class Presence(enum.Enum):
    """Status of a variant in ClinVar."""

    #: Variant is absent from ClinVar.
    ABSENT = "absent"
    #: Variant is present in ClinVar.
    PRESENT = "present"


@enum.unique
class Status(enum.Enum):
    """Status of a variant submission to ClinVar."""

    #: Initial status, user can edit and create new entry.
    INITIAL = "initial"
    #: Has been flagged for submission, to be picked up by the celery task.
    SUBMITTED = "submitted"
    #: Submission is in progress, user has to wait.
    IN_PROGRESS = "in_progress"
    #: Submission is complete, user can edit and create new entry.
    COMPLETE = "complete"
    #: Submission failed, user can edit and create new entry.
    FAILED = "failed"


class SubmissionThread(Base):
    """
    Container for the activity of one variant submission to ClinVar for
    a single variant.

    One variant submission corresponds to a genetic variant as submitted for
    one condition and one organisation.  The variant can be submitted and
    on success an SCV identifier is returned.  Deletion and resubmission
    will lead to a new SCV identifier so we store the top-level identifier
    only.
    """

    __tablename__ = "clinvarsubmissionlogbook"

    if TYPE_CHECKING:  # pragma: no cover
        id: UUID_ID
        clinvarsubmittingorg: UUID_ID
        primary_variant_id: str
        effective_scv: Optional[str]
        effective_presence: Optional[Presence]
        desired_presence: Presence
        status: Status


@enum.unique
class ActivityKind(enum.Enum):
    """Type of the :ref:`SubmissionActivity`."""

    #: Retrieve the currently submitted data from ClinVar.
    RETRIEVE = "retrieve"
    #: Create a new submission.
    CREATE = "create"
    #: Update an existing submission.
    UPDATE = "update"
    #: Delete an existing submission.
    DELETE = "delete"


class ResponseMessage(pydantic.BaseModel):
    """A simple response message from ClinVar.

    This is used for storing the error messages from ClinVar.
    """

    #: The error message text.
    text: str


class SubmissionActivity(Base):
    """One entry in a :ref:`SubmissionThread`.

    This corresponds to a submission sent to ClinVar and the corresponding
    response.
    """

    __tablename__ = "clinvarsubmissionentry"

    if TYPE_CHECKING:  # pragma: no cover
        id: UUID_ID
        clinvarsubmissionactivity: UUID_ID
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
