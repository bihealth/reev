from typing import Any

from app.crud.base import CrudBase
from app.models.adminmsg import AdminMessage
from app.schemas.adminmsg import AdminMessageCreate, AdminMessageUpdate

adminmessage = CrudBase[AdminMessage, AdminMessageCreate, AdminMessageUpdate](AdminMessage)
