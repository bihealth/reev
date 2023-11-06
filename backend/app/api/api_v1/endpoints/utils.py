from typing import Any

from fastapi import APIRouter, Depends
from pydantic.networks import EmailStr

from app import models, schemas
from app.api import deps
from app.app.utils import send_test_email
from app.core import auth

router = APIRouter()

current_active_superuser = auth.fastapi_users.current_user(active=True, superuser=True)


@router.post("/test-email/", response_model=schemas.Msg, status_code=201)
def test_email(
    email_to: EmailStr,
    current_user: models.User = Depends(current_active_superuser),
) -> Any:
    """Send out a test email."""
    send_test_email(email_to=email_to)
    return {"msg": "Test email sent"}