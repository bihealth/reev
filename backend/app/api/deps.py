from typing import AsyncIterator

from app.core import auth
from app.db.session import SessionLocal

#: Current user (requires active status).
current_active_user = auth.fastapi_users.current_user(active=True)
#: Current verified user (requires active and verified status).
current_verified_user = auth.fastapi_users.current_user(active=True, verified=True)
#: Current superuser (requires active and superuser status).
current_active_superuser = auth.fastapi_users.current_user(active=True, superuser=True)


async def get_db() -> AsyncIterator[SessionLocal]:  # type: ignore[valid-type]
    async with SessionLocal() as db:
        yield db
