from fastapi import APIRouter
from httpx_oauth.clients.openid import OpenID

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

# For now, we only provide oauth clients for cookie-based authentication.
for config in settings.OAUTH2_PROVIDERS:
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
