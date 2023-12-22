#!/usr/bin/bash

set -x
set -euo pipefail

# Interpreted environment variables.
#
#   CELERY_QUEUES   -- argument for Celery queues
#                      default: "main-queue"
#   CELERY_WORKERS  -- celery concurrency/process count
#                      default: "8"

_CELERY_QUEUES=main-queue
CELERY_QUEUES=${CELERY_QUEUES-$_CELERY_QUEUES}
_CELERY_WORKERS=8
CELERY_WORKERS=${CELERY_WORKERS-$_CELERY_WORKERS}

rm -f celerybeat.pid

cd /home/reev && \
PYTHONPATH=. python app/celerybeat_pre_start.py

exec celery \
    --app app.worker \
    beat \
    --loglevel info
