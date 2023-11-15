import asyncio
import logging
import os

from sqlalchemy import text
from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed

import alembic.config
from app.db.session import SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

max_tries = 60 * 5  # 5 minutes
wait_seconds = 1


@retry(
    stop=stop_after_attempt(max_tries),
    wait=wait_fixed(wait_seconds),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
async def init():
    try:
        with SessionLocal() as db:
            # Try to create session to check if DB is awake
            await db.execute(text("SELECT 1"))
            # Ensure to run Alembic on startup
            for key in ("DATABASE_URL", "SQLALCHEMY_DATABASE_URI"):
                if key in os.environ:
                    os.environ[key] = os.environ[key].replace("+asyncpg", "")

            alembicArgs = ["--raiseerr", "upgrade", "head"]
            alembic.config.main(alembicArgs)
    except Exception as e:
        logger.error(e)
        raise e


async def main():
    logger.info("Initializing service")
    await init()
    logger.info("Service finished initializing")


if __name__ == "__main__":
    asyncio.run(main())
