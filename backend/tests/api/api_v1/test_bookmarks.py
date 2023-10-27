import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings

# @pytest.mark.asyncio
# async def test_bookmarks_create(db_session: AsyncSession, client: TestClient()):
#     """Test proxying to annonars backend."""
#     _ = db_session
#     response = client.post(
#         f"{settings.API_V1_STR}/bookmarks/create",
#         json={
#             "obj_type": "gene",
#             "obj_id": "string",
#             "user": "string",
#         },
#     )
#     assert response.status_code == 200
#     assert response.json() == {
#         "obj_type": "gene",
#         "obj_id": "string",
#         "user": "string",
#     }
