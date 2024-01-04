import re
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, model_validator

from app.schemas import common
from app.schemas.common import BookmarkableId


class BookmarkTypes(Enum):
    seqvar = "seqvar"
    strucvar = "strucvar"
    gene = "gene"


class BookmarkBase(BaseModel):
    user: UUID | None = None
    obj_type: BookmarkTypes
    obj_id: BookmarkableId

    @model_validator(mode="after")
    def check_obj_type_id(self):
        if self.obj_type == BookmarkTypes.seqvar:
            assert re.match(common.RE_SEQVAR, self.obj_id), "obj_id is not a valid seqvar"
        elif self.obj_type == BookmarkTypes.strucvar:
            assert re.match(common.RE_STRUCVAR, self.obj_id), "obj_id is not a valid strucvar"
        elif self.obj_type == BookmarkTypes.gene:
            assert re.match(common.RE_HGNCID, self.obj_id), "obj_id is not a valid HGNC ID"
        else:
            assert False, "unknown obj_type"
        return self


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
