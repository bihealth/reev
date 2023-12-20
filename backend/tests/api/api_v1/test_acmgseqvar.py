import uuid
from typing import Any

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.user import User

# ------------------------------------------------------------------------------
# # /api/v1/acmgseqvar/create
# ------------------------------------------------------------------------------


@pytest.fixture
def acmgseqvar_post_data() -> dict[str, Any]:
    return {
        "seqvar_name": "chr0:123:A:C",
        "acmg_rank": {
            "comment": "No comment",
            "criterias": [
                {
                    "criteria": "PM4",
                    "presence": "Absent",
                    "evidence": "Pathogenic Moderate",
                }
            ],
        },
    }


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_create_acmgseqvar(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
):
    """Test creating a acmgseqvar."""
    _ = db_session
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )
    content = response.json()
    assert response.status_code == 200
    assert content["seqvar_name"] == acmgseqvar_post_data["seqvar_name"]
    assert content["acmg_rank"] == acmgseqvar_post_data["acmg_rank"]
    assert content["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_create_acmgseqvar_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
):
    """Test creating a acmgseqvar as superuser."""
    _ = db_session
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )
    content = response.json()
    assert response.status_code == 200
    assert content["seqvar_name"] == acmgseqvar_post_data["seqvar_name"]
    assert content["acmg_rank"] == acmgseqvar_post_data["acmg_rank"]
    assert content["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_create_acmgseqvar_anon(
    db_session: AsyncSession, client: TestClient, acmgseqvar_post_data: dict[str, Any]
):
    """Test creating a acmgseqvar as anonymous user."""
    _ = db_session
    response = client.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_create_acmgseqvar_invalid_data(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test creating a acmgseqvar with invalid data."""
    _ = db_session
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json={"seqvar_name": "chr0:123:A:C", "acmg_rank": {"comment": "No comment"}},
    )
    assert response.status_code == 422


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_create_acmgseqvar_invalid_enums(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
):
    """Test creating a acmgseqvar with invalid enums."""
    _ = db_session
    post_data = acmgseqvar_post_data.copy()
    post_data["acmg_rank"]["criterias"][0]["criteria"] = "Pppm4"
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=post_data,
    )
    assert response.status_code == 422


# ------------------------------------------------------------------------------
# /api/v1/acmgseqvar/list-all
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_list_all_acmgseqvars(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
):
    """Test listing all acmgseqvars."""
    _ = db_session
    # Create acmgseqvar
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )
    assert response.status_code == 200

    response = client_user.get(
        f"{settings.API_V1_STR}/acmgseqvar/list-all",
    )
    content = response.json()
    assert response.status_code == 401
    assert content == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_list_all_acmgseqvars_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
):
    """Test listing all acmgseqvars as superuser."""
    _ = db_session
    # Create acmgseqvar
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )
    assert response.status_code == 200

    response = client_user.get(
        f"{settings.API_V1_STR}/acmgseqvar/list-all",
    )
    content = response.json()
    assert response.status_code == 200
    assert content[0]["seqvar_name"] == acmgseqvar_post_data["seqvar_name"]
    assert content[0]["acmg_rank"] == acmgseqvar_post_data["acmg_rank"]
    assert content[0]["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_list_all_acmgseqvars_anon(db_session: AsyncSession, client: TestClient):
    """Test listing all acmgseqvars as anonymous user."""
    _ = db_session
    response = client.get(
        f"{settings.API_V1_STR}/acmgseqvar/list-all",
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_list_all_no_acmgseqvars(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing all acmgseqvars as superuser."""
    _ = db_session
    response = client_user.get(
        f"{settings.API_V1_STR}/acmgseqvar/list-all",
    )
    content = response.json()
    assert response.status_code == 200
    assert content == []


# ------------------------------------------------------------------------------
# /api/v1/acmgseqvar/get-by-id
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_get_by_id_acmgseqvar(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
):
    """Test getting a acmgseqvar."""
    _ = db_session
    # Create acmgseqvar
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )
    assert response.status_code == 200
    # Get the acmgseqvar id
    response = client_user.get(f"{settings.API_V1_STR}/acmgseqvar/list")
    acmgseqvar_id = response.json()[0]["id"]

    response = client_user.get(
        f"{settings.API_V1_STR}/acmgseqvar/get-by-id?id={acmgseqvar_id}",
    )
    content = response.json()
    assert response.status_code == 401
    assert content == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_get_by_id_acmgseqvar_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
):
    """Test getting a acmgseqvar as superuser."""
    _ = db_session
    # Create acmgseqvar
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )
    assert response.status_code == 200
    # Get the acmgseqvar id
    response = client_user.get(f"{settings.API_V1_STR}/acmgseqvar/list")
    acmgseqvar_id = response.json()[0]["id"]

    response = client_user.get(
        f"{settings.API_V1_STR}/acmgseqvar/get-by-id?id={acmgseqvar_id}",
    )
    content = response.json()
    assert response.status_code == 200
    assert content["seqvar_name"] == acmgseqvar_post_data["seqvar_name"]
    assert content["acmg_rank"] == acmgseqvar_post_data["acmg_rank"]
    assert content["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_get_by_id_acmgseqvar_anon(db_session: AsyncSession, client: TestClient):
    """Test getting a acmgseqvar as anonymous user."""
    _ = db_session
    response = client.get(
        f"{settings.API_V1_STR}/acmgseqvar/get-by-id?id={uuid.uuid4()}",
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_get_acmgseqvar_by_invalid_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a acmgseqvar with invalid id."""
    caseinfo_id = uuid.uuid4()  # Invalid id
    response = client_user.get(
        f"{settings.API_V1_STR}/acmgseqvar/get-by-id?id={caseinfo_id}",
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "ACMG Sequence Variant not found"}


# ------------------------------------------------------------------------------
# /api/v1/acmgseqvar/list
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_list_acmgseqvars(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
):
    """Test listing acmgseqvars."""
    _ = db_session
    # Create acmgseqvar
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )
    assert response.status_code == 200

    response = client_user.get(
        f"{settings.API_V1_STR}/acmgseqvar/list",
    )
    content = response.json()
    assert response.status_code == 200
    assert content[0]["seqvar_name"] == acmgseqvar_post_data["seqvar_name"]
    assert content[0]["acmg_rank"] == acmgseqvar_post_data["acmg_rank"]
    assert content[0]["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_list_acmgseqvars_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
):
    """Test listing acmgseqvars as superuser."""
    _ = db_session
    # Create acmgseqvar
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )
    assert response.status_code == 200

    response = client_user.get(
        f"{settings.API_V1_STR}/acmgseqvar/list",
    )
    content = response.json()
    assert response.status_code == 200
    assert content[0]["seqvar_name"] == acmgseqvar_post_data["seqvar_name"]
    assert content[0]["acmg_rank"] == acmgseqvar_post_data["acmg_rank"]
    assert content[0]["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_list_acmgseqvars_anon(db_session: AsyncSession, client: TestClient):
    """Test listing acmgseqvars as anonymous user."""
    _ = db_session
    response = client.get(
        f"{settings.API_V1_STR}/acmgseqvar/list",
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_list_no_acmgseqvars(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing acmgseqvars with no records."""
    _ = db_session
    response = client_user.get(
        f"{settings.API_V1_STR}/acmgseqvar/list",
    )
    content = response.json()
    assert response.status_code == 200
    assert content == []


# ------------------------------------------------------------------------------
# /api/v1/acmgseqvar/get
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_get_acmgseqvar(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
):
    """Test getting a acmgseqvar."""
    _ = db_session
    # Create acmgseqvar
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )
    assert response.status_code == 200

    response = client_user.get(
        f"{settings.API_V1_STR}/acmgseqvar/get?seqvar={acmgseqvar_post_data['seqvar_name']}",
    )
    content = response.json()
    assert response.status_code == 200
    assert content["seqvar_name"] == acmgseqvar_post_data["seqvar_name"]
    assert content["acmg_rank"] == acmgseqvar_post_data["acmg_rank"]
    assert content["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_get_acmgseqvar_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
):
    """Test getting a acmgseqvar as superuser."""
    _ = db_session
    # Create acmgseqvar
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )
    assert response.status_code == 200

    response = client_user.get(
        f"{settings.API_V1_STR}/acmgseqvar/get?seqvar={acmgseqvar_post_data['seqvar_name']}",
    )
    content = response.json()
    assert response.status_code == 200
    assert content["seqvar_name"] == acmgseqvar_post_data["seqvar_name"]
    assert content["acmg_rank"] == acmgseqvar_post_data["acmg_rank"]
    assert content["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_get_acmgseqvar_anon(db_session: AsyncSession, client: TestClient):
    """Test getting a acmgseqvar as anonymous user."""
    _ = db_session
    response = client.get(
        f"{settings.API_V1_STR}/acmgseqvar/get?seqvar={uuid.uuid4()}",
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_get_no_acmgseqvar(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a acmgseqvar with no acmgseqvar."""
    _ = db_session
    response = client_user.get(
        f"{settings.API_V1_STR}/acmgseqvar/get?seqvar=invalid",
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "ACMG Sequence Variant not found"}


# ------------------------------------------------------------------------------
# /api/v1/acmgseqvar/update
# ------------------------------------------------------------------------------


@pytest.fixture
def acmgseqvar_update_data() -> dict[str, Any]:
    return {
        "seqvar_name": "chr0:123:A:C",
        "acmg_rank": {
            "comment": "Update",
            "criterias": [
                {
                    "criteria": "PM4",
                    "presence": "Present",
                    "evidence": "Pathogenic Moderate",
                }
            ],
        },
    }


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_update_acmgseqvar(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
    acmgseqvar_update_data: dict[str, Any],
):
    """Test updating a acmgseqvar."""
    _ = db_session
    # Create acmgseqvar
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )
    assert response.status_code == 200
    # Update acmgseqvar
    response = client_user.put(
        f"{settings.API_V1_STR}/acmgseqvar/update",
        json=acmgseqvar_update_data,
    )
    content = response.json()
    assert response.status_code == 200
    assert content["seqvar_name"] == acmgseqvar_update_data["seqvar_name"]
    assert content["acmg_rank"] == acmgseqvar_update_data["acmg_rank"]
    assert content["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_update_acmgseqvar_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
    acmgseqvar_update_data: dict[str, Any],
):
    """Test updating a acmgseqvar as superuser."""
    _ = db_session
    # Create acmgseqvar
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )
    assert response.status_code == 200
    # Update acmgseqvar
    response = client_user.put(
        f"{settings.API_V1_STR}/acmgseqvar/update",
        json=acmgseqvar_update_data,
    )
    content = response.json()
    assert response.status_code == 200
    assert content["seqvar_name"] == acmgseqvar_update_data["seqvar_name"]
    assert content["acmg_rank"] == acmgseqvar_update_data["acmg_rank"]
    assert content["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_update_acmgseqvar_anon(
    db_session: AsyncSession, client: TestClient, acmgseqvar_update_data: dict[str, Any]
):
    """Test updating a acmgseqvar as anonymous user."""
    _ = db_session
    response = client.put(
        f"{settings.API_V1_STR}/acmgseqvar/update",
        json=acmgseqvar_update_data,
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_update_acmgseqvar_patch(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
    acmgseqvar_update_data: dict[str, Any],
):
    """Test updating a acmgseqvar with invalid data."""
    _ = db_session
    # Create acmgseqvar
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )
    assert response.status_code == 200
    # Update acmgseqvar
    response = client_user.patch(
        f"{settings.API_V1_STR}/acmgseqvar/update",
        json=acmgseqvar_update_data,
    )
    content = response.json()
    assert response.status_code == 200
    assert content["seqvar_name"] == acmgseqvar_update_data["seqvar_name"]
    assert content["acmg_rank"] == acmgseqvar_update_data["acmg_rank"]
    assert content["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_update_acmgseqvar_no_acmgseqvar(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_update_data: dict[str, Any],
):
    """Test updating a acmgseqvar with invalid data."""
    _ = db_session
    response = client_user.put(
        f"{settings.API_V1_STR}/acmgseqvar/update",
        json=acmgseqvar_update_data,
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "ACMG Sequence Variant not found"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_update_acmgseqvar_invalid_enum(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
    acmgseqvar_update_data: dict[str, Any],
):
    """Test updating a acmgseqvar with invalid enums."""
    _ = db_session
    # Create acmgseqvar
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )
    assert response.status_code == 200
    # Update acmgseqvar
    post_data = acmgseqvar_update_data.copy()
    post_data["acmg_rank"]["criterias"][0]["criteria"] = "Pppm4"
    response = client_user.put(
        f"{settings.API_V1_STR}/acmgseqvar/update",
        json=post_data,
    )
    assert response.status_code == 422


# ------------------------------------------------------------------------------
# /api/v1/acmgseqvar/delete-by-id
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_delete_acmgseqvar_by_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
):
    """Test deleting a acmgseqvar by id."""
    _ = db_session
    # Create acmgseqvar
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )

    # Get the acmgseqvar id
    response = client_user.get(f"{settings.API_V1_STR}/acmgseqvar/list")
    acmgseqvar_id = response.json()[0]["id"]

    response = client_user.delete(
        f"{settings.API_V1_STR}/acmgseqvar/delete-by-id?id={acmgseqvar_id}",
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_delete_acmgseqvar_by_id_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
):
    """Test deleting a acmgseqvar by id as superuser."""
    _ = db_session
    # Create acmgseqvar
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )

    # Get the acmgseqvar id
    response = client_user.get(f"{settings.API_V1_STR}/acmgseqvar/list")
    acmgseqvar_id = response.json()[0]["id"]

    response = client_user.delete(
        f"{settings.API_V1_STR}/acmgseqvar/delete-by-id?id={acmgseqvar_id}",
    )
    assert response.status_code == 200
    content = response.json()
    assert content["seqvar_name"] == acmgseqvar_post_data["seqvar_name"]
    assert content["acmg_rank"] == acmgseqvar_post_data["acmg_rank"]
    assert content["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_delete_acmgseqvar_by_id_anon(db_session: AsyncSession, client: TestClient):
    """Test deleting a acmgseqvar by id as anonymous user."""
    _ = db_session
    response = client.delete(
        f"{settings.API_V1_STR}/acmgseqvar/delete-by-id?id={uuid.uuid4()}",
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_delete_acmgseqvar_by_invalid_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a acmgseqvar by id with invalid id."""
    _ = db_session
    response = client_user.delete(
        f"{settings.API_V1_STR}/acmgseqvar/delete-by-id?id={uuid.uuid4()}",
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "ACMG Sequence Variant not found"}


# ------------------------------------------------------------------------------
# /api/v1/acmgseqvar/delete
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_delete_acmgseqvar(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
):
    """Test deleting a acmgseqvar."""
    _ = db_session
    # Create acmgseqvar
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )

    response = client_user.delete(
        f"{settings.API_V1_STR}/acmgseqvar/delete?seqvar={acmgseqvar_post_data['seqvar_name']}",
    )
    assert response.status_code == 200
    content = response.json()
    assert content["seqvar_name"] == acmgseqvar_post_data["seqvar_name"]
    assert content["acmg_rank"] == acmgseqvar_post_data["acmg_rank"]
    assert content["user"] == str(test_user.id)

    # Verify that the acmgseqvar is deleted
    response = client_user.get(
        f"{settings.API_V1_STR}/acmgseqvar/get?seqvar={acmgseqvar_post_data['seqvar_name']}",
    )
    assert response.status_code == 404


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_delete_acmgseqvar_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    acmgseqvar_post_data: dict[str, Any],
):
    """Test deleting a acmgseqvar as superuser."""
    _ = db_session
    # Create acmgseqvar
    response = client_user.post(
        f"{settings.API_V1_STR}/acmgseqvar/create",
        json=acmgseqvar_post_data,
    )

    response = client_user.delete(
        f"{settings.API_V1_STR}/acmgseqvar/delete?seqvar={acmgseqvar_post_data['seqvar_name']}",
    )
    assert response.status_code == 200
    content = response.json()
    assert content["seqvar_name"] == acmgseqvar_post_data["seqvar_name"]
    assert content["acmg_rank"] == acmgseqvar_post_data["acmg_rank"]
    assert content["user"] == str(test_user.id)

    # Verify that the acmgseqvar is deleted
    response = client_user.get(
        f"{settings.API_V1_STR}/acmgseqvar/get?seqvar={acmgseqvar_post_data['seqvar_name']}",
    )
    assert response.status_code == 404


@pytest.mark.anyio
async def test_delete_acmgseqvar_anon(db_session: AsyncSession, client: TestClient):
    """Test deleting a acmgseqvar as anonymous user."""
    _ = db_session
    response = client.delete(
        f"{settings.API_V1_STR}/acmgseqvar/delete?seqvar={uuid.uuid4()}",
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_delete_acmgseqvar_no_acmgseqvar(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a acmgseqvar with invalid data."""
    _ = db_session
    response = client_user.delete(
        f"{settings.API_V1_STR}/acmgseqvar/delete?seqvar=invalid",
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "ACMG Sequence Variant not found"}
