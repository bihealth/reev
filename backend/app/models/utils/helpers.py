from typing import Any, TypeVar

from app.db.session import Base

ModelType = TypeVar("ModelType", bound=Base)


def sa_model_to_dict(db_obj: ModelType) -> dict[str, Any]:
    """Convert database model to dict."""
    result = dict(db_obj.__dict__)
    result.pop("_sa_instance_state")
    return result
