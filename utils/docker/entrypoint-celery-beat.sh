#!/usr/bin/bash

set -x
set -euo pipefail

# Interpreted environment variables.
#
#   NO_WAIT_FOR     -- disable waiting for rabbitmq

NO_WAIT_FOR=${NO_WAIT_FOR-0}

if [[ $NO_WAIT_FOR -eq 0 ]]; then
    &>2 echo "Waiting for RabbitMQ..."
    &>2 /usr/local/bin/wait-for rabbitmq:5672 -t 60 -- echo "... RabbitMQ is ready"
fi

rm -f celerybeat.pid

cd /home/reev && \
PYTHONPATH=. python app/celerybeat_pre_start.py

exec celery \
    --app app.worker \
    beat \
    --loglevel info \
    -s /tmp/celerybeat-schedule
