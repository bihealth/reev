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
#: Prefix for the backend of annonars service
BACKEND_PREFIX_ANNONARS = env.get("REEV_BACKEND_PREFIX_ANNONARS", "http://annonars")
#: Prefix for the backend of mehari service
BACKEND_PREFIX_MEHARI = env.get("REEV_BACKEND_PREFIX_MEHARI", "http://mehari")
#: Prefix for the backend of viguno service
BACKEND_PREFIX_VIGUNO = env.get("REEV_BACKEND_PREFIX_VIGUNO", "http://viguno")


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

    import sys

    print(f"backend_url = {backend_url}", file=sys.stderr)

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


# Routes
@app.get("/api/search")
async def search_gene(
    geneSymbol: str = Query(...), spdi: str = Query(""), genomeRelease: str = Query("hg19")
):
    gene_details = {"geneSymbol": geneSymbol, "genomeRelease": genomeRelease}
    return JSONResponse(content=gene_details)


if SERVE_FRONTEND:  # pragma: no cover
    print(f"SERVE_FRONTEND = {SERVE_FRONTEND}", file=sys.stderr)
    app.mount("/ui", StaticFiles(directory=SERVE_FRONTEND), name="app")

    @app.get("/")
    async def redirect():
        response = RedirectResponse(url="/ui/index.html")
        return response
