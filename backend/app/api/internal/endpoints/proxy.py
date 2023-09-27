"""Reverse proxies to internal services."""

import httpx
from app.core.config import settings
from fastapi import APIRouter, BackgroundTasks, Request, Response
from fastapi.responses import StreamingResponse
from starlette.background import BackgroundTask

router = APIRouter()


@router.get("/{path:path}")
@router.post("/{path:path}")
async def reverse_proxy(request: Request) -> Response:
    """Implement reverse proxy for internal backend services."""
    url = request.url
    backend_url = None

    if url.path.startswith(f"{settings.INTERNAL_STR}/proxy/annonars"):
        backend_url = settings.BACKEND_PREFIX_ANNONARS + url.path.replace(
            "/internal/proxy/annonars", ""
        )
    elif url.path.startswith(f"{settings.INTERNAL_STR}/proxy/mehari"):
        backend_url = settings.BACKEND_PREFIX_MEHARI + url.path.replace(
            "/internal/proxy/mehari", ""
        )
    elif url.path.startswith(f"{settings.INTERNAL_STR}/proxy/viguno"):
        backend_url = settings.BACKEND_PREFIX_VIGUNO + url.path.replace(
            "/internal/proxy/viguno", ""
        )

    if backend_url:
        client = httpx.AsyncClient()
        backend_url = backend_url + (f"?{url.query}" if url.query else "")
        backend_req = client.build_request(
            method=request.method,
            url=backend_url,
            headers=request.headers.raw,
            content=await request.body(),
        )
        backend_resp = await client.send(backend_req, stream=True)
        return StreamingResponse(
            backend_resp.aiter_raw(),
            status_code=backend_resp.status_code,
            headers=backend_resp.headers,
            background=BackgroundTasks([BackgroundTask(backend_resp.aclose)]),
        )
    else:
        return Response(status_code=404, content="Reverse proxy route not found")
