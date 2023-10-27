"""Models for bookmarks of variants and genes."""

import uuid as uuid_module
from typing import TYPE_CHECKING

from fastapi_users_db_sqlalchemy.generics import GUID  # noqa
from sqlalchemy import Column, Enum, ForeignKey, String, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base
from app.schemas.bookmark import BookmarkTypes

UUID_ID = uuid_module.UUID


class Bookmark(Base):
    """Bookmark of a variant or gene."""

    __tablename__ = "bookmarks"

    __table_args__ = (UniqueConstraint("user", "obj_type", "obj_id", name="uq_bookmark"),)

    if TYPE_CHECKING:  # pragma: no cover
        id: UUID_ID
        user: UUID_ID
        obj_type: BookmarkTypes
        obj_id: str
    else:
        #: UUID of the bookmark.
        id: Mapped[UUID_ID] = mapped_column(
            GUID, primary_key=True, index=True, default=uuid_module.uuid4
        )
        #: User who created the bookmark.
        user = Column(Uuid, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
        #: Type of the bookmarked object.
        obj_type = Column(Enum(BookmarkTypes), nullable=False)
        #: ID of the bookmarked object.
        obj_id = Column(String(255), nullable=False)
