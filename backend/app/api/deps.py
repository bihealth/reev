from typing import Iterator

from app.db.session import SessionLocal


def get_db() -> Iterator[SessionLocal]:  # type: ignore[valid-type]
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
