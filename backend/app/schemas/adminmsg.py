import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class AdminMessageBase(BaseModel):
    title: str | None = None
    text: str | None = None
    active_start: datetime.datetime | None = None
    active_stop: datetime.datetime | None = None
    enabled: bool | None = None


class AdminMessageCreate(AdminMessageBase):
    pass


class AdminMessageUpdate(AdminMessageBase):
    pass


class AdminMessageInDbBase(AdminMessageBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID


class AdminMessageRead(AdminMessageInDbBase):
    pass


class AdminMessageInDb(AdminMessageInDbBase):
    pass
