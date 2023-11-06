import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings

# @pytest.mark.asyncio
# async def test_utils_email(db_session: AsyncSession, client: TestClient):
#     """Test sending a test email."""
#     _ = db_session
#     response = client.post(
#         f"{settings.API_V1_STR}/utils/test-email/",
#         json={"email_to": "example@ex.com"},
#     )
#     assert response.status_code == 200
#     assert response.json() == {"msg": "Test email sent"}
