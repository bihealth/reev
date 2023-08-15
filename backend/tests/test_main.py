import pytest
from app.main import app
from requests_mock import Mocker
from starlette.testclient import TestClient

client = TestClient(app)


@pytest.fixture
def mock_get():
    with Mocker() as m:
        yield m.get


def test_proxy_annonars(mock_get, monkeypatch):
    monkeypatch.setenv("REEV_BACKEND_PREFIX_ANNONARS", "http://mocked-backend")

    mock_get("http://mocked-backend/annos/some-resource", text="Mocked response")
    response = client.get("/proxy/annonars/some-resource")
    assert response.status_code == 404


def test_proxy_mehari(mock_get, monkeypatch):
    monkeypatch.setenv("REEV_BACKEND_PREFIX_MEHARI", "http://mocked-backend")

    mock_get("http://mocked-backend/some-resource", text="Mocked response")
    response = client.get("/proxy/mehari/some-resource")
    assert response.status_code == 404


def test_proxy_viguno(mock_get, monkeypatch):
    monkeypatch.setenv("REEV_BACKEND_PREFIX_VIGUNO", "http://mocked-backend")

    mock_get("http://mocked-backend/some-resource", text="Mocked response")
    response = client.get("/proxy/viguno/some-resource")
    assert response.status_code == 404


def test_invalid_proxy_route():
    response = client.get("/proxy/some-other-path")
    assert response.status_code == 404
    assert response.content == b"Reverse proxy route not found"
