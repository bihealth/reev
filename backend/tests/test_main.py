import pytest
from app.main import app, reverse_proxy
from fastapi.testclient import TestClient
from httpx import AsyncClient, Response

client = TestClient(app)

# Define mock backend URLs
BACKEND_PREFIX_ANNONARS = "http://mock-backend-annonars.com"
BACKEND_PREFIX_MEHARI = "http://mock-backend-mehari.com"
BACKEND_PREFIX_VIGUNO = "http://mock-backend-viguno.com"


# Define test cases
@pytest.mark.asyncio
async def test_reverse_proxy_annonars():
    # Mock backend response
    async def mock_backend_response(request, *args, **kwargs):
        return Response(200, content="Mock backend response")

    # Test reverse proxy route
    async with AsyncClient(app=app, base_url="http://test") as ac:
        app.dependency_overrides[client] = mock_backend_response
        response = await ac.get("/proxy/annonars?param1=value1&param2=value2")
        assert response.status_code == 200
        assert response.content == b"Mock backend response"


@pytest.mark.asyncio
async def test_reverse_proxy_mehari():
    # Mock backend response
    async def mock_backend_response(request, *args, **kwargs):
        return Response(200, content="Mock backend response")

    # Test reverse proxy route
    async with AsyncClient(app=app, base_url="http://test") as ac:
        app.dependency_overrides[client] = mock_backend_response
        response = await ac.post("/proxy/mehari?param1=value1&param2=value2")
        assert response.status_code == 200
        assert response.content == b"Mock backend response"


@pytest.mark.asyncio
async def test_reverse_proxy_viguno():
    # Mock backend response
    async def mock_backend_response(request, *args, **kwargs):
        return Response(200, content="Mock backend response")

    # Test reverse proxy route
    async with AsyncClient(app=app, base_url="http://test") as ac:
        app.dependency_overrides[client] = mock_backend_response
        response = await ac.get("/proxy/viguno")
        assert response.status_code == 200
        assert response.content == b"Mock backend response"


@pytest.mark.asyncio
async def test_reverse_proxy_not_found():
    # Test reverse proxy route
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/proxy/invalid")
        assert response.status_code == 404
        assert response.content == b"Reverse proxy route not found"
