from typing import Any, Dict, Optional, Tuple

from fastapi import APIRouter
from httpx_oauth.clients.openid import OpenID
from httpx_oauth.errors import GetIdEmailError

from app.api.api_v1.endpoints import (
    acmgseqvar,
    adminmsgs,
    auth,
    bookmarks,
    caseinfo,
    clinvarsub,
    utils,
)
from app.core.auth import auth_backend_bearer, auth_backend_cookie, fastapi_users
from app.core.config import settings
from app.schemas.user import UserRead, UserUpdate

api_router = APIRouter()
api_router.include_router(acmgseqvar.router, prefix="/acmgseqvar", tags=["acmgseqvar"])
api_router.include_router(adminmsgs.router, prefix="/adminmsgs", tags=["adminmsgs"])
api_router.include_router(bookmarks.router, prefix="/bookmarks", tags=["bookmarks"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(caseinfo.router, prefix="/caseinfo", tags=["caseinfo"])
api_router.include_router(clinvarsub.router, prefix="/clinvarsub", tags=["clinvarsub"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

api_router.include_router(
    fastapi_users.get_auth_router(auth_backend_bearer), prefix="/auth/bearer", tags=["auth"]
)
api_router.include_router(
    fastapi_users.get_auth_router(auth_backend_cookie), prefix="/auth/cookie", tags=["auth"]
)
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
api_router.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)
api_router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)

#: Base scopes for OrcID authentication.
BASE_SCOPES = ["openid", "/read-limited"]


class OrcidOpenId(OpenID):
    """
    Custom OrcID OpenID client that fetches the user's email from the OrcID API.
    Note that users must have given access to their email address for "trusted parties".

    :param client_id: client ID
    :type client_id: str
    :param client_secret: client secret
    :type client_secret: str
    :param openid_configuration_endpoint: OpenID configuration endpoint
    :type openid_configuration_endpoint: str
    :param name: name of the provider
    :type name: str
    :param base_scopes: base scopes
    :type base_scopes: list, optional
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

    # Note: It is OK to not epect coverage here as this integrates with upstream API.
    async def get_id_email(self, token: str) -> Tuple[str, Optional[str]]:  # pragma: no cover
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
                f"https://api.orcid.org/v3.0/{data_user['sub']}/record",
                headers={**self.request_headers, "Authorization": f"Bearer {token}"},
            )
            if response_user.status_code >= 400:
                raise GetIdEmailError(response_user.json())
            data_record: Dict[str, Any] = response_record.json()

            # Try to get email from person if "trusted parties" are allowed
            # to do so.  Otherwise, put a placeholder email.
            data_record_emails = data_record.get("person", {}).get("emails", {}).get("email", [])
            if data_record_emails:
                email = data_record_emails[0].get("email", None)
            else:
                email = f"needs-update-{data_user['sub']}@orcid.example.org"

            return str(data_user["sub"]), email


# For now, we only provide oauth clients for cookie-based authentication.
for config in settings.OAUTH2_PROVIDERS:
    if config.name == "orcid":
        oauth_client: OpenID = OrcidOpenId(
            client_id=config.client_id,
            client_secret=config.client_secret,
            openid_configuration_endpoint=str(config.config_url),
            name=config.name,
            base_scopes=["openid", "/read-limited"],
        )
    else:
        oauth_client = OpenID(
            client_id=config.client_id,
            client_secret=config.client_secret,
            openid_configuration_endpoint=str(config.config_url),
            name=config.name,
        )
    # Add route for authentication via OAuth2 endpoint.
    oauth_router = fastapi_users.get_oauth_router(
        oauth_client=oauth_client,
        backend=auth_backend_cookie,
        state_secret=settings.SECRET_KEY,
    )
    api_router.include_router(
        oauth_router,
        prefix=f"/auth/external/cookie/{config.name}",
        tags=["auth"],
    )
    # Add route for associating OAuth2 account with existing user.
    oauth_associate_router = fastapi_users.get_oauth_associate_router(
        oauth_client=oauth_client,
        user_schema=UserRead,
        state_secret=settings.SECRET_KEY,
        redirect_url="/",
    )
    api_router.include_router(
        oauth_associate_router,
        prefix=f"/auth/external/associate/cookie/{config.name}",
        tags=["auth"],
    )
