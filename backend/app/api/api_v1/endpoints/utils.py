from typing import Any

from fastapi import APIRouter, Depends
from pydantic.networks import EmailStr

from app import schemas
from app.api.deps import current_active_superuser
from app.app.utils import send_test_email

router = APIRouter()


@router.post(
    "/test-email/",
    response_model=schemas.Msg,
    status_code=201,
    dependencies=[Depends(current_active_superuser)],
)
def test_email(email_to: EmailStr) -> Any:
    """Send out a test email."""
    send_test_email(email_to=email_to)
    return {"msg": "Test email sent"}
