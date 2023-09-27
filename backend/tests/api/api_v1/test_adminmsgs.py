import pytest
from app.core.config import settings
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session


@pytest.mark.asyncio
async def test_adminmsgs_list(db: Session, client: TestClient):
    """Test proxying to annonars backend."""
    response = client.get(f"{settings.API_V1_STR}/adminmsgs/")
    assert response.status_code == 200
    assert response.json() == []
