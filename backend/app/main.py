import os
import sys

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.background import BackgroundTask
from starlette.requests import Request
from starlette.responses import JSONResponse, RedirectResponse, Response, StreamingResponse

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


# Routes
@app.get("/api/hello")
def read_root():
    return {"Hello": "World"}


@app.get("/api/search")
async def search(geneSymbol: str = Query(...), genomeRelease: str = Query("hg19")):
    details = {"geneSymbol": geneSymbol, "genomeRelease": genomeRelease}
    return JSONResponse(content=details)


if SERVE_FRONTEND:
    print(f"SERVE_FRONTEND = {SERVE_FRONTEND}", file=sys.stderr)
    app.mount("/ui", StaticFiles(directory=SERVE_FRONTEND), name="app")

    @app.get("/")
    async def redirect():
        response = RedirectResponse(url=f"/ui/index.html")
        return response
