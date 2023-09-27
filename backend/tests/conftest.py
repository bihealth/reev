from typing import Iterator

import pytest
from _pytest.monkeypatch import MonkeyPatch
from app import models  # noqa
from app.api import deps
from app.db import session
from app.db.base import Base
from app.main import app
from fastapi.testclient import TestClient
from sqlalchemy.engine import Engine, create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool


@pytest.fixture()
def db_engine() -> Iterator[Engine]:
    # setup engine with in-memory sqlite for testing
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    yield engine


@pytest.fixture()
def db(db_engine: Engine, monkeypatch: MonkeyPatch) -> Iterator:
    """Create in-memory sqlite database for testing."""
    # create all tables
    Base.metadata.create_all(bind=db_engine)
    # create a session for testing
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)
    try:
        monkeypatch.setattr(session, "engine", db_engine)
        monkeypatch.setattr(session, "SessionLocal", TestingSessionLocal)
        db = TestingSessionLocal()

        def override_get_db():
            yield db

        app.dependency_overrides[deps.get_db] = override_get_db
        yield db
    finally:
        db.close()
    # drop all tables
    Base.metadata.drop_all(bind=db_engine)


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
