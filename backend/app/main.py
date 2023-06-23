import os
import sys

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse

#: Path to frontend build, if any.
SERVE_FRONTEND = os.environ.get("REEV_SERVE_FRONTEND")

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
