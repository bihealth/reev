from unittest.mock import MagicMock, mock_open

import pytest
from starlette.requests import Request

from app.etc.utils import send_email, send_test_email, send_user_verify_email


@pytest.fixture
def mock_settings(monkeypatch):
    """Mock settings for sending emails."""
    # arrange:
    monkeypatch.setattr("app.core.config.settings.EMAILS_ENABLED", True)
    monkeypatch.setattr("app.core.config.settings.EMAILS_FROM_NAME", "Test From")
    monkeypatch.setattr("app.core.config.settings.EMAILS_FROM_EMAIL", "from@test.com")


@pytest.fixture
def mock_email_send(monkeypatch):
    """Mock the send method of emails.Message."""
    # arrange:
    mock_send = MagicMock()
    monkeypatch.setattr("emails.Message.send", mock_send)
    return mock_send


@pytest.fixture
def mock_open_template(monkeypatch):
    """Mock the open method for reading email templates."""
    # arrange:
    m = mock_open(read_data="email content")
    monkeypatch.setattr("builtins.open", m)
    return m


def test_send_email(mock_settings, mock_email_send, mock_open_template):
    """Test sending an email."""
    # act:
    send_email("to@test.com", "Test Subject", "<p>Test Body</p>")
    # assert:
    mock_email_send.assert_called_once()
    args, kwargs = mock_email_send.call_args
    assert kwargs["to"] == "to@test.com"


def test_send_test_email(mock_settings, mock_email_send, mock_open_template):
    """Test sending a test email."""
    # act:
    send_test_email("to@test.com")
    # assert:
    mock_email_send.assert_called_once()
    args, kwargs = mock_email_send.call_args
    assert kwargs["to"] == "to@test.com"


def test_send_user_verify_email(mock_settings, mock_email_send, mock_open_template):
    """Test sending a user verification email."""
    # arrange:
    request_scope = {
        "type": "http",
        "scheme": "https",
        "server": ("testserver", 80),
        "path": "/test/path",
        "headers": [(b"host", b"testserver")],
    }
    request = Request(scope=request_scope)
    # act:
    send_user_verify_email("to@test.com", "token123", request)
    # assert:
    mock_email_send.assert_called_once()
    args, kwargs = mock_email_send.call_args
    assert kwargs["to"] == "to@test.com"
    assert "token123" in kwargs["render"]["token"]
