from typing import AsyncGenerator, AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.db.session import SessionLocal, engine


async def get_db() -> AsyncIterator[SessionLocal]:  # type: ignore[valid-type]
    db = SessionLocal()
    yield db
    await db.close()


async_session_maker = async_sessionmaker(engine, expire_on_commit=False)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session
