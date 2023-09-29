from pydantic import BaseModel, HttpUrl


class OAuth2ProviderBase(BaseModel):
    """Base class for OAuth2 providers infos."""

    #: Name of the identity provider.
    name: str
    #: Label to display to users
    label: str


class OAuth2ProviderPublic(OAuth2ProviderBase):
    """Information exposed via API."""


class OAuth2ProviderConfig(OAuth2ProviderBase):
    """OAuth2 provider configuration with client secrets."""

    #: Configuration URL of the provider.
    config_url: HttpUrl
    #: Client ID to use.
    client_id: str
    #: Client secret to use.
    client_secret: str
