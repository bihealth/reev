from typing import TYPE_CHECKING, List, Optional

from fastapi_users_db_sqlalchemy import (
    SQLAlchemyBaseOAuthAccountTableUUID,
    SQLAlchemyBaseUserTableUUID,
)
from sqlalchemy import BigInteger, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

#: Long tokens -- 64kbytes should be enough for everyone
TOKEN_SIZE = 64 * 1024


class OAuthAccount(SQLAlchemyBaseOAuthAccountTableUUID, Base):
    """Base OAuth account table definition."""

    __tablename__ = "oauth_account"

    __table_args__ = (UniqueConstraint("oauth_name", "user_id"),)

    if TYPE_CHECKING:  # pragma: no cover
        access_token: str
        refresh_token: Optional[str]
        expires_at: Optional[int]
    else:
        # We need to increase the token size for the OAuthAccount table.
        access_token: Mapped[str] = mapped_column(String(TOKEN_SIZE), nullable=False)
        refresh_token: Mapped[Optional[str]] = mapped_column(String(TOKEN_SIZE), nullable=True)
        expires_at: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)


class User(SQLAlchemyBaseUserTableUUID, Base):
    oauth_accounts: Mapped[List[OAuthAccount]] = relationship("OAuthAccount", lazy="joined")
