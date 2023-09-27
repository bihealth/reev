"""Models for admin messages."""

import datetime
import uuid as uuid_module
from typing import TYPE_CHECKING

from fastapi_users_db_sqlalchemy.generics import GUID  # noqa
from sqlalchemy import Boolean, Column, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base

UUID_ID = uuid_module.UUID


class AdminMessage(Base):
    """Message to be set by administrators.

    We currently only support read-only access, must be created via admin interface.
    """

    __tablename__ = "adminmessages"

    if TYPE_CHECKING:  # pragma: no cover
        id: UUID_ID
        title: str
        text: str
        active_start: datetime.datetime
        active_stop: datetime.datetime
    else:
        #: UUID of the message.
        id: Mapped[UUID_ID] = mapped_column(
            GUID, primary_key=True, index=True, default=uuid_module.uuid4
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
