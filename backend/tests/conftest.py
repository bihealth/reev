from typing import AsyncGenerator, Iterator

import pytest
import pytest_asyncio
from _pytest.monkeypatch import MonkeyPatch
from fastapi.testclient import TestClient
from sqlalchemy import StaticPool
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.api import deps
from app.db import session
from app.db.base import Base
from app.main import app


@pytest.fixture()
def db_engine() -> Iterator[AsyncEngine]:
    # setup engine with in-memory sqlite for testing
    engine = create_async_engine(
        "sqlite+aiosqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    yield engine


@pytest_asyncio.fixture()
async def db_session(
    db_engine: AsyncEngine, monkeypatch: MonkeyPatch
) -> AsyncGenerator[AsyncSession, None]:
    """Create in-memory sqlite database for testing."""
    # create all tables
    async with db_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

        # create a session for testing
        TestingSessionLocal = async_sessionmaker(
            autocommit=False, autoflush=False, expire_on_commit=False, bind=db_engine
        )
        try:
            monkeypatch.setattr(session, "engine", db_engine)
            monkeypatch.setattr(session, "SessionLocal", TestingSessionLocal)
            db = TestingSessionLocal()

            def override_get_db():
                yield db

            app.dependency_overrides[deps.get_db] = override_get_db
            yield db
        finally:
            await db.close()

    # drop all tables
    async with db_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(scope="module")
def client() -> Iterator[TestClient]:
    """Fixture with a test client for the FastAPI app."""
    with TestClient(app) as c:
        yield c


@pytest.fixture
def non_mocked_hosts(client: TestClient) -> list[str]:
    """List of hosts that should not be mocked.

    We read the host from ``client``.
    """
    return [client._base_url.host]
