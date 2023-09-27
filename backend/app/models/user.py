from typing import List

from fastapi_users_db_sqlalchemy import (
    SQLAlchemyBaseOAuthAccountTableUUID,
    SQLAlchemyBaseUserTableUUID,
)
from sqlalchemy.orm import Mapped, relationship

from app.db.base import Base


class OAuthAccount(SQLAlchemyBaseOAuthAccountTableUUID, Base):
    pass


class User(SQLAlchemyBaseUserTableUUID, Base):
    oauth_accounts: Mapped[List[OAuthAccount]] = relationship("OAuthAccount", lazy="joined")
