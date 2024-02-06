import pytest
from fastapi.testclient import TestClient
from pytest_httpx._httpx_mock import HTTPXMock

from app.api.internal.endpoints.remote import default_acmg_rating

#: Host name to use for the mocked backend.
MOCKED_BACKEND_HOST = "mocked-backend"

#: A "token" to be used in test URLs, does not carry a meaning as it is mocked.
MOCKED_URL_TOKEN = "xXTeStXxx"


@pytest.mark.anyio
async def test_variantvalidator(httpx_mock: HTTPXMock, client: TestClient):
    """Test variant validator endpoint."""
    # arrange:
    variantvalidator_url = "https://rest.variantvalidator.org/VariantValidator/variantvalidator"
    httpx_mock.add_response(
        url=f"{variantvalidator_url}/{MOCKED_URL_TOKEN}",
        method="GET",
        text="Mocked response",
    )
    # act:
    response = client.get(f"/internal/remote/variantvalidator/{MOCKED_URL_TOKEN}")
    # assert:
    assert response.status_code == 200
    assert response.text == "Mocked response"


@pytest.mark.anyio
async def test_acmg(httpx_mock: HTTPXMock, client: TestClient):
    """Test ACMG endpoint."""
    # arrange:
    acmg_url = "http://wintervar.wglab.org/api_new.php"
    acmg_qury_params = "?chromosome=1&position=123&reference=A&alternative=T&release=hg19"
    httpx_mock.add_response(
        url=f"{acmg_url}?queryType=position&chr=1&pos=123&ref=A&alt=T&build=hg19",
        method="GET",
        json={"acmg": "Mocked response"},
    )
    # act:
    response = client.get(f"/internal/remote/acmg/{acmg_qury_params}")
    # assert:
    assert response.status_code == 200
    assert response.json() == default_acmg_rating()


@pytest.mark.anyio
async def test_acmg_missing_query_params(client: TestClient):
    """Test ACMG endpoint with missing query parameters."""
    # act:
    response = client.get("/internal/remote/acmg")
    # assert:
    assert response.status_code == 400
    assert response.text == "Missing query parameters"


@pytest.mark.anyio
async def test_cnv_acmg(httpx_mock: HTTPXMock, client: TestClient):
    """Test forwarding to AutoCNV API."""
    # arrange:
    httpx_mock.add_response(
        url="https://phoenix.bgi.com/api/acit/jobs/",
        method="POST",
        json={"res": "Mocked response"},
    )
    # act:
    response = client.get("/internal/remote/cnv/acmg/?chromosome=1&start=123&end=456&func=foo")
    # assert:
    assert response.status_code == 200
    assert response.json() == {"res": "Mocked response"}


@pytest.mark.anyio
async def test_pubtator3_api(httpx_mock: HTTPXMock, client: TestClient):
    """Test forwarding to PubTator 3 API."""
    # arrange:
    httpx_mock.add_response(
        url="https://www.ncbi.nlm.nih.gov/research/pubtator3-api/foo",
        method="GET",
        json={"res": "Mocked response"},
    )
    # act:
    response = client.get("/internal/remote/pubtator3-api/foo")
    # assert:
    assert response.status_code == 200
    assert response.json() == {"res": "Mocked response"}
