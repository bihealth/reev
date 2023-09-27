import pytest
from _pytest.monkeypatch import MonkeyPatch
from app.core.config import settings
from fastapi.testclient import TestClient


@pytest.mark.asyncio
async def test_version(monkeypatch: MonkeyPatch, client: TestClient):
    """Test version endpoint."""
    monkeypatch.setattr(settings, "REEV_VERSION", "1.2.3")
    response = client.get("/internal/version")
    assert response.status_code == 200
    assert response.text == "1.2.3"


@pytest.mark.asyncio
async def test_version_no_version(monkeypatch: MonkeyPatch, fp, client: TestClient):
    """Test version endpoint with no version."""
    monkeypatch.setattr(settings, "REEV_VERSION", None)
    # We mock the output of ``git describe`` as subprocesses will be triggered
    # internally.
    fp.register(["git", "describe", "--tags", "--dirty"], stdout="v0.0.0-16-g7a4205d-dirty")
    response = client.get("/internal/version")

    assert response.status_code == 200
    assert response.text == "v0.0.0-16-g7a4205d-dirty"


@pytest.mark.asyncio
async def test_favicon(client: TestClient):
    """Test favicon endpoint."""
    response = client.get("/favicon.ico")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/vnd.microsoft.icon"
