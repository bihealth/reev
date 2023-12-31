import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.user import User
from tests.conftest import UserChoice

#: Shortcut for regular user.
REGUL = UserChoice.REGULAR
#: Shortcut for superuser.
SUPER = UserChoice.SUPERUSER


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(REGUL, REGUL)], indirect=True)
async def test_test_email(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test sending an email as regular user."""
    # arrange:
    _ = db_session
    email_to = "test1@example.com"
    # act:
    response = client_user.post(
        f"{settings.API_V1_STR}/utils/test-email?email_to={email_to}",
    )
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_test_email_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    monkeypatch,
):
    """Test sending an email as superuser."""
    # arrange:
    # Mock out the send_test_email function
    monkeypatch.setattr("app.api.api_v1.endpoints.utils.send_test_email", lambda email_to: None)
    _ = db_session
    email_to = "test1@example.com"
    # act:
    response = client_user.post(
        f"{settings.API_V1_STR}/utils/test-email?email_to={email_to}",
    )
    # assert:
    assert response.status_code == 201
    assert response.json() == {"msg": "Test email sent"}


@pytest.mark.anyio
async def test_test_email_anon(db_session: AsyncSession, client: TestClient):
    """Test sending an email as anonymous user."""
    # arrange:
    _ = db_session
    email_to = "test1@example.com"
    # act:
    response = client.post(
        f"{settings.API_V1_STR}/utils/test-email?email_to={email_to}",
    )
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}
