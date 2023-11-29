from typing import Any

from fastapi import APIRouter, Depends
from pydantic.networks import EmailStr

from app import schemas
from app.api.deps import current_active_superuser
from app.db.init_db import init_db
from app.etc.utils import send_test_email

router = APIRouter()


@router.get("/init-db/", response_model=schemas.Msg, status_code=201)
async def init_db_command() -> Any:
    """
    Initialize the database.

    :return: message
    :rtype: dict
    """
    await init_db()
    return {"msg": "Database initialized"}


@router.post(
    "/test-email/",
    response_model=schemas.Msg,
    status_code=201,
    dependencies=[Depends(current_active_superuser)],
)
def test_email(email_to: EmailStr) -> Any:
    """
    Send out a test email.

    :param email_to: email address to send the test email to
    :type email_to: str
    :return: message
    :rtype: dict
    """
    send_test_email(email_to=email_to)
    return {"msg": "Test email sent"}
