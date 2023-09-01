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
from starlette.responses import FileResponse, RedirectResponse, Response, StreamingResponse

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
if os.path.exists(VERSION_FILE):
    with open(VERSION_FILE) as f:
        REEV_VERSION = f.read().strip() or None


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
