import contextlib
import logging
from typing import AsyncGenerator, Callable

from fastapi_users.exceptions import UserAlreadyExists
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_user_db, get_user_manager
from app.core.config import settings
from app.core.deps import get_async_session as deps_get_async_session
from app.schemas import UserCreate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def create_user(
    email: str,
    password: str,
    is_superuser: bool = False,
    get_async_session: Callable[[], AsyncGenerator[AsyncSession, None]] | None = None,
):
    """Create user with the given email and password and superusers status."""
    get_async_session_context = contextlib.asynccontextmanager(
        get_async_session or deps_get_async_session
    )
    get_user_db_context = contextlib.asynccontextmanager(get_user_db)
    get_user_manager_context = contextlib.asynccontextmanager(get_user_manager)

    try:
        async with get_async_session_context() as session:
            async with get_user_db_context(session) as user_db:
                async with get_user_manager_context(user_db) as user_manager:
                    user = await user_manager.create(
                        UserCreate(email=email, password=password, is_superuser=is_superuser)
                    )
                    logger.info(f"User created {email}")
                    return user
    except UserAlreadyExists:  # pragma: no cover
        logger.info(f"User {email} already exists")


async def create_superuser():
    if settings.FIRST_SUPERUSER_EMAIL and settings.FIRST_SUPERUSER_PASSWORD:  # pragma: no cover
        await create_user(
            email=settings.FIRST_SUPERUSER_EMAIL,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )


async def init_db():  # pragma: no cover
    await create_superuser()
