import asyncio
import logging
import os
from typing import AsyncGenerator, Iterator

import pytest
from _pytest.monkeypatch import MonkeyPatch
from fastapi.testclient import TestClient
from freezegun import freeze_time
from sqlalchemy import StaticPool
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app import crud
from app.api import deps
from app.api.deps import current_active_superuser, current_active_user
from app.db import init_db, session
from app.db.base import Base
from app.main import app
from app.models.clinvarsub import (
    ActivityKind,
    Presence,
    Status,
    SubmissionActivity,
    SubmissionThread,
    SubmittingOrg,
)
from app.models.user import User
from app.schemas.clinvarsub import (
    SubmissionActivityCreate,
    SubmissionThreadCreate,
    SubmittingOrgCreate,
)

if os.environ.get("SQLALCHEMY_DEBUG", "0") == "1":
    logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture()
def db_engine() -> Iterator[AsyncEngine]:
    # setup engine with in-memory sqlite for testing
    engine = create_async_engine(
        "sqlite+aiosqlite:///",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    yield engine


@pytest.fixture()
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


@pytest.fixture()
def test_user(db_session: AsyncSession, request) -> User | None:
    """Create a test user and return it.

    Special handling for ``request.param``:
    If ``request.param`` is ``None``, return ``None``.
    If ``request.param`` is ``True``, return a superuser.
    If ``request.param`` is ``False``, return a regular user.
    """
    if hasattr(request, "param") and request.param is None:
        # Return None for anonymous user tests
        return None

    superuser: bool = request.param if hasattr(request, "param") else False

    async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
        yield db_session

    user = asyncio.run(
        init_db.create_user(
            email="test@example.com",
            password="password123",
            is_superuser=superuser,
            get_async_session=get_db_session,
        )
    )
    return user


@pytest.fixture()
def client_user(test_user: User, request):
    """Create a test client with a test user.

    Special handling for ``request.param``:
    If ``request.param`` is ``None``, return a client with no user.
    If ``request.param`` is ``True``, return a client with a superuser.
    If ``request.param`` is ``False``, return a client with a regular user.
    """
    superuser: bool = request.param if hasattr(request, "param") else False

    old_current_active_user = app.dependency_overrides.get(current_active_user)
    app.dependency_overrides[current_active_user] = lambda: test_user

    if test_user is not None:
        old_current_active_user = app.dependency_overrides.get(current_active_user)
        app.dependency_overrides[current_active_user] = lambda: test_user

        if superuser:
            old_current_active_superuser = app.dependency_overrides.get(current_active_superuser)
            app.dependency_overrides[current_active_superuser] = lambda: test_user

    client = TestClient(app)
    yield client

    app.dependency_overrides.pop(current_active_user, None)
    if superuser:
        app.dependency_overrides.pop(current_active_superuser, None)


@pytest.fixture
def submittingorg_create(test_user: User) -> SubmittingOrgCreate:
    """Create a new schema object only, owned by `test_user`."""
    return SubmittingOrgCreate(label="test", clinvar_api_token="le-token", owner=test_user.id)


@pytest.fixture
async def submittingorg(
    db_session: AsyncSession, submittingorg_create: SubmittingOrgCreate
) -> SubmittingOrg:
    """Create a new database record (tests use isolated databases)."""
    with freeze_time("2023-12-14T09:01:19.452062"):
        return await crud.submittingorg.create(session=db_session, obj_in=submittingorg_create)


@pytest.fixture
def submissionthread_create(submittingorg: SubmittingOrg) -> SubmissionThreadCreate:
    """Create a new schema object only."""
    return SubmissionThreadCreate(
        desired_presence=Presence.PRESENT,
        status=Status.INITIAL,
        submittingorg_id=submittingorg.id,
        primary_variant_desc="grch37-1-1000-A-G",
    )


@pytest.fixture
async def submissionthread(
    db_session: AsyncSession, submissionthread_create: SubmissionThreadCreate
) -> SubmissionThread:
    """Create a new schema object only."""
    with freeze_time("2023-12-14T09:01:19.452062"):
        return await crud.submissionthread.create(
            session=db_session, obj_in=submissionthread_create
        )


@pytest.fixture
def submissionactivity_create(submissionthread: SubmissionThread) -> SubmissionActivityCreate:
    """Create a new schema object only."""
    return SubmissionActivityCreate(
        submissionthread_id=submissionthread.id,
        kind=ActivityKind.CREATE,
        status=Status.INITIAL,
        request_payload=None,
        request_timestamp=None,
        response_status=None,
        response_payload=None,
        response_timestamp=None,
    )


@pytest.fixture
async def submissionactivity(
    db_session: AsyncSession, submissionactivity_create: SubmissionActivityCreate
) -> SubmissionActivity:
    """Create a new schema object only."""
    with freeze_time("2023-12-14T09:01:19.452062"):
        return await crud.submissionactivity.create(
            session=db_session, obj_in=submissionactivity_create
        )
