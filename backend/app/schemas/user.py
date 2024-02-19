import typing
import uuid

import pydantic
from fastapi_users import models, schemas


class PublicOAuthAccount(pydantic.BaseModel, typing.Generic[models.ID]):
    """Public part of OAuth account model."""

    id: models.ID
    oauth_name: str
    account_id: str
    account_email: str

    model_config = pydantic.ConfigDict(from_attributes=True)


class UserRead(schemas.BaseUser[uuid.UUID]):
    """Model to use for reading users.

    We expose the public OAuth account information.
    """

    oauth_accounts: typing.List[PublicOAuthAccount] = []


class UserCreate(schemas.BaseUserCreate):
    pass


class UserUpdate(schemas.BaseUserUpdate):
    """Model to use for updateing users.

    We expose the public OAuth account information.
    """

    oauth_accounts: typing.List[PublicOAuthAccount] = []
