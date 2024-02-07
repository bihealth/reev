"""Models for case information."""

import uuid as uuid_module
from typing import TYPE_CHECKING

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
from app.schemas.caseinfo import DiseaseTerm, Ethnicity, HpoTerm, Inheritance, Sex, Zygosity

UUID_ID = uuid_module.UUID


class CaseInfo(Base):
    """Case information."""

    __tablename__ = "caseinfo"

    __table_args__ = (UniqueConstraint("user", "pseudonym", name="uq_caseinfo"),)

    if TYPE_CHECKING:  # pragma: no cover
        id: UUID_ID
        user: UUID_ID
        pseudonym: str
        diseases: list[DiseaseTerm]
        hpo_terms: list[HpoTerm]
        inheritance: Inheritance
        affected_family_members: bool
        sex: Sex
        age_of_onset_month: int
        ethnicity: Ethnicity
        zygosity: Zygosity
        family_segregation: bool
    else:
        #: UUID of the case information.
        id: Mapped[UUID_ID] = mapped_column(
            GUID, primary_key=True, index=True, default=uuid_module.uuid4
        )
        #: User who created the case information.
        user = Column(Uuid, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
        #: Pseudonym of the patient.
        pseudonym = Column(String(255), nullable=False)
        #: Diseases of the patient.
        diseases = Column(JSON, nullable=True)
        #: HPO terms of the patient.
        hpo_terms = Column(JSON, nullable=True)
        #: Inheritance of the patient.
        inheritance = Column(Enum(Inheritance), nullable=True)
        #: Affected family members of the patient.
        affected_family_members = Column(Boolean, nullable=True)
        #: Sex of the patient.
        sex = Column(Enum(Sex), nullable=True)
        #: Age of onset of the patient.
        age_of_onset_month = Column(Integer, nullable=True)
        #: Ethnicity of the patient.
        ethnicity = Column(Enum(Ethnicity), nullable=True)
        #: Zygosity of the patient.
        zygosity = Column(Enum(Zygosity), nullable=True)
        #: Family segregation of the patient.
        family_segregation = Column(Boolean, nullable=True)
