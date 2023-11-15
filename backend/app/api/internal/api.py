import subprocess

from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse

from app.api.internal.endpoints import proxy, remote
from app.core.config import settings

api_router = APIRouter()

api_router.include_router(proxy.router, prefix="/proxy", tags=["proxy"])
api_router.include_router(remote.router, prefix="/remote", tags=["remote"])


@api_router.get("/version")
@api_router.post("/version")
async def version():
    """
    Return reev version.

    :return: reev version
    :rtype: str
    """
    if settings.REEV_VERSION:
        version = settings.REEV_VERSION
    else:
        version = subprocess.check_output(["git", "describe", "--tags", "--dirty"]).strip()
    return Response(content=version)


@api_router.get("/frontend-settings")
@api_router.post("/frontend-settings")
async def matomo():
    """
    Return frontend settings.

    :return: frontend settings
    :rtype: dict
    """
    frontend_settings = {
        "matomo_host": settings.MATOMO_HOST,
        "matomo_site_id": settings.MATOMO_SITE_ID,
    }
    return JSONResponse(content=frontend_settings)
