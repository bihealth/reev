import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings


@pytest.mark.anyio
async def test_adminmsgs_list(db_session: AsyncSession, client: TestClient):
    """Test proxying to annonars backend."""
    _ = db_session  # via ``get_db()`` dependency injection
    # act:
    response = client.get(f"{settings.API_V1_STR}/adminmsgs/")
    # assert:
    assert response.status_code == 200
    assert response.json() == []
