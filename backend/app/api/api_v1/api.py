from fastapi import APIRouter

from app.api.api_v1.endpoints import adminmsgs
from app.core.auth import auth_backend_bearer, auth_backend_cookie, fastapi_users
from app.schemas.user import UserCreate, UserRead, UserUpdate

api_router = APIRouter()
api_router.include_router(adminmsgs.router, prefix="/adminmsgs", tags=["adminmsgs"])

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
