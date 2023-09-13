import os
import pathlib
import subprocess
import sys

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.background import BackgroundTask
from starlette.requests import Request
from starlette.responses import FileResponse, JSONResponse, Response, StreamingResponse

# Load environment
env = os.environ
load_dotenv()

#: Path to frontend build, if any.
SERVE_FRONTEND = env.get("REEV_SERVE_FRONTEND")
#: Debug mode
DEBUG = env.get("REEV_DEBUG", "false").lower() in ("true", "1")
#: Prefix for the backend of annonars service
BACKEND_PREFIX_ANNONARS = env.get("REEV_BACKEND_PREFIX_ANNONARS", "http://annonars:8080")
#: Prefix for the backend of mehari service
BACKEND_PREFIX_MEHARI = env.get("REEV_BACKEND_PREFIX_MEHARI", "http://mehari:8080")
#: Prefix for the backend of viguno service
BACKEND_PREFIX_VIGUNO = env.get("REEV_BACKEND_PREFIX_VIGUNO", "http://viguno:8080")
#: Path to REEV version file.
VERSION_FILE = env.get("REEV_VERSION_FILE", "/VERSION")
#: The REEV version from the file (``None`` if to load dynamically from git)
REEV_VERSION = None
# Try to obtain version from file, otherwise keep it at ``None``
if os.path.exists(VERSION_FILE):  # pragma: no cover
    with open(VERSION_FILE) as f:
        REEV_VERSION = f.read().strip() or None
#: Template for ACMG rating
ACMG_RATING: dict = {
    "pvs1": False,
    "ps1": False,
    "ps2": False,
    "ps3": False,
    "ps4": False,
    "pm1": False,
    "pm2": False,
    "pm3": False,
    "pm4": False,
    "pm5": False,
    "pm6": False,
    "pp1": False,
    "pp2": False,
    "pp3": False,
    "pp4": False,
    "pp5": False,
    "ba1": False,
    "bs1": False,
    "bs2": False,
    "bs3": False,
    "bs4": False,
    "bp1": False,
    "bp2": False,
    "bp3": False,
    "bp4": False,
    "bp5": False,
    "bp6": False,
    "bp7": False,
}

app = FastAPI()

# Configure CORS settings
origins = [
    "http://localhost",  # Update with the actual frontend URL
    "http://localhost:8081",  # Update with the actual frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Reverse proxy implementation
client = httpx.AsyncClient()


async def reverse_proxy(request: Request) -> Response:
    """Implement reverse proxy for backend services."""
    url = request.url
    backend_url = None

    if url.path.startswith("/proxy/annonars"):
        backend_url = BACKEND_PREFIX_ANNONARS + url.path.replace("/proxy/annonars", "")
    elif url.path.startswith("/proxy/mehari"):
        backend_url = BACKEND_PREFIX_MEHARI + url.path.replace("/proxy/mehari", "")
    elif url.path.startswith("/proxy/viguno"):
        backend_url = BACKEND_PREFIX_VIGUNO + url.path.replace("/proxy/viguno", "")

    if backend_url:
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
            background=BackgroundTask(backend_resp.aclose),
        )
    else:
        return Response(status_code=404, content="Reverse proxy route not found")


# Register reverse proxy route
app.add_route("/proxy/{path:path}", reverse_proxy, methods=["GET", "POST"])


# Register app for returning REEV version.
@app.get("/version")
async def version():
    if REEV_VERSION:
        version = REEV_VERSION
    else:
        version = subprocess.check_output(["git", "describe", "--tags", "--dirty"]).strip()
    return Response(content=version)


# Register app for returning proxy for variantvalidator.org.
@app.get("/variantvalidator/{path:path}")
async def variantvalidator(request: Request, path: str):
    """Implement reverse proxy for variantvalidator.org."""
    url = request.url
    # Change grch to GRCh and chr to nothing in path
    path = path.replace("grch", "GRCh").replace("chr", "")
    backend_url = "https://rest.variantvalidator.org/VariantValidator/variantvalidator/" + path

    backend_url = backend_url + (f"?{url.query}" if url.query else "")
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
        background=BackgroundTask(backend_resp.aclose),
    )


# Register app for retrieving ACMG classification.
@app.get("/acmg/{path:path}")
async def acmg(request: Request):
    """Implement searching for ACMG classification."""
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
    backend_req = client.build_request(method="GET", url=url)
    backend_resp = await client.send(backend_req)
    if backend_resp.status_code != 200:
        return Response(status_code=backend_resp.status_code, content=backend_resp.content)

    acmg_rating = ACMG_RATING.copy()
    for key, value in backend_resp.json().items():
        if key.lower() in acmg_rating:
            acmg_rating[key.lower()] = True if value == 1 else False
    return JSONResponse(acmg_rating)


# Register route for favicon.
@app.get("/favicon.ico")
async def favicon():
    return FileResponse(pathlib.Path(__file__).parent / "assets/favicon.ico")


# Server front-end (assets directory and index file for root ("/") entrypoint) when configured
if SERVE_FRONTEND:  # pragma: no cover
    print(f"serving front-end from {SERVE_FRONTEND}", file=sys.stderr)
    app.mount("/assets", StaticFiles(directory=f"{SERVE_FRONTEND}/assets"), name="ui")

    @app.get("/")
    async def index():
        """Render the index.html page at the root URL"""
        return FileResponse(f"{SERVE_FRONTEND}/index.html")

    @app.api_route("/{path_name:path}", methods=["GET"])
    async def catch_all(request: Request, path_name: str):
        """Catch-all route forwarding to frontend."""
        _, _ = request, path_name
        return FileResponse(f"{SERVE_FRONTEND}/index.html")
