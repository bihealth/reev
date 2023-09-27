import subprocess

from app.api.internal.endpoints import proxy, remote
from app.core.config import settings
from fastapi import APIRouter, Response

api_router = APIRouter()

api_router.include_router(proxy.router, prefix="/proxy", tags=["proxy"])
api_router.include_router(remote.router, prefix="/remote", tags=["remote"])


@api_router.get("/version")
async def version():
    """Return REEV software version"""
    if settings.REEV_VERSION:
        version = settings.REEV_VERSION
    else:
        version = subprocess.check_output(["git", "describe", "--tags", "--dirty"]).strip()
    return Response(content=version)