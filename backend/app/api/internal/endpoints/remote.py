"""Reverse proxies to external/remote services."""

import json

import httpx
from fastapi import APIRouter, BackgroundTasks, Request, Response
from fastapi.responses import JSONResponse, StreamingResponse
from starlette.background import BackgroundTask

#: Keys for the ACMG rating
ACMG_RATING_KEYS: tuple[str, ...] = (
    "pvs1",
    "ps1",
    "ps2",
    "ps3",
    "ps4",
    "pm1",
    "pm2",
    "pm3",
    "pm4",
    "pm5",
    "pm6",
    "pp1",
    "pp2",
    "pp3",
    "pp4",
    "pp5",
    "ba1",
    "bs1",
    "bs2",
    "bs3",
    "bs4",
    "bp1",
    "bp2",
    "bp3",
    "bp4",
    "bp5",
    "bp6",
    "bp7",
)


def default_acmg_rating() -> dict[str, bool]:
    return {k: False for k in ACMG_RATING_KEYS}


router = APIRouter()


class HTTPXClientWrapper:
    """Wrapper around HTTPX AsyncClient to for graceful startup/shutdown within FastAPI."""

    transport: httpx.AsyncHTTPTransport | None = None
    async_client: httpx.AsyncClient | None = None

    def start(self):
        self.transport = httpx.AsyncHTTPTransport(retries=1)
        self.transport._pool._ssl_context.options |= 0x4  # OP_LEGACY_SERVER_CONNECT
        self.async_client = httpx.AsyncClient(timeout=httpx.Timeout(60.0), transport=self.transport)

    async def stop(self):
        await self.async_client.aclose()
        self.async_client = None

    def __call__(self):
        assert self.async_client is not None
        return self.async_client


httpx_client_wrapper = HTTPXClientWrapper()


@router.get("/variantvalidator/{path:path}")
async def variantvalidator(request: Request, path: str):
    """
    Implement VariantValidator API. Proxy requests to the
    `VariantValidator <https://rest.variantvalidator.org/>`_ backend.

    :param request: request
    :type request: :class:`fastapi.Request`
    :param path: path to append to the backend URL
    :type path: str
    :return: response
    :rtype: :class:`fastapi.responses.StreamingResponse`
    """
    url = request.url

    # change grch to GRCh and strip "chr" prefixes
    path = path.replace("grch", "GRCh").replace("chr", "")
    backend_url = "https://rest.variantvalidator.org/VariantValidator/variantvalidator/" + path

    backend_url = backend_url + (f"?{url.query}" if url.query else "")
    client = httpx_client_wrapper()
    backend_req = client.build_request(
        method=request.method,
        url=backend_url,
        content=await request.body(),
    )
    backend_resp = await client.send(backend_req, stream=True)
    return StreamingResponse(
        backend_resp.aiter_raw(),
        status_code=backend_resp.status_code,
        headers=backend_resp.headers,
        background=BackgroundTasks([BackgroundTask(backend_resp.aclose)]),
    )


@router.get("/acmg/{path:path}")
async def acmg(request: Request):
    """
    Implement searching for ACMG classification for SNVs and indels.
    Proxy requests to the `WinterVar <http://wintervar.wglab.org/>`_ backend.

    :param request: request
    :type request: :class:`fastapi.Request`
    :return: ACMG classification
    :rtype: dict
    """
    query_params = request.query_params
    chromosome = query_params.get("chromosome")
    position = query_params.get("position")
    reference = query_params.get("reference")
    alternative = query_params.get("alternative")
    build = query_params.get("release")

    if not chromosome or not position or not reference or not alternative or not build:
        return Response(status_code=400, content="Missing query parameters")

    url = (
        f"http://wintervar.wglab.org/api_new.php?"
        f"queryType=position&chr={chromosome}&pos={position}"
        f"&ref={reference}&alt={alternative}&build={build}"
    )
    client = httpx_client_wrapper()
    backend_req = client.build_request(method="GET", url=url)
    backend_resp = await client.send(backend_req)
    if backend_resp.status_code != 200:
        return Response(status_code=backend_resp.status_code, content=backend_resp.content)

    try:
        backend_json = backend_resp.json()
    except json.JSONDecodeError:
        return Response(
            status_code=500, content=json.dumps({"error": "Invalid response from Intervar"})
        )

    acmg_rating = default_acmg_rating()
    for key, value in backend_json.items():
        if key.lower() in acmg_rating:
            acmg_rating[key.lower()] = value == 1
    return JSONResponse(acmg_rating)


@router.get("/cnv/acmg/{path:path}")
async def cnv_acmg(request: Request):
    """
    Implement searching for ACMG classification for CNVs.
    Proxy requests to the `wAutoCNV <https://phoenix.bgi.com/>`_ backend.

    :param request: request
    :type request: :class:`fastapi.Request`
    :return: ACMG classification
    :rtype: dict
    """
    query_params = request.query_params
    chromosome = query_params.get("chromosome")
    start = query_params.get("start")
    end = query_params.get("end")
    func = query_params.get("func")

    if not chromosome or not start or not end or not func:
        return Response(status_code=400, content="Missing query parameters")

    client = httpx_client_wrapper()
    backend_req = client.build_request(
        method="POST",
        url="https://phoenix.bgi.com/api/acit/jobs/",
        data={"chromosome": chromosome, "start": start, "end": end, "func": func, "error": 0},
    )
    backend_resp = await client.send(backend_req)
    if backend_resp.status_code != 200:
        return Response(status_code=backend_resp.status_code, content=backend_resp.content)

    if backend_resp.status_code != 200:
        return Response(status_code=backend_resp.status_code, content=backend_resp.content)
    return JSONResponse(backend_resp.json())


@router.get("/pubtator3-api/{path:path}")
async def pubtator3_api(request: Request, path: str):
    """
    Proxy requests to the `PubTator 3 <https://www.ncbi.nlm.nih.gov/research/pubtator3-api/>`_ backend.

    :param request: request
    :type request: :class:`fastapi.Request`
    :param path: path to append to the backend URL
    :type path: str
    :return: response
    :rtype: :class:`fastapi.responses.StreamingResponse`
    """
    url = request.url
    backend_url = "https://www.ncbi.nlm.nih.gov/research/pubtator3-api/" + path
    backend_url = backend_url + (f"?{url.query}" if url.query else "")

    client = httpx_client_wrapper()
    backend_req = client.build_request(
        method=request.method,
        url=backend_url,
        content=await request.body(),
    )
    backend_resp = await client.send(backend_req, stream=True)
    if "set-cookie" in backend_resp.headers:
        backend_resp.headers.pop("set-cookie")
    return StreamingResponse(
        backend_resp.aiter_raw(),
        status_code=backend_resp.status_code,
        headers=backend_resp.headers,
        background=BackgroundTasks([BackgroundTask(backend_resp.aclose)]),
    )
