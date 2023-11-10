from typing import AsyncIterator

from app.core import auth
from app.db.session import SessionLocal, engine

current_active_user = auth.fastapi_users.current_user(active=True)
current_active_superuser = auth.fastapi_users.current_user(active=True, superuser=True)


async def get_db() -> AsyncIterator[SessionLocal]:  # type: ignore[valid-type]
    db = SessionLocal()
    yield db
    await db.close()
