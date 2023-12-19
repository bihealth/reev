import asyncio
import logging

import sentry_sdk
from celery.schedules import crontab
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
        finally:
            await engine.dispose()

    # Run the inner async function and block until this is done.
    asyncio.run(inner())

    logger.debug("SubmissionActivityHandler(%s) - END", submissionactivity)


@celery_app.task(acks_late=True)
def process_old_clinvarsub_retrieval_jobs():
    """Process old clinvarsub RETRIEVE jobs.

    This will fetch all clinvarsub RETRIEVE that are older than
    ``clinvarsub.RETRY_WAIT_SECONDS`` seconds and start a job for them. We
    do this regularly to make sure we don't miss any jobs that were not
    processed because the worker was shutdown.
    """
    logger.debug("process_old_clinvarsub_retrieval_jobs - START")

    # We must import the handler class locally here to prevent circular imports.
    from app import clinvarsub

    async def inner():
        """Inner async function so we can run everything for the task in the
        same event loop.
        """
        engine = create_async_engine(
            str(settings.SQLALCHEMY_DATABASE_URI),
            pool_pre_ping=True,
            json_serializer=json_serializer,
        )
        try:
            await clinvarsub.process_old_clinvarsub_retrieval_jobs(engine)
        except Exception as e:
            logger.error("Caught exception of type %s: %s", type(e), e)
        finally:
            await engine.dispose()

    # Run the inner async function and block until this is done.
    asyncio.run(inner())

    logger.debug("process_old_clinvarsub_retrieval_jobs - END")


@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    """Setup periodic tasks."""
    _ = kwargs
    # Run old clinvarsub RETRIEVE jobs in WAITING state once every hour.
    sender.add_periodic_task(
        crontab(minute=1),
        process_old_clinvarsub_retrieval_jobs.s(),
        name="handle old clinvarsub RETRIEVE jobs",
    )
