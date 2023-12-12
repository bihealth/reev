import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.user import User

# ------------------------------------------------------------------------------
# /api/v1/caseinfo/create
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_create_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test creating a caseinfo as regular user."""
    _ = db_session
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={
            "pseudonym": "test1",
            "diseases": [{"omim_id": "string", "name": "string"}],
            "hpo_terms": [{"term_id": "string", "name": "string"}],
            "inheritance": "reev:unknown_inheritance",
            "affected_family_members": True,
            "sex": "reev:unknown_sex",
            "age_of_onset_month": 20,
            "ethinicity": "reev:unknown_ethnicity",
            "zygosity": "reev:unknown_zygosity",
            "family_segregation": True,
        },
    )
    assert response.status_code == 200
    assert response.json()["user"] == str(test_user.id)
    assert response.json()["pseudonym"] == "test1"
    assert response.json()["diseases"] == [{"omim_id": "string", "name": "string"}]
    assert response.json()["hpo_terms"] == [{"term_id": "string", "name": "string"}]
    assert response.json()["inheritance"] == "reev:unknown_inheritance"
    assert response.json()["affected_family_members"] == True
    assert response.json()["sex"] == "reev:unknown_sex"
    assert response.json()["age_of_onset_month"] == 20
    assert response.json()["ethinicity"] == "reev:unknown_ethnicity"
    assert response.json()["zygosity"] == "reev:unknown_zygosity"
    assert response.json()["family_segregation"] == True


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_create_caseinfo_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test creating a caseinfo as superuser."""
    _ = db_session
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "type1", "age_of_onset_month": 20},
    )
    assert response.status_code == 200
    assert response.json()["pseudonym"] == "type1"
    assert response.json()["age_of_onset_month"] == 20
    assert response.json()["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_create_caseinfo_anon(db_session: AsyncSession, client: TestClient):
    """Test creating a caseinfo as anonymous user."""
    _ = db_session
    response = client.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "type1", "age_of_onset_month": 20},
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_create_caseinfo_invalid_data(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test creating a caseinfo with invalid data."""
    _ = db_session
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": 33, "age_of_onset_month": [20]},
    )
    assert response.status_code == 422


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_create_caseinfo_invalid_enums(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test creating a caseinfo with invalid enums."""
    _ = db_session
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "inheritance": "invalid_inheritance"},
    )
    assert response.status_code == 422


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_create_caseinfo_invalid_terms(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test creating a caseinfo with invalid terms."""
    _ = db_session
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "diseases": [{"omim_id_invalid": "string"}]},
    )
    assert response.status_code == 422


# ------------------------------------------------------------------------------
# /api/v1/caseinfo/list-all
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_list_all_caseinfos(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing all caseinfos as regular user."""
    _ = db_session
    # Create caseinfo
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    assert response.status_code == 200

    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/list-all/")
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_list_all_caseinfos_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing all caseinfos as superuser."""
    _ = db_session
    # Create caseifo
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    assert response.status_code == 200

    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/list-all/")
    assert response.status_code == 200
    assert response.json()[0]["pseudonym"] == "test1"
    assert response.json()[0]["age_of_onset_month"] == 20
    assert response.json()[0]["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_list_all_caseinfos_anon(db_session: AsyncSession, client: TestClient):
    """Test listing all caseinfos as anonymous user."""
    _ = db_session
    response = client.get(f"{settings.API_V1_STR}/caseinfo/list-all/")
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_list_all_no_caseinfos(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing all caseinfos with no caseinfos."""
    _ = db_session
    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/list-all/")
    assert response.status_code == 200
    assert response.json() == []


# ------------------------------------------------------------------------------
# /api/v1/caseinfo/get-by-id
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_get_caseinfo_by_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a caseinfo by id as regular user."""
    caseinfo_id = uuid.uuid4()
    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/get-by-id?id={caseinfo_id}")
    assert response.status_code == 401  # Forbidden access should be 403


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_get_caseinfo_by_id_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a caseinfo by id as superuser."""
    _ = db_session
    # Create caseifo
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    assert response.status_code == 200
    # Get the caseinfo id
    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/list/")
    caseinfo_id = response.json()[0]["id"]

    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/get-by-id?id={caseinfo_id}")
    assert response.status_code == 200
    assert response.json()["id"] == caseinfo_id


@pytest.mark.anyio
async def test_get_caseinfo_by_id_anon(db_session: AsyncSession, client: TestClient):
    """Test getting a caseinfo by id as anonymous user."""
    _ = db_session
    caseinfo_id = uuid.uuid4()
    response = client.get(f"{settings.API_V1_STR}/caseinfo/get-by-id?id={caseinfo_id}/")
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_get_caseinfo_by_invalid_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a caseinfo by invalid id."""
    caseinfo_id = uuid.uuid4()  # Invalid id
    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/get-by-id?id={caseinfo_id}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Case Information not found"}


# ------------------------------------------------------------------------------
# /api/v1/caseinfo/delete-by-id
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_delete_caseinfo_by_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a caseinfo by id as regular user."""
    # Create a caseinfo
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    assert response.status_code == 200
    # Get the caseinfo id
    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/list/")
    caseinfo_id = response.json()[0]["id"]

    response = client_user.delete(f"{settings.API_V1_STR}/caseinfo/delete-by-id?id={caseinfo_id}")
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}

    # Verify that the caseinfo was not deleted
    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/list/")
    assert response.status_code == 200
    assert response.json()[0]["id"] == caseinfo_id


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_delete_caseinfo_by_id_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a caseinfo by id as superuser."""
    # Create a caseinfo
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    assert response.status_code == 200
    # Get the caseinfo id
    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/list/")
    caseinfo_id = response.json()[0]["id"]

    response = client_user.delete(f"{settings.API_V1_STR}/caseinfo/delete-by-id?id={caseinfo_id}")
    assert response.status_code == 200
    assert response.json()["id"] == caseinfo_id

    # Verify that the caseinfo is indeed deleted
    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/get-by-id?id={caseinfo_id}")
    assert response.status_code == 404  # Not Found


@pytest.mark.anyio
async def test_delete_caseinfo_by_id_anon(db_session: AsyncSession, client: TestClient):
    """Test deleting a caseinfo by id as anonymous user."""
    _ = db_session
    caseinfo_id = uuid.uuid4()
    response = client.delete(f"{settings.API_V1_STR}/caseinfo/delete-by-id?id={caseinfo_id}/")
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_delete_caseinfo_by_invalid_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a caseinfo by invalid id."""
    caseinfo_id = uuid.uuid4()

    response = client_user.delete(f"{settings.API_V1_STR}/caseinfo/delete-by-id?id={caseinfo_id}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Case Information not found"}


# ------------------------------------------------------------------------------
# /api/v1/caseinfo/list
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_list_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing caseinfos as regular user."""
    _ = db_session
    # Create a caseinfo
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    assert response.status_code == 200

    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/list/")
    assert response.status_code == 200
    assert response.json()[0]["pseudonym"] == "test1"
    assert response.json()[0]["age_of_onset_month"] == 20
    assert response.json()[0]["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_list_caseinfo_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing caseinfos as superuser."""
    _ = db_session
    # Create a caseinfo
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    assert response.status_code == 200

    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/list/")
    assert response.status_code == 200
    assert response.json()[0]["pseudonym"] == "test1"
    assert response.json()[0]["age_of_onset_month"] == 20
    assert response.json()[0]["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_list_caseinfo_anon(db_session: AsyncSession, client: TestClient):
    """Test listing caseinfos as anonymous user."""
    _ = db_session
    response = client.get(f"{settings.API_V1_STR}/caseinfo/list/")
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_list_no_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
):
    """Test listing caseinfos with no caseinfos."""
    _ = db_session
    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/list/")
    assert response.status_code == 200
    assert response.json() == []


# ------------------------------------------------------------------------------
# api/v1/caseinfo/get
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_get_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a caseinfo as regular user."""
    _ = db_session
    # Create a caseinfo
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    assert response.status_code == 200

    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/get")
    assert response.status_code == 200
    assert response.json()["pseudonym"] == "test1"
    assert response.json()["age_of_onset_month"] == 20
    assert response.json()["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_get_caseinfo_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a caseinfo as superuser."""
    _ = db_session
    # Create a caseinfo
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    assert response.status_code == 200

    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/get")
    assert response.status_code == 200
    assert response.json()["pseudonym"] == "test1"
    assert response.json()["age_of_onset_month"] == 20
    assert response.json()["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_get_caseinfo_anon(db_session: AsyncSession, client: TestClient):
    """Test getting a caseinfo as anonymous user."""
    _ = db_session
    response = client.get(f"{settings.API_V1_STR}/caseinfo/get")
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_get_no_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
):
    """Test getting a caseinfo with no caseinfos."""
    _ = db_session
    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/get")
    assert response.status_code == 404
    assert response.json() == {"detail": "Case Information not found"}


# ------------------------------------------------------------------------------
# api/v1/caseinfo/update
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_update_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test updating a caseinfo as regular user."""
    _ = db_session
    # Create a caseinfo
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    assert response.status_code == 200

    response = client_user.put(
        f"{settings.API_V1_STR}/caseinfo/update",
        json={"pseudonym": "test2", "age_of_onset_month": 21},
    )
    assert response.status_code == 200
    assert response.json()["pseudonym"] == "test2"
    assert response.json()["age_of_onset_month"] == 21
    assert response.json()["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_update_caseinfo_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test updating a caseinfo as superuser."""
    _ = db_session
    # Create a caseinfo
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    assert response.status_code == 200

    response = client_user.put(
        f"{settings.API_V1_STR}/caseinfo/update",
        json={"pseudonym": "test2", "age_of_onset_month": 21},
    )
    assert response.status_code == 200
    assert response.json()["pseudonym"] == "test2"
    assert response.json()["age_of_onset_month"] == 21
    assert response.json()["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_update_caseinfo_anon(db_session: AsyncSession, client: TestClient):
    """Test updating a caseinfo as anonymous user."""
    _ = db_session
    response = client.put(
        f"{settings.API_V1_STR}/caseinfo/update",
        json={"pseudonym": "test2", "age_of_onset_month": 21},
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_update_caseinfo_patch(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test updating a caseinfo with patch as superuser."""
    _ = db_session
    # Create a caseinfo
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    assert response.status_code == 200

    response = client_user.patch(
        f"{settings.API_V1_STR}/caseinfo/update",
        json={"pseudonym": "test2", "age_of_onset_month": 21},
    )
    assert response.status_code == 200
    assert response.json()["pseudonym"] == "test2"
    assert response.json()["age_of_onset_month"] == 21
    assert response.json()["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_update_no_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
):
    """Test updating a caseinfo with no caseinfos."""
    _ = db_session
    response = client_user.put(
        f"{settings.API_V1_STR}/caseinfo/update",
        json={"pseudonym": "test2", "age_of_onset_month": 21},
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "Case Information not found"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_update_caseinfo_invalid_enum(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test updating a caseinfo with invalid enums."""
    _ = db_session
    # Create a caseinfo
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    assert response.status_code == 200

    response = client_user.put(
        f"{settings.API_V1_STR}/caseinfo/update",
        json={"pseudonym": "test2", "age_of_onset_month": [21], "sex": "invalid_sex"},
    )
    assert response.status_code == 422


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_update_caseinfo_invalid_terms(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test updating a caseinfo with invalid terms."""
    _ = db_session
    # Create a caseinfo
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    assert response.status_code == 200

    response = client_user.put(
        f"{settings.API_V1_STR}/caseinfo/update/",
        json={
            "pseudonym": "test1",
            "age_of_onset_month": 20,
            "diseases": [{"omim_id_invalid": "string"}],
        },
    )
    assert response.status_code == 422


# ------------------------------------------------------------------------------
# api/v1/caseinfo/delete
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_delete_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a caseinfo as regular user."""
    _ = db_session
    # Create a caseinfo
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    assert response.status_code == 200

    response = client_user.delete(f"{settings.API_V1_STR}/caseinfo/delete")
    assert response.status_code == 200
    assert response.json()["pseudonym"] == "test1"

    # Verify that the caseinfo is indeed deleted
    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/get")
    assert response.status_code == 404


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_delete_caseinfo_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a caseinfo as superuser."""
    _ = db_session
    # Create a caseinfo
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    assert response.status_code == 200

    response = client_user.delete(f"{settings.API_V1_STR}/caseinfo/delete")
    assert response.status_code == 200
    assert response.json()["pseudonym"] == "test1"

    # Verify that the caseinfo is indeed deleted
    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/get")
    assert response.status_code == 404


@pytest.mark.anyio
async def test_delete_caseinfo_anon(db_session: AsyncSession, client: TestClient):
    """Test deleting a caseinfo as anonymous user."""
    _ = db_session
    response = client.delete(f"{settings.API_V1_STR}/caseinfo/delete")
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_delete_no_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
):
    """Test deleting a caseinfo with no caseinfos."""
    _ = db_session
    response = client_user.delete(f"{settings.API_V1_STR}/caseinfo/delete")
    assert response.status_code == 404
    assert response.json() == {"detail": "Case Information not found"}
