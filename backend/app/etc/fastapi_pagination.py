"""fastapi-pagination code"""
from typing import Generic, TypeVar

from fastapi_pagination.bases import CursorRawParams
from fastapi_pagination.cursor import CursorPage, CursorParams

T = TypeVar("T")


class TotalCursorParams(CursorParams):
    """Cursor params with total count."""

    def to_raw_params(self) -> CursorRawParams:
        params = super().to_raw_params()
        params.include_total = True

        return params


class TotalCursorPage(CursorPage[T], Generic[T]):
    """Cursor page with total count."""

    __params_type__ = TotalCursorParams
