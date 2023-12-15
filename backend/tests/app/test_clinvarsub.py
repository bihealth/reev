"""Tests for the ``app.clinvarsub`` module.

Primarily, this module implements the ClinVar submission code that uses
celery for processing in the background.  We test the components in
some kind of integration and the whole process.

We attempt to cover most of the error handling branches as there is a
large number of moving parts involved here and we want to make sure that
the code is robust.

The following is a list of major sources of failures of the whole process
as observed during development:

- ClinVar will reject submissions if the automated validation fails
- actual network issues
- there may be logic errors in the code
- there may be improper use of ``await`` as SQLAlchemy uses a lot of
  lazy loading; workarounds with ``awaitable_attrs`` were necessary

We do not attempt to test the following error cases:

- problems with the RabbitMQ message queue
- problems with the database
"""

import pytest

# -- _HandlerWithSession ------------------------------------------------------

@pytest.mark.anyio
async def test_handler_with_session_update_status():
    pass

# -- _CreateHandler -----------------------------------------------------------

# missing SubmittingOrg

# -- _RetrieveHandler ---------------------------------------------------------

# missing create activity on retrieve

# -- SubmissionActivityHandler ------------------------------------------------

@pytest.mark.anyio
async def test_submission_activity_handler_create_success_implicit_engine():
    pass

# failures on creation below

@pytest.mark.anyio
async def test_submission_activity_handler_create_success_explicit_engine():
    pass


@pytest.mark.anyio
async def test_submission_activity_handler_create_failure_activity_missing():
    pass


@pytest.mark.anyio
async def test_submission_activity_handler_create_failure_thread_missing():
    pass


@pytest.mark.anyio
async def test_submission_activity_handler_create_failure_activity_invalid_state():
    pass


@pytest.mark.anyio
async def test_submission_activity_handler_create_failure_thread_invalid_state():
    pass

# missing SubmittingOrg

# missing create activity on retrieve
