import asyncio
import logging

import sentry_sdk
from sqlalchemy.ext.asyncio import create_async_engine

from app.core.celery_app import celery_app
from app.core.config import settings
from app.db.session import json_serializer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


if settings.SENTRY_DSN:  # pragma: no cover
    sentry_sdk.init(
        dsn=str(settings.SENTRY_DSN),
        enable_tracing=True,
    )


@celery_app.task(acks_late=True)
def handle_submission_activity(submissionactivity: str):
    """Process a ClinVar submission activity.

    :param submissionactivity: UUID of the activity to process.
    """
    logger.debug("SubmissionActivityHandler(%s) - START", submissionactivity)

    # We must import the handler class locally here to prevent circular imports.
    from app.clinvarsub import SubmissionActivityHandler, SubmissionException

    async def inner():
        """Inner async function so we can run everything for the task in the
        same event loop.

        For example, we need our own engine here because the global one is
        in a different event loop when run in Celery.

        All exceptions are caught and we log an error when handling them but
        swallow them otherwise so the Celery task doesn't fail.
        """
        # Need our own engine so this is in our local event loop.
        engine = create_async_engine(
            str(settings.SQLALCHEMY_DATABASE_URI),
            pool_pre_ping=True,
            json_serializer=json_serializer,
        )
        try:
            await SubmissionActivityHandler(submissionactivity, engine).run()
        except SubmissionException as e:
            logger.error("Caught known exception of type %s: %s", type(e), e)
        except Exception as e:
            logger.error("Caught unknown exception of type %s: %s", type(e), e)

    # Run the inner async function and block until this is done.
    asyncio.run(inner())

    logger.debug("SubmissionActivityHandler(%s) - END", submissionactivity)
