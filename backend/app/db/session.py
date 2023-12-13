import json
from typing import Any

from pydantic.json import pydantic_encoder
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings


def json_serializer(*args, **kwargs) -> str:
    return json.dumps(*args, default=pydantic_encoder, **kwargs)


#: Async engine, to be used throughout the app.
engine = create_async_engine(
    str(settings.SQLALCHEMY_DATABASE_URI), pool_pre_ping=True, json_serializer=json_serializer
)
# Local async session, to be used throughout the app.
SessionLocal = async_sessionmaker(
    autocommit=False, autoflush=False, expire_on_commit=False, bind=engine
)


def _mksync(s: str):
    return s.replace("+asyncpg", "").replace("+aiosqlite", "")


#: Sync engine, to be used in interactive shells.
sync_engine = create_engine(
    _mksync(str(settings.SQLALCHEMY_DATABASE_URI)),
    pool_pre_ping=True,
    json_serializer=json_serializer,
)
# Local async session, to be used in interactive shells.
SyncSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, expire_on_commit=False, bind=sync_engine
)

Base: Any = declarative_base()
