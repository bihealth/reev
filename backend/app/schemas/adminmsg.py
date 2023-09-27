import datetime
from uuid import UUID

from pydantic import BaseModel


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
    id: int
    uuid: UUID

    class Config:
        from_attributes = True


class AdminMessage(AdminMessageInDbBase):
    pass


class AdminMessageInDb(AdminMessageInDbBase):
    pass
