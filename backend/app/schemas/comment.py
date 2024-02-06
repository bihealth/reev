import re
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, model_validator

from app.schemas import common
from app.schemas.common import CommentableId


class CommentTypes(Enum):
    seqvar = "seqvar"
    strucvar = "strucvar"
    gene = "gene"


class CommentBase(BaseModel):
    user: UUID | None = None
    obj_type: CommentTypes
    obj_id: CommentableId
    text: str
    public: bool = True

    @model_validator(mode="after")
    def check_obj_type_id(self):
        if self.obj_type == CommentTypes.seqvar:
            assert re.match(common.RE_SEQVAR, self.obj_id), "obj_id is not a valid seqvar"
        elif self.obj_type == CommentTypes.strucvar:
            assert re.match(common.RE_STRUCVAR, self.obj_id), "obj_id is not a valid strucvar"
        elif self.obj_type == CommentTypes.gene:
            assert re.match(common.RE_HGNCID, self.obj_id), "obj_id is not a valid HGNC ID"
        else:
            assert False, "unknown obj_type"
        return self


class CommentCreate(CommentBase):
    pass


class CommentUpdate(CommentBase):
    pass


class CommentInDbBase(CommentBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID


class CommentRead(CommentInDbBase):
    pass


class CommentInDb(CommentInDbBase):
    pass
