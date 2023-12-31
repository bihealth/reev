import pytest
from _pytest.monkeypatch import MonkeyPatch
from fastapi.testclient import TestClient
from pytest_httpx._httpx_mock import HTTPXMock

from app.core.config import settings

#: Host name to use for the mocked backend.
MOCKED_BACKEND_HOST = "mocked-backend"

#: A "token" to be used in test URLs, does not carry a meaning as it is mocked.
MOCKED_URL_TOKEN = "xXTeStXxx"


@pytest.mark.anyio
async def test_proxy_annonars(monkeypatch: MonkeyPatch, httpx_mock: HTTPXMock, client: TestClient):
    """Test proxying to annonars backend."""
    # arrange:
    monkeypatch.setattr(settings, "BACKEND_PREFIX_ANNONARS", f"http://{MOCKED_BACKEND_HOST}")
    httpx_mock.add_response(
        url=f"http://{MOCKED_BACKEND_HOST}/{MOCKED_URL_TOKEN}",
        method="GET",
        text="Mocked response",
    )
    # act:
    response = client.get(f"/internal/proxy/annonars/{MOCKED_URL_TOKEN}")
    # assert:
    assert response.status_code == 200
    assert response.text == "Mocked response"


@pytest.mark.anyio
async def test_proxy_mehari(monkeypatch: MonkeyPatch, httpx_mock: HTTPXMock, client: TestClient):
    """Test proxying to mehari backend."""
    # arrange:
    monkeypatch.setattr(settings, "BACKEND_PREFIX_MEHARI", f"http://{MOCKED_BACKEND_HOST}")
    httpx_mock.add_response(
        url=f"http://{MOCKED_BACKEND_HOST}/{MOCKED_URL_TOKEN}",
        method="GET",
        text="Mocked response",
    )
    # act:
    response = client.get(f"/internal/proxy/mehari/{MOCKED_URL_TOKEN}")
    # assert:
    assert response.status_code == 200
    assert response.text == "Mocked response"


@pytest.mark.anyio
async def test_proxy_viguno(monkeypatch: MonkeyPatch, httpx_mock: HTTPXMock, client: TestClient):
    """Test proxying to viguno backend."""
    # arrange:
    monkeypatch.setattr(settings, "BACKEND_PREFIX_VIGUNO", f"http://{MOCKED_BACKEND_HOST}")
    httpx_mock.add_response(
        url=f"http://{MOCKED_BACKEND_HOST}/{MOCKED_URL_TOKEN}",
        method="GET",
        text="Mocked response",
    )
    # act:
    response = client.get(f"/internal/proxy/viguno/{MOCKED_URL_TOKEN}")
    # assert:
    assert response.status_code == 200
    assert response.text == "Mocked response"


@pytest.mark.anyio
async def test_proxy_nginx(monkeypatch: MonkeyPatch, httpx_mock: HTTPXMock, client: TestClient):
    """Test proxying to nginx backend."""
    # arrange:
    monkeypatch.setattr(settings, "BACKEND_PREFIX_NGINX", f"http://{MOCKED_BACKEND_HOST}")
    httpx_mock.add_response(
        url=f"http://{MOCKED_BACKEND_HOST}/{MOCKED_URL_TOKEN}",
        method="GET",
        text="Mocked response",
    )
    # act:
    response = client.get(f"/internal/proxy/nginx/{MOCKED_URL_TOKEN}")
    # assert:
    assert response.status_code == 200
    assert response.text == "Mocked response"


@pytest.mark.anyio
async def test_proxy_dotty(monkeypatch: MonkeyPatch, httpx_mock: HTTPXMock, client: TestClient):
    """Test proxying to dotty backend."""
    # arrange:
    monkeypatch.setattr(settings, "BACKEND_PREFIX_DOTTY", f"http://{MOCKED_BACKEND_HOST}")
    httpx_mock.add_response(
        url=f"http://{MOCKED_BACKEND_HOST}/{MOCKED_URL_TOKEN}",
        method="GET",
        text="Mocked response",
    )
    # act:
    response = client.get(f"/internal/proxy/dotty/{MOCKED_URL_TOKEN}")
    # assert:
    assert response.status_code == 200
    assert response.text == "Mocked response"


@pytest.mark.anyio
async def test_proxy_cada_prio(monkeypatch: MonkeyPatch, httpx_mock: HTTPXMock, client: TestClient):
    """Test proxying to cada-prio backend."""
    # arrange:
    monkeypatch.setattr(settings, "BACKEND_PREFIX_CADA_PRIO", f"http://{MOCKED_BACKEND_HOST}")
    httpx_mock.add_response(
        url=f"http://{MOCKED_BACKEND_HOST}/{MOCKED_URL_TOKEN}",
        method="GET",
        text="Mocked response",
    )
    # act:
    response = client.get(f"/internal/proxy/cada-prio/{MOCKED_URL_TOKEN}")
    # assert:
    assert response.status_code == 200
    assert response.text == "Mocked response"


@pytest.mark.anyio
async def test_invalid_proxy_route(client: TestClient):
    """Test invalid proxy route."""
    # act:
    response = client.get("/internal/proxy/some-other-path")
    # assert:
    assert response.status_code == 404
    assert response.text == "Reverse proxy route not found"
