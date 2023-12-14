"""Models for the ClinVar submission."""

import enum
import uuid as uuid_module
from datetime import datetime

import pydantic  # noqa
from fastapi_users_db_sqlalchemy.generics import GUID
from sqlalchemy import JSON, Column, DateTime, Enum, ForeignKey, Index, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base

UUID_ID = uuid_module.UUID


def default_utcnow():
    """Freezegun friendly utcnow."""
    return datetime.utcnow()


class SubmittingOrg(Base):
    """Information about a submitting organisation for ClinVar.

    These are owned by a single user at the moment.
    """

    __tablename__ = "clinvarsubuserorg"

    #: UUID of the submitting organisation.
    id: Mapped[UUID_ID] = mapped_column(
        GUID, primary_key=True, index=True, default=uuid_module.uuid4
    )
    #: Timestamp of creation.
    created: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=default_utcnow)
    #: Timestamp of last update.
    updated: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=default_utcnow)
    #: User who owns the submitting organisation.
    owner: Mapped[UUID_ID] = mapped_column(
        GUID, ForeignKey("user.id", ondelete="CASCADE"), nullable=False
    )
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
    #: Failed because of a timeout.
    TIMEOUT = "timeout"


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
        Index("clinvarsubthread_variantid", "primary_variant_id"),
        UniqueConstraint("submittingorg", "primary_variant_id"),
    )

    #: UUID of the submission thread.
    id: Mapped[UUID_ID] = mapped_column(
        GUID, primary_key=True, index=True, default=uuid_module.uuid4
    )
    #: Submitting organisation.
    submittingorg: Mapped[UUID_ID] = mapped_column(
        GUID, ForeignKey("clinvarsubuserorg.id", ondelete="CASCADE"), nullable=False
    )
    #: Timestamp of creation.
    created: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=default_utcnow)
    #: Timestamp of last update.
    updated: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=default_utcnow)
    #: Primary variant identifier, e.g., ``GRCh37-1-1000-A-G`` or
    #: ``DEL-GRCh38-1-1000-2000``.
    primary_variant_id = Column(String(1024), nullable=False)
    #: Effective SCV identifier.
    effective_scv = Column(String(32), nullable=True)
    #: Effective presence.
    effective_presence: Column[Presence] = Column(Enum(Presence), nullable=True)
    #: Desired presence.
    desired_presence: Column[Presence] = Column(Enum(Presence), nullable=False)
    #: Status of the submission.
    status: Column[Status] = Column(Enum(Status), nullable=False)


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

    #: UUID of the submission activity.
    id: Mapped[UUID_ID] = mapped_column(
        GUID, primary_key=True, index=True, default=uuid_module.uuid4
    )
    #: Timestamp of creation.
    created: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=default_utcnow)
    #: Submission thread.
    submissionthread: Mapped[UUID_ID] = mapped_column(
        GUID, ForeignKey("clinvarsubthread.id", ondelete="CASCADE"), nullable=False
    )
    #: Kind of the activity.
    kind: Column[ActivityKind] = Column(Enum(ActivityKind), nullable=False)
    #: Status of the activity.
    status: Column[Status] = Column(Enum(Status), nullable=False)
    #: Request payload.
    request_payload = Column(JSON, nullable=True)
    #: Timestamp of the request.
    request_timestamp = Column(
        "request_timestamp",
        DateTime,
        nullable=True,
    )
    #: Status of the response.
    response_status: Column[Status] = Column(Enum(Status), nullable=True)
    #: Response payload.
    response_payload = Column(JSON, nullable=True)
    #: Timestamp of the response.
    response_timestamp = Column("response_timestamp", DateTime, nullable=True)
