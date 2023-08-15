import os
import sys

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.background import BackgroundTask
from starlette.requests import Request
from starlette.responses import RedirectResponse, Response, StreamingResponse

# Load environment
env = os.environ
load_dotenv()

#: Path to frontend build, if any.
SERVE_FRONTEND = env.get("REEV_SERVE_FRONTEND")
#: Debug mode
DEBUG = env.get("REEV_DEBUG", "false").lower() in ("true", "1")
#: Prefixes for varfish-docker-compose-ng
BACKEND_PREFIX_MEHARI = env.get("REEV_BACKEND_PREFIX_MEHARI", "http://mehari")
BACKEND_PREFIX_VIGUNO = env.get("REEV_BACKEND_PREFIX_VIGUNO", "http://viguno")
BACKEND_PREFIX_ANNONARS = env.get("REEV_BACKEND_PREFIX_ANNONARS", "http://annonars")


app = FastAPI()


# Reverse proxy implementation
client = httpx.AsyncClient()


async def reverse_proxy(request: Request):
    url = request.url
    backend_url = None

    if url.path.startswith("/proxy/annonars"):
        backend_url = BACKEND_PREFIX_ANNONARS + url.path.replace("/proxy/annonars", "/annos")
    elif url.path.startswith("/proxy/mehari"):
        backend_url = BACKEND_PREFIX_MEHARI + url.path.replace("/proxy/mehari", "")
    elif url.path.startswith("/proxy/viguno"):
        backend_url = BACKEND_PREFIX_VIGUNO + url.path.replace("/proxy/viguno", "")

    if backend_url:
        backend_url = backend_url + ("?" + url.query if url.query else "")
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
            background=BackgroundTask(backend_resp.aclose),
        )

    return Response(status_code=404, content="Reverse proxy route not found")


# Register reverse proxy route
app.add_route("/proxy/{path:path}", reverse_proxy, methods=["GET", "POST"])


@app.get("/api/hello")
def read_root():
    return {"Hello": "World"}


if SERVE_FRONTEND:
    print(f"SERVE_FRONTEND = {SERVE_FRONTEND}", file=sys.stderr)
    app.mount("/ui", StaticFiles(directory=SERVE_FRONTEND), name="app")

    @app.get("/")
    async def redirect():
        response = RedirectResponse(url=f"/ui/index.html")
        return response
