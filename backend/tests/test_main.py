import subprocess
import typing

import pytest
from app import main
from starlette.testclient import TestClient

#: Host name to use for the mocked backend.
MOCKED_BACKEND_HOST = "mocked-backend"

#: A "token" to be used in test URLs, does not carry a meaning as it is mocked.
MOCKED_URL_TOKEN = "xXTeStXxx"

#: FastAPI/startlette test client.
client = TestClient(main.app)


@pytest.fixture
def non_mocked_hosts() -> typing.List[str]:
    """List of hosts that should not be mocked.

    We read the host from ``client``.
    """
    return [client._base_url.host]


@pytest.mark.asyncio
async def test_proxy_annonars(monkeypatch, httpx_mock):
    """Test proxying to annonars backend."""
    monkeypatch.setattr(main, "BACKEND_PREFIX_ANNONARS", f"http://{MOCKED_BACKEND_HOST}")
    httpx_mock.add_response(
        url=f"http://{MOCKED_BACKEND_HOST}/{MOCKED_URL_TOKEN}",
        method="GET",
        text="Mocked response",
    )

    response = client.get(f"/proxy/annonars/{MOCKED_URL_TOKEN}")
    assert response.status_code == 200
    assert response.text == "Mocked response"


@pytest.mark.asyncio
async def test_proxy_mehari(monkeypatch, httpx_mock):
    """Test proxying to mehari backend."""
    monkeypatch.setattr(main, "BACKEND_PREFIX_MEHARI", f"http://{MOCKED_BACKEND_HOST}")
    httpx_mock.add_response(
        url=f"http://{MOCKED_BACKEND_HOST}/{MOCKED_URL_TOKEN}",
        method="GET",
        text="Mocked response",
    )

    response = client.get(f"/proxy/mehari/{MOCKED_URL_TOKEN}")
    assert response.status_code == 200
    assert response.text == "Mocked response"


@pytest.mark.asyncio
async def test_proxy_viguno(monkeypatch, httpx_mock):
    """Test proxying to viguno backend."""
    monkeypatch.setattr(main, "BACKEND_PREFIX_VIGUNO", f"http://{MOCKED_BACKEND_HOST}")
    httpx_mock.add_response(
        url=f"http://{MOCKED_BACKEND_HOST}/{MOCKED_URL_TOKEN}",
        method="GET",
        text="Mocked response",
    )

    response = client.get(f"/proxy/viguno/{MOCKED_URL_TOKEN}")
    assert response.status_code == 200
    assert response.text == "Mocked response"


@pytest.mark.asyncio
async def test_invalid_proxy_route(monkeypatch, httpx_mock):
    """Test invalid proxy route."""
    response = client.get("/proxy/some-other-path")
    assert response.status_code == 404
    assert response.text == "Reverse proxy route not found"


@pytest.mark.asyncio
async def test_version(monkeypatch):
    """Test version endpoint."""
    monkeypatch.setattr(main, "REEV_VERSION", "1.2.3")
    response = client.get("/version")
    assert response.status_code == 200
    assert response.text == "1.2.3"


@pytest.mark.asyncio
async def test_version_no_version(monkeypatch, fp):
    """Test version endpoint with no version."""
    monkeypatch.setattr(main, "REEV_VERSION", None)
    # We mock the output of ``git describe`` as subprocesses will be triggered
    # internally.
    fp.register(["git", "describe", "--tags", "--dirty"], stdout="v0.0.0-16-g7a4205d-dirty")
    response = client.get("/version")

    assert response.status_code == 200
    assert response.text == "v0.0.0-16-g7a4205d-dirty"


@pytest.mark.asyncio
async def test_variantvalidator(monkeypatch, httpx_mock):
    """Test variant validator endpoint."""
    variantvalidator_url = "https://rest.variantvalidator.org/VariantValidator/variantvalidator"
    httpx_mock.add_response(
        url=f"{variantvalidator_url}/{MOCKED_URL_TOKEN}",
        method="GET",
        text="Mocked response",
    )

    response = client.get(f"/variantvalidator/{MOCKED_URL_TOKEN}")
    assert response.status_code == 200
    assert response.text == "Mocked response"


@pytest.mark.asyncio
async def test_favicon():
    """Test favicon endpoint."""
    response = client.get("/favicon.ico")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/vnd.microsoft.icon"
