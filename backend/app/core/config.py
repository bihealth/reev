import logging
import os
import secrets
from typing import Any
import typing

from pydantic import AnyHttpUrl, EmailStr, HttpUrl, PostgresDsn, field_validator
from pydantic_core.core_schema import ValidationInfo
from pydantic_settings import BaseSettings, SettingsConfigDict

from app.schemas import OAuth2ProviderConfig

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True
    )

    # -- app-specific settings -----------------------------------------------

    # == deployment-related settings ==

    #: Enable debug mode (makes all APIs appear in openapi.json)
    DEBUG: bool = False
    #: Project name
    PROJECT_NAME: str = "REEV"
    #: Path to frontend build, if any.
    SERVE_FRONTEND: str | None = ""
    #: Path to REEV version file.
    VERSION_FILE: str = "/VERSION"
    #: The REEV version from the file (``None`` if to load dynamically from git)
    REEV_VERSION: str | None = None

    @field_validator("REEV_VERSION", mode="before")
    def assemble_reev_version(cls, v: str | None, info: ValidationInfo) -> str | None:
        if isinstance(v, str):  # pragma: no cover
            return v
        version_file: str | None = info.data.get("VERSION_FILE")
        if version_file and os.path.exists(version_file):  # pragma: no cover
            with open(version_file, "rt") as f:
                return f.read().strip() or None
        else:
            return None

    #: Matomo host
    MATOMO_HOST: str | None = None
    #: Matomo site ID
    MATOMO_SITE_ID: int | None = None

    # == API-related settings ==

    #: URL prefix for internal API
    INTERNAL_STR: str = "/internal"
    #: URL prefix for V1 URLs
    API_V1_STR: str = "/api/v1"

    # == security-related settings ==

    #: Secret key
    SECRET_KEY: str = secrets.token_urlsafe(32)
    #: Expiration of cookies.
    SESSION_EXPIRE_MINUTES: int = 60 * 24 * 8
    #: Expiry of access token (60 minutes * 24 hours * 8 days = 8 days)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    #: Server hostname
    SERVER_NAME: str = "localhost"
    #: HTTP to server
    SERVER_HOST: AnyHttpUrl | str = "http://localhost:8080"
    #: BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    #: e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000", \
    #: "http://localhost:8080", "http://local.dockertoolbox.tiangolo.com"]'
    BACKEND_CORS_ORIGINS: list[AnyHttpUrl | str] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str] | str:  # pragma: no cover
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # == backend-related settings (defaults for production) ==

    #: Prefix for the backend of annonars service.
    BACKEND_PREFIX_ANNONARS: str = "http://annonars:8080"
    #: Prefix for the backend of mehari service.
    BACKEND_PREFIX_MEHARI: str = "http://mehari:8080"
    #: Prefix for the backend of viguno service.
    BACKEND_PREFIX_VIGUNO: str = "http://viguno:8080"
    #: Prefix for the backend of nginx service.
    BACKEND_PREFIX_NGINX: str = "http://nginx:80"
    #: Prefix for the backend of dotty service.
    BACKEND_PREFIX_DOTTY: str = "http://dotty:8080"

    #: URL to REDIS service.
    REDIS_URL: str = "redis://redis:6379"

    # -- User-Related Configuration ---------------------------------------------

    #: Superuser email, created on startup.
    FIRST_SUPERUSER_EMAIL: EmailStr | None = None
    #: Superuser password, created on startup.
    FIRST_SUPERUSER_PASSWORD: str | None = None
    #: Whether to allow open registration of new users.
    USERS_OPEN_REGISTRATION: bool = False
    #: Email of test users, ignored.
    EMAIL_TEST_USER: EmailStr = "test@example.com"  # type: ignore

    #: OAuth2 providers
    OAUTH2_PROVIDERS: list[OAuth2ProviderConfig] = []

    # -- Database Configuration ----------------------------------------------

    # Note that when os.environ["CI"] is "true" then we will use an in-memory
    # sqlite database (test use only).

    #: Postgres hostname
    POSTGRES_HOST: str = "postgres"
    #: Postgres port
    POSTGRES_PORT: int = 5432
    #: Postgres user
    POSTGRES_USER: str = "reev"
    #: Postgres password file
    POSTGRES_PASSWORD_FILE: str | None = None
    #: Postgres password
    POSTGRES_PASSWORD: str | None = None
    #: Postgres database name
    POSTGRES_DB: str = "reev"
    #: SQLAlchemy Postgres DSN
    SQLALCHEMY_DATABASE_URI: PostgresDsn | str | None = None

    @field_validator("SQLALCHEMY_DATABASE_URI", mode="before")
    def assemble_db_connection(cls, v: str | None, info: ValidationInfo) -> Any:
        if os.environ.get("CI") == "true":  # pragma: no cover
            return "sqlite+aiosqlite://"
        elif isinstance(v, str):  # pragma: no cover
            return v
        else:
            password_file = info.data.get("POSTGRES_PASSWORD_FILE")
            if password_file:
                logger.info(f"Reading password from {password_file}")
                with open(password_file, "rt") as inputf:
                    password = inputf.read().strip()
            else:
                password = None
            return PostgresDsn.build(
                scheme="postgresql+asyncpg",
                username=info.data.get("POSTGRES_USER"),
                password=info.data.get("POSTGRES_PASSWORD", password),
                host=info.data.get("POSTGRES_HOST"),
                port=info.data.get("POSTGRES_PORT"),
                path=f"{info.data.get('POSTGRES_DB') or ''}",
            )

    # -- Email Sending Configuration -----------------------------------------

    SMTP_TLS: bool = False
    SMTP_PORT: int | None = None
    SMTP_HOST: str | None = None
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    EMAILS_FROM_EMAIL: EmailStr | None = None
    EMAILS_FROM_NAME: str | None = None

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    EMAIL_TEMPLATES_DIR: str = "/app/app/email-templates/build"
    EMAILS_ENABLED: bool = False

    # -- Sentry Configuration ------------------------------------------------

    #: Sentry DSN
    SENTRY_DSN: HttpUrl | None = None

    @field_validator("SENTRY_DSN", mode="before")
    def sentry_dsn_can_be_blank(cls, v: str | None) -> str | None:  # pragma: no cover
        if not v:
            return None
        return v


settings = Settings(_env_file=".env", _env_file_encoding="utf-8")  # type: ignore[call-arg]
