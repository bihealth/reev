import os
import secrets
from typing import Any

from pydantic import AnyHttpUrl, EmailStr, HttpUrl, PostgresDsn, field_validator
from pydantic_core.core_schema import ValidationInfo
from pydantic_settings import BaseSettings, SettingsConfigDict


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

    # == API-related settings ==

    #: URL prefix for internal API
    INTERNAL_STR: str = "/internal"
    #: URL prefix for V1 URLs
    API_V1_STR: str = "/api/v1"

    # == security-related settings ==

    #: Secret key
    SECRET_KEY: str = secrets.token_urlsafe(32)
    #: Expiry of access token (60 minutes * 24 hours * 8 days = 8 days)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    #: Server hostname
    SERVER_NAME: str
    #: HTTP to server
    SERVER_HOST: AnyHttpUrl
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

    # == backend-related settings ==

    #: Prefix for the backend of annonars service, default is for dev.
    BACKEND_PREFIX_ANNONARS: str = "http://localhost:3001"
    #: Prefix for the backend of mehari service, default is for dev.
    BACKEND_PREFIX_MEHARI: str = "http://localhost:3002"
    #: Prefix for the backend of viguno service, default is for dev.
    BACKEND_PREFIX_VIGUNO: str = "http://localhost:3003"
    #: Prefix for the backend of nginx service, default is for dev.
    BACKEND_PREFIX_NGINX: str = "http://localhost:3004"

    # -- User-Related Configuration ---------------------------------------------

    # FIRST_SUPERUSER: EmailStr
    # FIRST_SUPERUSER_PASSWORD: str
    # USERS_OPEN_REGISTRATION: bool = False
    # EMAIL_TEST_USER: EmailStr = "test@example.com"  # type: ignore

    # -- Database Configuration ----------------------------------------------

    # Note that when os.environ["CI"] is "true" then we will use an in-memory
    # sqlite database (test use only).

    #: Postgres hostname
    POSTGRES_HOST: str | None = None
    #: Postgres port
    POSTGRES_PORT: int = 5432
    #: Postgres user
    POSTGRES_USER: str | None = None
    #: Postgres password
    POSTGRES_PASSWORD: str | None = None
    #: Postgres database name
    POSTGRES_DB: str | None = None
    #: SQLAlchemy Postgres DSN
    SQLALCHEMY_DATABASE_URI: PostgresDsn | str | None = None

    @field_validator("SQLALCHEMY_DATABASE_URI", mode="before")
    def assemble_db_connection(cls, v: str | None, info: ValidationInfo) -> Any:
        if os.environ.get("CI") == "true":  # pragma: no cover
            return "sqlite://"
        elif isinstance(v, str):  # pragma: no cover
            return v
        else:
            return PostgresDsn.build(
                scheme="postgresql",
                username=info.data.get("POSTGRES_USER"),
                password=info.data.get("POSTGRES_PASSWORD"),
                host=info.data.get("POSTGRES_HOST"),
                port=info.data.get("POSTGRES_PORT"),
                path=f"{info.data.get('POSTGRES_DB') or ''}",
            )

    # -- Email Sending Configuration -----------------------------------------

    # SMTP_TLS: bool = True
    # SMTP_PORT: int | None = None
    # SMTP_HOST: str | None = None
    # SMTP_USER: str | None = None
    # SMTP_PASSWORD: str | None = None
    # EMAILS_FROM_EMAIL: EmailStr | None = None
    # EMAILS_FROM_NAME: str | None = None

    # @validator("EMAILS_FROM_NAME")
    # def get_project_name(cls, v: str | None, values: Dict[str, Any]) -> str:
    #     if not v:
    #         return values["PROJECT_NAME"]
    #     return v

    # EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    # EMAIL_TEMPLATES_DIR: str = "/app/app/email-templates/build"
    # EMAILS_ENABLED: bool = False

    # @validator("EMAILS_ENABLED", pre=True)
    # def get_emails_enabled(cls, v: bool, values: Dict[str, Any]) -> bool:
    #     return bool(
    #         values.get("SMTP_HOST")
    #         and values.get("SMTP_PORT")
    #         and values.get("EMAILS_FROM_EMAIL")
    #     )

    # -- Sentry Configuration ------------------------------------------------

    #: Sentry DSN
    SENTRY_DSN: HttpUrl | None = None

    @field_validator("SENTRY_DSN", mode="before")
    def sentry_dsn_can_be_blank(cls, v: str | None) -> str | None:  # pragma: no cover
        if not v:
            return None
        return v


settings = Settings(_env_file=".env", _env_file_encoding="utf-8")  # type: ignore[call-arg]
