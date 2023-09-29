import pytest
from fastapi.testclient import TestClient
from pytest_httpx._httpx_mock import HTTPXMock

from app.api.internal.endpoints.remote import default_acmg_rating

#: Host name to use for the mocked backend.
MOCKED_BACKEND_HOST = "mocked-backend"

#: A "token" to be used in test URLs, does not carry a meaning as it is mocked.
MOCKED_URL_TOKEN = "xXTeStXxx"


@pytest.mark.asyncio
async def test_variantvalidator(httpx_mock: HTTPXMock, client: TestClient):
    """Test variant validator endpoint."""
    variantvalidator_url = "https://rest.variantvalidator.org/VariantValidator/variantvalidator"
    httpx_mock.add_response(
        url=f"{variantvalidator_url}/{MOCKED_URL_TOKEN}",
        method="GET",
        text="Mocked response",
    )

    response = client.get(f"/internal/remote/variantvalidator/{MOCKED_URL_TOKEN}")
    assert response.status_code == 200
    assert response.text == "Mocked response"


@pytest.mark.asyncio
async def test_acmg(httpx_mock: HTTPXMock, client: TestClient):
    """Test ACMG endpoint."""
    acmg_url = "http://wintervar.wglab.org/api_new.php"
    acmg_qury_params = "?chromosome=1&position=123&reference=A&alternative=T&release=hg19"
    httpx_mock.add_response(
        url=f"{acmg_url}?queryType=position&chr=1&pos=123&ref=A&alt=T&build=hg19",
        method="GET",
        json={"acmg": "Mocked response"},
    )

    response = client.get(f"/internal/remote/acmg/{acmg_qury_params}")
    assert response.status_code == 200
    assert response.json() == default_acmg_rating()


@pytest.mark.asyncio
async def test_acmg_missing_query_params(client: TestClient):
    """Test ACMG endpoint with missing query parameters."""
    response = client.get("/internal/remote/acmg")
    assert response.status_code == 400
    assert response.text == "Missing query parameters"
