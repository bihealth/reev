from typing import Any, Dict, Optional, Tuple

from fastapi import APIRouter
from httpx_oauth.clients.openid import OpenID
from httpx_oauth.errors import GetIdEmailError
from httpx_oauth.oauth2 import BaseOAuth2, OAuth2Error

from app.api.api_v1.endpoints import adminmsgs, auth
from app.core.auth import auth_backend_bearer, auth_backend_cookie, fastapi_users
from app.core.config import settings
from app.schemas.user import UserRead, UserUpdate

api_router = APIRouter()
api_router.include_router(adminmsgs.router, prefix="/adminmsgs", tags=["adminmsgs"])

api_router.include_router(
    fastapi_users.get_auth_router(auth_backend_bearer), prefix="/auth/bearer", tags=["auth"]
)
api_router.include_router(
    fastapi_users.get_auth_router(auth_backend_cookie), prefix="/auth/cookie", tags=["auth"]
)
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# api_router.include_router(
#     fastapi_users.get_register_router(UserRead, UserCreate),
#     prefix="/auth",
#     tags=["auth"],
# )
# api_router.include_router(
#     fastapi_users.get_reset_password_router(),
#     prefix="/auth",
#     tags=["auth"],
# )
# api_router.include_router(
#     fastapi_users.get_verify_router(UserRead),
#     prefix="/auth",
#     tags=["auth"],
# )
api_router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)

#: Base scopes for OrcID authentication.
BASE_SCOPES = ["openid", "/read-limited"]


class OrcidOpenId(OpenID):
    """Custom OrcID OpenID client that fetches the user's email from the OrcID API.

    Note that users must have given access to their email address for "trusted parties".
    """

    def __init__(
        self,
        client_id: str,
        client_secret: str,
        openid_configuration_endpoint: str,
        name: str = "orcid",
        base_scopes: list[str] | None = BASE_SCOPES,
    ):
        super().__init__(
            client_id,
            client_secret,
            openid_configuration_endpoint,
            name=name,
            base_scopes=base_scopes,
        )

    async def get_id_email(self, token: str) -> Tuple[str, Optional[str]]:
        """Custom implementation that returns the user ID and email."""
        async with self.get_httpx_client() as client:
            response_user = await client.get(
                self.openid_configuration["userinfo_endpoint"],
                headers={**self.request_headers, "Authorization": f"Bearer {token}"},
            )

            if response_user.status_code >= 400:
                raise GetIdEmailError(response_user.json())
            data_user: Dict[str, Any] = response_user.json()

            response_record = await client.get(
                f"https://api.sandbox.orcid.org/v3.0/{data_user['sub']}/record",
                headers={**self.request_headers, "Authorization": f"Bearer {token}"},
            )
            if response_user.status_code >= 400:
                raise GetIdEmailError(response_user.json())
            data_record: Dict[str, Any] = response_record.json()

            data_record_emails = data_record.get("person", {}).get("emails", {}).get("email", [])
            if data_record_emails:
                email = data_record_emails[0].get("email", None)
            else:
                email = None

            return str(data_user["sub"]), email


# For now, we only provide oauth clients for cookie-based authentication.
for config in settings.OAUTH2_PROVIDERS:
    if config.name == "orcid":
        oauth_client = OrcidOpenId(
            client_id=config.client_id,
            client_secret=config.client_secret,
            openid_configuration_endpoint=str(config.config_url),
            base_scopes=["openid", "/read-limited"],
        )
    else:
        oauth_client = OpenID(
            client_id=config.client_id,
            client_secret=config.client_secret,
            openid_configuration_endpoint=str(config.config_url),
        )
    oauth_router = fastapi_users.get_oauth_router(
        oauth_client=oauth_client,
        backend=auth_backend_cookie,
        state_secret=settings.SECRET_KEY,
        associate_by_email=True,
        is_verified_by_default=True,
    )
    api_router.include_router(
        oauth_router,
        prefix=f"/auth/external/cookie/{config.name}",
        tags=["auth"],
    )
