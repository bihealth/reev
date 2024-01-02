import logging
import os
import pathlib
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi_pagination import add_pagination
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse

from app.api.api_v1.api import api_router as api_v1_router
from app.api.internal.api import api_router as internal_router
from app.api.internal.endpoints.remote import httpx_client_wrapper
from app.core.config import settings
from app.db.init_db import create_superuser

if settings.DEBUG:
    logging.basicConfig(level=logging.DEBUG)

logger = logging.getLogger(__name__)

# Suppress logging to suppress "(trapped) error reading bcrypt version"
# warning in passlib.
logging.getLogger("passlib.handlers.bcrypt").setLevel(logging.ERROR)

if settings.SENTRY_DSN:  # pragma: no cover
    sentry_sdk.init(
        environment=os.environ.get("ENVIRONMENT", "production"),
        release=f"reev-backend@{settings.REEV_VERSION}",
        dsn=str(settings.SENTRY_DSN),
        enable_tracing=True,
        traces_sample_rate=1.0,
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    httpx_client_wrapper.start()
    yield
    await httpx_client_wrapper.stop()


app = FastAPI(
    title="REEV",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    lifespan=lifespan,
    debug=settings.DEBUG,
)

if settings.SENTRY_DSN and settings.DEBUG:  # pragma: no cover

    @app.get("/sentry-debug")
    async def trigger_error():
        division_by_zero = 1 / 0


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

# Enable pagination with fastapi-pagination after all router includes.
add_pagination(app)


@asynccontextmanager
async def create_superuser_on_startup():
    await create_superuser()
    yield


@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    """Serve favicon"""
    return FileResponse(pathlib.Path(__file__).parent / "assets/favicon.ico")


if settings.SERVE_FRONTEND:  # pragma: no cover
    logging.info(f"serving front-end from {settings.SERVE_FRONTEND}")
    app.mount("/assets", StaticFiles(directory=f"{settings.SERVE_FRONTEND}/assets"), name="ui")

    @app.get("/")
    async def index():
        """Render the index.html page at the root URL"""
        return FileResponse(f"{settings.SERVE_FRONTEND}/index.html")

    @app.api_route("/{path_name:path}", methods=["GET"])
    async def catch_all(request: Request, path_name: str):
        """Catch-all route forwarding to frontend."""
        _, _ = request, path_name
        return FileResponse(f"{settings.SERVE_FRONTEND}/index.html")
