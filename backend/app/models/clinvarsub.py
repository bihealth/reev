"""Models for the ClinVar submission."""

import enum
import uuid as uuid_module
from datetime import datetime

import pydantic  # noqa
from fastapi_users_db_sqlalchemy.generics import GUID
from sqlalchemy import (
    JSON,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base

UUID_ID = uuid_module.UUID


def default_utcnow():
    """Freezegun friendly utcnow."""
    return datetime.utcnow()


class SubmittingOrg(AsyncAttrs, Base):
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
class VariantPresence(enum.Enum):
    """Status of a variant in ClinVar."""

    #: Variant is absent from ClinVar.
    ABSENT = "absent"
    #: Variant is present in ClinVar.
    PRESENT = "present"


@enum.unique
class SubmissionThreadStatus(enum.Enum):
    """Status of a :ref:`SubmissionThread`.

    A thread starts out being in initial state while being edit by the
    user.  It is then submitted into the work queue together with an
    initial activity where it is waiting to be processed.  It is then
    worked on in the form of activities and ends up being complete or
    failed.  If the latest activity runs into a timeout (e.g., worker
    death) then this is reflected on the thread as well.
    """

    #: Initial state while being edited by the user.
    INITIAL = "initial"
    #: Waiting in the queue to be picked up by the worker.
    WAITING = "waiting"
    #: At least one activity has been picked up by the worker and
    #: there is at least one activity that is not complete yet.
    IN_PROGRESS = "in_progress"
    #: The submission thread has been processed with final result
    #: of success.
    SUCCESS = "success"
    #: The submission thread has terminated with final result of failure.
    FAILED = "failed"

    def is_initial(self):
        """Return whether the status is initial."""
        return self is SubmissionThreadStatus.INITIAL

    def is_waiting(self):
        """Return whether the status is waiting."""
        return self is SubmissionThreadStatus.WAITING

    def is_in_progress(self):
        """Return whether the status is in progress."""
        return self is SubmissionThreadStatus.IN_PROGRESS

    def is_terminal(self):
        """Return whether the status is terminal."""
        return self in (SubmissionThreadStatus.SUCCESS, SubmissionThreadStatus.FAILED)


class SubmissionThread(AsyncAttrs, Base):
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
        Index("clinvarsubthread_variantid", "primary_variant_desc"),
        UniqueConstraint("submittingorg_id", "primary_variant_desc"),
    )

    #: UUID of the submission thread.
    id: Mapped[UUID_ID] = mapped_column(
        GUID, primary_key=True, index=True, default=uuid_module.uuid4
    )
    #: Submitting organisation.
    submittingorg_id: Mapped[UUID_ID] = mapped_column(
        GUID, ForeignKey("clinvarsubuserorg.id", ondelete="CASCADE"), nullable=False
    )
    #: Timestamp of creation.
    created: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=default_utcnow)
    #: Timestamp of last update.
    updated: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=default_utcnow)
    #: Primary variant identifier, e.g., ``GRCh37-1-1000-A-G`` or
    #: ``DEL-GRCh38-1-1000-2000``.
    primary_variant_desc = Column(String(1024), nullable=False)
    #: Effective SCV identifier.
    effective_scv = Column(String(32), nullable=True)
    #: Effective presence.
    effective_presence: Column[VariantPresence] = Column(Enum(VariantPresence), nullable=True)
    #: Desired presence.
    desired_presence: Column[VariantPresence] = Column(Enum(VariantPresence), nullable=False)
    #: Status of the submission.
    status: Column[SubmissionThreadStatus] = Column(Enum(SubmissionThreadStatus), nullable=False)


@enum.unique
class SubmissionActivityKind(enum.Enum):
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


@enum.unique
class SubmissionActivityStatus(enum.Enum):
    """Status of a :ref:`SubmissionActivity`.

    An activity starts out waiting in the queue to be picked up by the
    worker, goes on into being processed, and ends up being complete
    or failed.  An activity can also end up being in a timeout state.
    """

    #: Waiting in the queue to be picked up by the worker.
    WAITING = "waiting"
    #: Activity is in progress.
    IN_PROGRESS = "in_progress"
    #: Activity is complete with result success.
    COMPLETE_SUCCESS = "complete_success"
    #: Activity is complete with result "submission failure".
    COMPLETE_FAILURE = "complete_failure"
    #: Activity is complete with result "submission in progress".
    COMPLETE_IN_PROGRESS = "complete_in_progress"
    #: Activity failed.
    FAILED = "failed"
    #: Activity failed because of a timeout.
    TIMEOUT = "timeout"

    def is_waiting(self):
        """Return whether the status is waiting."""
        return self is SubmissionActivityStatus.WAITING

    def is_in_progress(self):
        """Return whether the status is in progress."""
        return self is SubmissionActivityStatus.IN_PROGRESS

    def is_terminal(self):
        """Return whether the status is terminal."""
        return self in (
            SubmissionActivityStatus.COMPLETE_SUCCESS,
            SubmissionActivityStatus.COMPLETE_FAILURE,
            SubmissionActivityStatus.COMPLETE_IN_PROGRESS,
            SubmissionActivityStatus.FAILED,
            SubmissionActivityStatus.TIMEOUT,
        )


class SubmissionActivity(AsyncAttrs, Base):
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
    submissionthread_id: Mapped[UUID_ID] = mapped_column(
        GUID, ForeignKey("clinvarsubthread.id", ondelete="CASCADE"), nullable=False
    )
    #: Kind of the activity.
    kind: Column[SubmissionActivityKind] = Column(Enum(SubmissionActivityKind), nullable=False)
    #: Status of the activity.
    status: Column[SubmissionActivityStatus] = Column(
        Enum(SubmissionActivityStatus), nullable=False
    )
    #: Request payload.
    request_payload = Column(JSON, nullable=True)
    #: Timestamp of the request.
    request_timestamp = Column(
        "request_timestamp",
        DateTime,
        nullable=True,
    )
    #: Response payload.
    response_payload = Column(JSON, nullable=True)
    #: Timestamp of the response.
    response_timestamp = Column("response_timestamp", DateTime, nullable=True)
