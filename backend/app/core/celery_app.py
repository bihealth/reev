from celery import Celery

from app.core.config import settings

celery_app = Celery("worker", broker=settings.RABBITMQ_URL)

celery_app.conf.task_routes = {"app.worker.*": {"queue": "main-queue"}}
