from fastapi import APIRouter

from app import schemas
from app.core import config

router = APIRouter()


@router.get("/oauth2-providers", response_model=list[schemas.OAuth2ProviderPublic])
async def list_oauth2_providers() -> list[schemas.OAuth2ProviderPublic]:
    """
    Retrieve all admin messages.
    
    :return: list of admin messages
    :rtype: list
    """
    providers = [
        schemas.OAuth2ProviderPublic.model_validate(obj.model_dump())
        for obj in config.settings.OAUTH2_PROVIDERS
    ]
    return providers
