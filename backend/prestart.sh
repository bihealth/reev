#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Let the DB start
python $SCRIPT_DIR/app/backend_pre_start.py

# Run migrations
alembic upgrade head

# Create initial data in DB
python $SCRIPT_DIR/app/initial_data.py
