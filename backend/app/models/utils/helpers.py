import json
from typing import Any, TypeVar

import sqlalchemy as sa
from fastapi.encoders import jsonable_encoder
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

    source: https://roman.pt/posts/pydantic-in-sqlalchemy-fields/
    """

    # We implement ``load_dialect_impl`` to and use ``TypeEngine`` here as
    # a placeholder as suggested io the SQLAlchemy docs.
    impl = sa.types.TypeEngine

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
        return jsonable_encoder(value) if value else None

    def process_result_value(self, value, dialect):
        _ = dialect
        return self.pydantic_type.model_validate_obj(self.pydantic_type, value) if value else None
