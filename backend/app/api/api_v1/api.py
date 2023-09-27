from app.api.api_v1.endpoints import adminmsgs
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(adminmsgs.router, prefix="/adminmsgs", tags=["adminmsgs"])
