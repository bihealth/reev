import asyncio
import enum
import logging
import os
from typing import AsyncGenerator, Iterator

import pydantic
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
    SubmissionActivity,
    SubmissionActivityKind,
    SubmissionActivityStatus,
    SubmissionThread,
    SubmissionThreadStatus,
    SubmittingOrg,
    VariantPresence,
)
from app.models.user import User
from app.schemas.clinvarsub import (
    SubmissionActivityCreate,
    SubmissionThreadCreate,
    SubmittingOrgCreate,
)
from tests.utils import FREEZE_TIME, FREEZE_TIME_1SEC

if os.environ.get("SQLALCHEMY_DEBUG", "0") == "1":
    logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)


class ObjNames(pydantic.BaseModel):
    """Namespace of valid object identifiers."""

    #: Valid seqvar identifiers.
    seqvar: list[str]
    #: Valid strucvar identifiers.
    strucvar: list[str]
    #: Valid gene identifiers.
    gene: list[str]


@pytest.fixture
def obj_names() -> ObjNames:
    """Fixture with a namespace of valid object identifiers."""
    return ObjNames(
        seqvar=[
            "grch37-1-123-A-C",
            "grch37-1-123-AT-A",
            "grch37-1-123-A-AT",
        ],
        strucvar=[
            "DEL-grch37-1-123-456",
            "DUP-grch37-1-123-456",
            "DEL-grch38-1-123-456",
        ],
        gene=[
            "HGNC:1100",
            "HGNC:123",
            "HGNC:456",
        ],
    )


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


@enum.unique
class UserChoice(enum.Enum):
    """Enum for test users."""

    #: Anonymous user
    NONE = "anonymous"
    #: Regular user
    REGULAR = "regular"
    #: Superuser
    SUPERUSER = "superuser"


@pytest.fixture()
def test_user(db_session: AsyncSession, request: pytest.FixtureRequest) -> User | None:
    """Create a test user and return it.

    Special handling for ``request.param`` (type ``TestUser``).
    """
    # Get the user type from the request, defaulting to regular and early return for anonymous.
    user_choice: UserChoice = getattr(request, "param", UserChoice.REGULAR)
    if user_choice == UserChoice.NONE:
        return None

    async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
        yield db_session

    user = asyncio.run(
        init_db.create_user(
            email="test@example.com",
            password="password123",
            is_superuser=user_choice == UserChoice.SUPERUSER,
            get_async_session=get_db_session,
        )
    )
    return user


@pytest.fixture()
def client_user(test_user: User | None, request: pytest.FixtureRequest):
    """Create a test client with a test user.

    Special handling for ``request.param`` (type ``TestUser``).
    """
    # Get the user type from the request, defaulting to regular and early return for anonymous.
    user: UserChoice = getattr(request, "param", UserChoice.REGULAR)

    app.dependency_overrides[current_active_user] = lambda: test_user

    if test_user is not None:
        app.dependency_overrides[current_active_user] = lambda: test_user

        if user == UserChoice.SUPERUSER:
            app.dependency_overrides[current_active_superuser] = lambda: test_user

    client = TestClient(app)
    yield client

    app.dependency_overrides.pop(current_active_user, None)
    if user == UserChoice.SUPERUSER:
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
    with freeze_time(FREEZE_TIME):
        return await crud.submittingorg.create(session=db_session, obj_in=submittingorg_create)


@pytest.fixture
def submissionthread_create(submittingorg: SubmittingOrg) -> SubmissionThreadCreate:
    """Create a new schema object only."""
    return SubmissionThreadCreate(
        desired_presence=VariantPresence.PRESENT,
        status=SubmissionThreadStatus.INITIAL,
        submittingorg_id=submittingorg.id,
        primary_variant_desc="grch37-1-1000-A-G",
    )


@pytest.fixture
async def submissionthread(
    db_session: AsyncSession, submissionthread_create: SubmissionThreadCreate
) -> SubmissionThread:
    """Create a new schema object only."""
    with freeze_time(FREEZE_TIME):
        return await crud.submissionthread.create(
            session=db_session, obj_in=submissionthread_create
        )


@pytest.fixture
def submissionactivity_create(submissionthread: SubmissionThread) -> SubmissionActivityCreate:
    """Create a new schema object only with kind=CREATE."""
    return SubmissionActivityCreate(
        submissionthread_id=submissionthread.id,
        kind=SubmissionActivityKind.CREATE,
        status=SubmissionActivityStatus.WAITING,
        request_payload=None,
        request_timestamp=None,
        response_payload=None,
        response_timestamp=None,
    )


@pytest.fixture
def submissionactivity_create_kind_retrieve(
    submissionthread: SubmissionThread,
) -> SubmissionActivityCreate:
    """Create a new schema object only with kind=RETRIEVE."""
    return SubmissionActivityCreate(
        submissionthread_id=submissionthread.id,
        kind=SubmissionActivityKind.RETRIEVE,
        status=SubmissionActivityStatus.WAITING,
        request_payload=None,
        request_timestamp=None,
        response_payload=None,
        response_timestamp=None,
    )


@pytest.fixture
async def submissionactivity(
    db_session: AsyncSession, submissionactivity_create: SubmissionActivityCreate
) -> SubmissionActivity:
    """Create a new schema object only."""
    with freeze_time(FREEZE_TIME):
        return await crud.submissionactivity.create(
            session=db_session, obj_in=submissionactivity_create
        )


@pytest.fixture
async def submissionactivity_kind_retrieve(
    db_session: AsyncSession, submissionactivity_create_kind_retrieve: SubmissionActivityCreate
) -> SubmissionActivity:
    """Create a new schema object only."""
    with freeze_time(FREEZE_TIME_1SEC):
        return await crud.submissionactivity.create(
            session=db_session, obj_in=submissionactivity_create_kind_retrieve
        )
