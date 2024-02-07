import asyncio
import logging

from app.db.init_db import init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logging.getLogger("passlib.handlers.bcrypt").setLevel(logging.ERROR)

async def main() -> None:
    logger.info("Creating initial data")
    await init_db()
    logger.info("Initial data created")


if __name__ == "__main__":
    asyncio.run(main())
