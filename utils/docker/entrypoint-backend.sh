#!/usr/bin/bash

set -x
set -euo pipefail

# Interpreted environment variables.
#
#   HTTP_HOST       -- host to listen on
#                      default: 0.0.0.0
#   HTTP_PORT       -- port
#                      default: 8080

HTTP_HOST=${HTTP_HOST-0.0.0.0}
HTTP_PORT=${HTTP_PORT-8080}

cd /home/reev && \
PYTHONPATH=. python app/backend_pre_start.py

exec uvicorn app.main:app --host $HTTP_HOST --port $HTTP_PORT
