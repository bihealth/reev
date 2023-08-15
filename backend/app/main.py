import os
import sys

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse

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
