from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class BookmarkTypes(Enum):
    seqvar = "seqvar"
    strucvar = "strucvar"
    gene = "gene"


class BookmarkBase(BaseModel):
    user: str | None = None
    obj_type: BookmarkTypes | None = None
    obj_id: str | None = None


class BookmarkCreate(BookmarkBase):
    pass


class BookmarkUpdate(BookmarkBase):
    pass


class BookmarkInDbBase(BookmarkBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID


class BookmarkRead(BookmarkInDbBase):
    pass


class BookmarkInDb(BookmarkInDbBase):
    pass