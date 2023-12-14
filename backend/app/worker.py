import logging

import sentry_sdk
from asgiref.sync import async_to_sync

from app.core.celery_app import celery_app
from app.core.config import settings

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
    from app.clinvarsub import SubmissionActivityHandler

    async_to_sync(SubmissionActivityHandler(submissionactivity).run)()
    logger.debug("SubmissionActivityHandler(%s) - END", submissionactivity)
