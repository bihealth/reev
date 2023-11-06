import logging
import pathlib

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse

from app.api.api_v1.api import api_router as api_v1_router
from app.api.internal.api import api_router as internal_router
from app.core.config import settings
from app.db.init_db import create_superuser

if settings.DEBUG:
    logging.basicConfig(level=logging.DEBUG)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="REEV",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    debug=settings.DEBUG,
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Add internal API to router but excluded from docs
app.include_router(internal_router, prefix=settings.INTERNAL_STR, include_in_schema=settings.DEBUG)
# Add V1 API to router
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


@app.on_event("startup")
async def create_superuser_on_startup():
    await create_superuser()


@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    """Serve favicon"""
    return FileResponse(pathlib.Path(__file__).parent / "assets/favicon.ico")
