import pytest
from _pytest.monkeypatch import MonkeyPatch
from fastapi.testclient import TestClient
from pytest_httpx._httpx_mock import HTTPXMock

from app.core.config import settings

#: Host name to use for the mocked backend.
MOCKED_BACKEND_HOST = "mocked-backend"

#: A "token" to be used in test URLs, does not carry a meaning as it is mocked.
MOCKED_URL_TOKEN = "xXTeStXxx"


@pytest.mark.asyncio
async def test_proxy_annonars(monkeypatch: MonkeyPatch, httpx_mock: HTTPXMock, client: TestClient):
    """Test proxying to annonars backend."""
    monkeypatch.setattr(settings, "BACKEND_PREFIX_ANNONARS", f"http://{MOCKED_BACKEND_HOST}")
    httpx_mock.add_response(
        url=f"http://{MOCKED_BACKEND_HOST}/{MOCKED_URL_TOKEN}",
        method="GET",
        text="Mocked response",
    )

    response = client.get(f"/internal/proxy/annonars/{MOCKED_URL_TOKEN}")
    assert response.status_code == 200
    assert response.text == "Mocked response"


@pytest.mark.asyncio
async def test_proxy_mehari(monkeypatch: MonkeyPatch, httpx_mock: HTTPXMock, client: TestClient):
    """Test proxying to mehari backend."""
    monkeypatch.setattr(settings, "BACKEND_PREFIX_MEHARI", f"http://{MOCKED_BACKEND_HOST}")
    httpx_mock.add_response(
        url=f"http://{MOCKED_BACKEND_HOST}/{MOCKED_URL_TOKEN}",
        method="GET",
        text="Mocked response",
    )

    response = client.get(f"/internal/proxy/mehari/{MOCKED_URL_TOKEN}")
    assert response.status_code == 200
    assert response.text == "Mocked response"


@pytest.mark.asyncio
async def test_proxy_viguno(monkeypatch: MonkeyPatch, httpx_mock: HTTPXMock, client: TestClient):
    """Test proxying to viguno backend."""
    monkeypatch.setattr(settings, "BACKEND_PREFIX_VIGUNO", f"http://{MOCKED_BACKEND_HOST}")
    httpx_mock.add_response(
        url=f"http://{MOCKED_BACKEND_HOST}/{MOCKED_URL_TOKEN}",
        method="GET",
        text="Mocked response",
    )

    response = client.get(f"/internal/proxy/viguno/{MOCKED_URL_TOKEN}")
    assert response.status_code == 200
    assert response.text == "Mocked response"


@pytest.mark.asyncio
async def test_proxy_nginx(monkeypatch: MonkeyPatch, httpx_mock: HTTPXMock, client: TestClient):
    """Test proxying to nginx backend."""
    monkeypatch.setattr(settings, "BACKEND_PREFIX_NGINX", f"http://{MOCKED_BACKEND_HOST}")
    httpx_mock.add_response(
        url=f"http://{MOCKED_BACKEND_HOST}/{MOCKED_URL_TOKEN}",
        method="GET",
        text="Mocked response",
    )

    response = client.get(f"/internal/proxy/nginx/{MOCKED_URL_TOKEN}")
    assert response.status_code == 200
    assert response.text == "Mocked response"


@pytest.mark.asyncio
async def test_proxy_dotty(monkeypatch: MonkeyPatch, httpx_mock: HTTPXMock, client: TestClient):
    """Test proxying to dotty backend."""
    monkeypatch.setattr(settings, "BACKEND_PREFIX_DOTTY", f"http://{MOCKED_BACKEND_HOST}")
    httpx_mock.add_response(
        url=f"http://{MOCKED_BACKEND_HOST}/{MOCKED_URL_TOKEN}",
        method="GET",
        text="Mocked response",
    )

    response = client.get(f"/internal/proxy/dotty/{MOCKED_URL_TOKEN}")
    assert response.status_code == 200
    assert response.text == "Mocked response"


@pytest.mark.asyncio
async def test_invalid_proxy_route(client: TestClient):
    """Test invalid proxy route."""
    response = client.get("/internal/proxy/some-other-path")
    assert response.status_code == 404
    assert response.text == "Reverse proxy route not found"
