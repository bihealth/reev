"""Models for admin messages."""

import uuid
from typing import TYPE_CHECKING

from app.db.session import Base
from app.models.utils.guid import GUID
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text


class AdminMessage(Base):
    """Message to be set by administrators.

    We currently only support read-only access, must be created via admin interface.
    """

    __tablename__ = "adminmessages"

    #: Primary key.
    id = Column(Integer, primary_key=True, index=True)
    #: UUID for external reference.
    uuid = Column(
        GUID(36), default=lambda: str(uuid.uuid4()), nullable=False, unique=True, index=True
    )
    #: Message title.
    title = Column(String(255), nullable=False)
    #: The message's text.
    text = Column(Text, nullable=True)
    #: When to start displaying the message.
    active_start = Column(DateTime, nullable=False)
    #: When to stop displaying the message.
    active_stop = Column(DateTime, nullable=False)
    #: Whether the message is enabled at all.
    enabled = Column(Boolean, default=True, nullable=False)
