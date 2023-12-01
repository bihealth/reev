"""Models for ACMG sequence variant."""

import uuid as uuid_module
from typing import TYPE_CHECKING

from fastapi_users_db_sqlalchemy.generics import GUID  # noqa
from sqlalchemy import JSON, Column, ForeignKey, String, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base
from app.schemas.acmgseqvar import AcmgRank

UUID_ID = uuid_module.UUID


class AcmgSeqVar(Base):
    """ACMG sequence variant."""

    __tablename__ = "acmgseqvar"

    __table_args__ = (UniqueConstraint("user", "seqvar_name", name="uq_acmgseqvar"),)

    if TYPE_CHECKING:  # pragma: no cover
        id: UUID_ID
        user: UUID_ID
        seqvar_name: str
        acmg_rank: AcmgRank
    else:
        #: UUID of the ACMG sequence variant.
        id: Mapped[UUID_ID] = mapped_column(
            GUID, primary_key=True, index=True, default=uuid_module.uuid4
        )
        #: User who created the ACMG sequence variant.
        user = Column(Uuid, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
        #: Sequence variant ID.
        seqvar_name = Column(String(255), nullable=False)
        #: ACMG criteria.
        acmg_rank = Column(JSON, nullable=True)
