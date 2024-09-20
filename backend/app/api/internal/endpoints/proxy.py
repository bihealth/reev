"""Reverse proxies to internal services."""

import httpx
from fastapi import APIRouter, BackgroundTasks, Request, Response
from fastapi.responses import StreamingResponse
from starlette.background import BackgroundTask

from app.core.config import settings

router = APIRouter()


@router.get("/{path:path}")
@router.post("/{path:path}")
async def reverse_proxy(request: Request) -> Response:
    """
    Reverse proxy to internal services.
    Supported services:
    - AnnoNARS
    - MeHARI
    - Viguno
    - NGINX
    - Dotty
    - CADA-Prio
    - AutoACMG

    :param request: request
    :type request: :class:`fastapi.Request`
    :return: response
    :rtype: :class:`fastapi.Response`
    """
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
    elif url.path.startswith(f"{settings.INTERNAL_STR}/proxy/nginx"):
        backend_url = settings.BACKEND_PREFIX_NGINX + url.path.replace("/internal/proxy/nginx", "")
    elif url.path.startswith(f"{settings.INTERNAL_STR}/proxy/dotty"):
        backend_url = settings.BACKEND_PREFIX_DOTTY + url.path.replace("/internal/proxy/dotty", "")
    elif url.path.startswith(f"{settings.INTERNAL_STR}/proxy/cada-prio"):
        backend_url = settings.BACKEND_PREFIX_CADA_PRIO + url.path.replace(
            "/internal/proxy/cada-prio", ""
        )
    elif url.path.startswith(f"{settings.INTERNAL_STR}/proxy/autoacmg"):
        backend_url = settings.BACKEND_PREFIX_AUTOACMG + url.path.replace(
            "/internal/proxy/autoacmg", ""
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
