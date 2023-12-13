"""Models for the ClinVar submission."""

import datetime
import enum
import uuid as uuid_module
from typing import TYPE_CHECKING, Optional, Union

import clinvar_api.client as clinvar_api_client
import clinvar_api.models as clinvar_api_models
import pydantic  # noqa
from fastapi_users_db_sqlalchemy.generics import GUID
from sqlalchemy import JSON, Column, DateTime, Enum, ForeignKey, Index, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base

UUID_ID = uuid_module.UUID


class SubmittingOrg(Base):
    """Information about a submitting organisation for ClinVar.

    These are owned by a single user at the moment.
    """

    __tablename__ = "clinvarsubuserorg"

    if TYPE_CHECKING:  # pragma: no cover
        id: UUID_ID
        owner: UUID_ID
        label: str
        clinvar_api_token: str
    else:
        #: UUID of the submitting organisation.
        id: Mapped[UUID_ID] = mapped_column(
            GUID, primary_key=True, index=True, default=uuid_module.uuid4
        )
        #: User who owns the submitting organisation.
        owner = Column(Uuid, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
        #: Label of the submitting organisation.
        label = Column(String(255), nullable=False)
        #: ClinVar API token.
        clinvar_api_token = Column(String(255), nullable=False)


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
    #: Submission is awaiting processing by ClinVar, user has to wait.
    WAITING = "waiting"
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

    __tablename__ = "clinvarsubthread"

    __table_args__ = (
        Index("clinvarsubthread_org_variantid", "submittingorg", "primary_variant_id"),
    )

    if TYPE_CHECKING:  # pragma: no cover
        id: UUID_ID
        submittingorg: UUID_ID
        primary_variant_id: str
        effective_scv: Optional[str]
        effective_presence: Optional[Presence]
        desired_presence: Presence
        status: Status
    else:
        #: UUID of the submission thread.
        id: Mapped[UUID_ID] = mapped_column(
            GUID, primary_key=True, index=True, default=uuid_module.uuid4
        )
        #: Submitting organisation.
        submittingorg = Column(
            Uuid, ForeignKey("clinvarsubuserorg.id", ondelete="CASCADE"), nullable=False
        )
        #: Primary variant identifier, e.g., ``GRCh37-1-1000-A-G`` or
        #: ``DEL-GRCh38-1-1000-2000``.
        primary_variant_id = Column(String(1024), nullable=False)
        #: Effective SCV identifier.
        effective_scv = Column(String(32), nullable=True)
        #: Effective presence.
        effective_presence = Column(Enum(Presence), nullable=True)
        #: Desired presence.
        desired_presence = Column(Enum(Presence), nullable=False)
        #: Status of the submission.
        status = Column(Enum(Status), nullable=False)


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

    __tablename__ = "clinvarsubactivity"

    if TYPE_CHECKING:  # pragma: no cover
        id: UUID_ID
        clinvarsubactivity: UUID_ID
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
    else:
        #: UUID of the submission activity.
        id: Mapped[UUID_ID] = mapped_column(
            GUID, primary_key=True, index=True, default=uuid_module.uuid4
        )
        #: Submission thread.
        submissionthread = Column(
            Uuid, ForeignKey("clinvarsubthread.id", ondelete="CASCADE"), nullable=False
        )
        #: Kind of the activity.
        kind = Column(Enum(ActivityKind), nullable=False)
        #: Status of the activity.
        status = Column(Enum(Status), nullable=False)
        #: Request payload.
        request_payload = Column(JSON, nullable=True)
        #: Timestamp of the request.
        request_timestamp = Column(
            "request_timestamp", DateTime, nullable=False, default=datetime.datetime.utcnow
        )
        #: Status of the response.
        response_status = Column(Enum(Status), nullable=True)
        #: Response payload.
        response_payload = Column(JSON, nullable=True)
        #: Timestamp of the response.
        response_timestamp = Column("response_timestamp", DateTime, nullable=True)
