import json
from typing import Any, TypeVar

import sqlalchemy as sa
from pydantic.json import pydantic_encoder
from sqlalchemy.dialects.postgresql import JSONB

from app.db.session import Base

ModelType = TypeVar("ModelType", bound=Base)


def sa_model_to_dict(db_obj: ModelType) -> dict[str, Any]:
    """Convert database model to dict."""
    result = dict(db_obj.__dict__)
    result.pop("_sa_instance_state")
    return result


class PydanticType(sa.types.TypeDecorator):
    """Pydantic type.
    SAVING:
    - Uses SQLAlchemy JSON type under the hood.
    - Acceps the pydantic model and converts it to a dict on save.
    - SQLAlchemy engine JSON-encodes the dict to a string.
    RETRIEVING:
    - Pulls the string from the database.
    - SQLAlchemy engine JSON-decodes the string to a dict.
    - Uses the dict to create a pydantic model.
    """

    # If you work with PostgreSQL, you can consider using
    # sqlalchemy.dialects.postgresql.JSONB instead of a
    # generic sa.types.JSON
    #
    # Ref: https://www.postgresql.org/docs/13/datatype-json.html
    impl = sa.types.JSON

    def __init__(self, pydantic_type):
        super().__init__()
        self.pydantic_type = pydantic_type

    def load_dialect_impl(self, dialect):
        # Use JSONB for PostgreSQL and JSON for other databases.
        if dialect.name == "postgresql":
            return dialect.type_descriptor(JSONB())
        else:
            return dialect.type_descriptor(sa.JSON())

    def process_bind_param(self, value, dialect):
        return value.dict() if value else None
        # If you use FasAPI, you can replace the line above with their jsonable_encoder().
        # E.g.,
        # from fastapi.encoders import jsonable_encoder
        # return jsonable_encoder(value) if value else None

    def process_result_value(self, value, dialect):
        _ = dialect
        return self.pydantic_type.model_validate_obj(self.pydantic_type, value) if value else None


def json_serializer(*args, **kwargs) -> str:
    return json.dumps(*args, default=pydantic_encoder, **kwargs)
