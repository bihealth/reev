#!/usr/bin/bash

set -x

# Interpreted environment variables.
#
#   NO_WAIT_FOR     -- disable waiting for rabbitmq
#   CELERY_QUEUES   -- argument for Celery queues
#                      default: "main-queue"
#   CELERY_WORKERS  -- celery concurrency/process count
#                      default: "8"

NO_WAIT_FOR=${NO_WAIT_FOR-0}
_CELERY_QUEUES=main-queue
CELERY_QUEUES=${CELERY_QUEUES-$_CELERY_QUEUES}
_CELERY_WORKERS=8
CELERY_WORKERS=${CELERY_WORKERS-$_CELERY_WORKERS}

if [[ $NO_WAIT_FOR -eq 0 ]]; then
    &>2 echo "Waiting for RabbitMQ..."
    &>2 /usr/local/bin/wait-for rabbitmq:5672 -t 60 -- echo "... RabbitMQ is ready, sleeping for 10sec"
    sleep 10s
fi

set -euo pipefail

cd /home/reev && \
PYTHONPATH=. python app/celery_pre_start.py

exec celery \
    --app app.worker \
    worker \
    -Q "${CELERY_QUEUES}" \
    --concurrency "${CELERY_WORKERS}" \
    --loglevel info
