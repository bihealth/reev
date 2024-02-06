"""Models for comments on variants and genes."""

import uuid as uuid_module
from datetime import datetime
from typing import TYPE_CHECKING

from fastapi_users_db_sqlalchemy.generics import GUID  # noqa
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    String,
    Text,
    UniqueConstraint,
    Uuid,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base
from app.models.clinvarsub import default_utcnow
from app.schemas.comment import CommentTypes

UUID_ID = uuid_module.UUID


class Comment(Base):
    """Comment of a variant or gene."""

    __tablename__ = "comments"

    __table_args__ = (UniqueConstraint("user", "obj_type", "obj_id", name="uq_comment"),)

    #: UUID of the comment.
    id: Mapped[UUID_ID] = mapped_column(
        GUID, primary_key=True, index=True, default=uuid_module.uuid4
    )
    #: User who created the comment.
    user = Column(Uuid, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    #: Type of the commented object.
    obj_type: Mapped[CommentTypes] = mapped_column(Enum(CommentTypes), nullable=False)
    #: ID of the commented object.
    obj_id = Column(String(255), nullable=False)
    #: Comment text.
    comment = Column(Text, nullable=False)
    #: Whether the comment is public.
    public = Column(Boolean, nullable=False, default=True)
    #: Timestamp of creation.
    created: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=default_utcnow)
    #: Timestamp of last update.
    updated: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=default_utcnow)
