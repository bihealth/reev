"""Models for the ClinVar submission."""

import uuid as uuid_module
from typing import Optional, TYPE_CHECKING

import clinvar_api.models as clinvar_models
from fastapi_users_db_sqlalchemy.generics import GUID  # noqa
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


class ClinvarUserOrg(Base):
    """Information to attach to a user for one organisation."""

    __tablename__ = "clinvarsubmissionuserorg"

    if TYPE_CHECKING:  # pragma: no cover
        id: UUID_ID
        user: UUID_ID
        label: str
        clinvar_api_token: str


class ClinvarSubmissionLogbook(Base):
    """
    Container for the activity of one variant submission to ClinVar for
    a single organisation.

    One variant submission corresponds to a genetic variant as submitted for
    one condition and one organisation.  The variant can be submitted and
    on success an SCV identifier is returned.  Deletion and resubmission
    will lead to a new SCV identifier so we store the top-level identifier
    only.
    """

    __tablename__ = "clinvarsubmissionlogbook"

    if TYPE_CHECKING:  # pragma: no cover
        id: UUID_ID
        clinvaruserorg: UUID_ID
        primary_id: str
        status_presence: str
        status_success: str


class ClinvarSubmissionEntry(Base):
    """One entry in a :ref:`ClinvarSubmissionLookbook`.

    This corresponds to a submission sent to ClinVar and the corresponding
    response.
    """

    __tablename__ = "clinvarsubmissionentry"

    if TYPE_CHECKING:  # pragma: no cover
        id: UUID_ID
        clinvarsubmissionlogbook: UUID_ID
        kind: str
        status: str
        send_payload: str
        send_timestamp: str
        response_status: str
        response_payload: str
        response_timestamp: str
