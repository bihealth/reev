import pytest
from _pytest.monkeypatch import MonkeyPatch
from fastapi.testclient import TestClient

from app.core.config import settings


@pytest.mark.anyio
async def test_version(monkeypatch: MonkeyPatch, client: TestClient):
    """Test version endpoint."""
    # arrange:
    monkeypatch.setattr(settings, "REEV_VERSION", "1.2.3")
    # act:
    response = client.get("/internal/version")
    # assert:
    assert response.status_code == 200
    assert response.text == "1.2.3"


@pytest.mark.anyio
async def test_version_no_version(monkeypatch: MonkeyPatch, fp, client: TestClient):
    """Test version endpoint with no version."""
    # arrange:
    monkeypatch.setattr(settings, "REEV_VERSION", None)
    fp.register(["git", "describe", "--tags", "--dirty"], stdout="v0.0.0-16-g7a4205d-dirty")
    # act:
    response = client.get("/internal/version")
    # assert:
    assert response.status_code == 200
    assert response.text == "v0.0.0-16-g7a4205d-dirty"


@pytest.mark.anyio
async def test_favicon(client: TestClient):
    """Test favicon endpoint."""
    # act:
    response = client.get("/favicon.ico")
    # assert:
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/vnd.microsoft.icon"


@pytest.mark.anyio
async def test_frontend_settings(monkeypatch: MonkeyPatch, client: TestClient):
    """Test frontend settings endpoint."""
    # arrange:
    monkeypatch.setattr(settings, "MATOMO_HOST", "matomo.example.com")
    monkeypatch.setattr(settings, "MATOMO_SITE_ID", 42)
    # act:
    response = client.get("/internal/frontend-settings")
    # assert:
    assert response.status_code == 200
    assert response.json() == {"matomo_host": "matomo.example.com", "matomo_site_id": 42}


@pytest.mark.anyio
async def test_frontend_settings_no_matomo(monkeypatch: MonkeyPatch, client: TestClient):
    """Test frontend settings endpoint with no matomo."""
    # arrange:
    monkeypatch.setattr(settings, "MATOMO_HOST", None)
    monkeypatch.setattr(settings, "MATOMO_SITE_ID", None)
    # act:
    response = client.get("/internal/frontend-settings")
    # assert:
    assert response.status_code == 200
    assert response.json() == {"matomo_host": None, "matomo_site_id": None}
