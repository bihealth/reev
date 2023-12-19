import asyncio
import typing

#: Freeze "base" time for all tests.
FREEZE_TIME = "2023-12-14T09:01:19.452062"
#: Freeze time with 1sec offset to FREEZE_TIME, when ordering by time
#: must be meaningful.
FREEZE_TIME_1SEC = "2023-12-14T09:01:20.452062"


def async_return(result: typing.Any) -> asyncio.Future:
    """Create a future that returns the given result."""
    f: asyncio.Future = asyncio.Future()
    f.set_result(result)
    return f
