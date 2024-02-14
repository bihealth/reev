import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.user import User
from tests.conftest import UserChoice

#: Shortcut for regular user.
REGUL = UserChoice.REGULAR
#: Shortcut for superuser.
SUPER = UserChoice.SUPERUSER

# ------------------------------------------------------------------------------
# /api/v1/caseinfo/create
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(REGUL, REGUL)], indirect=True)
async def test_create_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test creating a caseinfo as regular user."""
    _ = db_session
    # act:
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={
            "pseudonym": "test1",
            "diseases": [{"omimId": "string", "name": "string"}],
            "hpo_terms": [{"termId": "string", "name": "string"}],
            "inheritance": "reev:unknown_inheritance",
            "affected_family_members": True,
            "sex": "reev:unknown_sex",
            "age_of_onset_month": 20,
            "ethnicity": "reev:unknown_ethnicity",
            "zygosity": "reev:unknown_zygosity",
            "family_segregation": True,
        },
    )
    # assert:
    assert response.status_code == 200
    assert response.json()["user"] == str(test_user.id)
    assert response.json()["pseudonym"] == "test1"
    assert response.json()["diseases"] == [{"omimId": "string", "name": "string"}]
    assert response.json()["hpo_terms"] == [{"termId": "string", "name": "string"}]
    assert response.json()["inheritance"] == "reev:unknown_inheritance"
    assert response.json()["affected_family_members"] == True
    assert response.json()["sex"] == "reev:unknown_sex"
    assert response.json()["age_of_onset_month"] == 20
    assert response.json()["ethnicity"] == "reev:unknown_ethnicity"
    assert response.json()["zygosity"] == "reev:unknown_zygosity"
    assert response.json()["family_segregation"] == True


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_create_caseinfo_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test creating a caseinfo as superuser."""
    _ = db_session
    # act:
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "type1", "age_of_onset_month": 20},
    )
    # assert:
    assert response.status_code == 200
    assert response.json()["pseudonym"] == "type1"
    assert response.json()["age_of_onset_month"] == 20
    assert response.json()["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_create_caseinfo_anon(db_session: AsyncSession, client: TestClient):
    """Test creating a caseinfo as anonymous user."""
    _ = db_session
    # act:
    response = client.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "type1", "age_of_onset_month": 20},
    )
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_create_caseinfo_invalid_data(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test creating a caseinfo with invalid data."""
    _ = db_session
    # act:
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": 33, "age_of_onset_month": [20]},
    )
    # assert:
    assert response.status_code == 422


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_create_caseinfo_invalid_enums(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test creating a caseinfo with invalid enums."""
    _ = db_session
    # act:
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "inheritance": "invalid_inheritance"},
    )
    # assert:
    assert response.status_code == 422


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_create_caseinfo_invalid_terms(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test creating a caseinfo with invalid terms."""
    _ = db_session
    # act:
    response = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "diseases": [{"omimId_invalid": "string"}]},
    )
    # assert:
    assert response.status_code == 422


# ------------------------------------------------------------------------------
# /api/v1/caseinfo/list-all
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(REGUL, REGUL)], indirect=True)
async def test_list_all_caseinfos(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing all caseinfos as regular user."""
    _ = db_session
    # act:
    response_create = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    response_list_all = client_user.get(f"{settings.API_V1_STR}/caseinfo/list-all/")
    # assert:
    assert response_create.status_code == 200
    assert response_list_all.status_code == 401
    assert response_list_all.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_list_all_caseinfos_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing all caseinfos as superuser."""
    _ = db_session
    # act:
    response_create = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    response_list_all = client_user.get(f"{settings.API_V1_STR}/caseinfo/list-all/")
    # assert:
    assert response_create.status_code == 200
    assert response_list_all.status_code == 200
    assert response_list_all.json()[0]["pseudonym"] == "test1"
    assert response_list_all.json()[0]["age_of_onset_month"] == 20
    assert response_list_all.json()[0]["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_list_all_caseinfos_anon(db_session: AsyncSession, client: TestClient):
    """Test listing all caseinfos as anonymous user."""
    _ = db_session
    # act:
    response = client.get(f"{settings.API_V1_STR}/caseinfo/list-all/")
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_list_all_no_caseinfos(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing all caseinfos with no caseinfos."""
    _ = db_session
    _ = test_user
    # act:
    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/list-all/")
    # assert:
    assert response.status_code == 200
    assert response.json() == []


# ------------------------------------------------------------------------------
# /api/v1/caseinfo/get-by-id
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(REGUL, REGUL)], indirect=True)
async def test_get_caseinfo_by_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a caseinfo by id as regular user."""
    _ = db_session
    _ = test_user
    # arrange:
    caseinfo_id = uuid.uuid4()
    # act:
    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/get-by-id?id={caseinfo_id}")
    # assert:
    assert response.status_code == 401  # Forbidden access should be 403


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_get_caseinfo_by_id_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a caseinfo by id as superuser."""
    _ = db_session
    _ = test_user
    # act:
    response_create = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    response_list = client_user.get(f"{settings.API_V1_STR}/caseinfo/list/")
    caseinfo_id = response_list.json()[0]["id"]
    response_get_by_id = client_user.get(
        f"{settings.API_V1_STR}/caseinfo/get-by-id?id={caseinfo_id}"
    )
    # assert:
    assert response_create.status_code == 200
    assert response_get_by_id.status_code == 200
    assert response_get_by_id.json()["id"] == caseinfo_id


@pytest.mark.anyio
async def test_get_caseinfo_by_id_anon(db_session: AsyncSession, client: TestClient):
    """Test getting a caseinfo by id as anonymous user."""
    _ = db_session
    # arrange:
    caseinfo_id = uuid.uuid4()
    # act:
    response = client.get(f"{settings.API_V1_STR}/caseinfo/get-by-id?id={caseinfo_id}/")
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_get_caseinfo_by_invalid_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a caseinfo by invalid id."""
    # arrange:
    caseinfo_id = uuid.uuid4()  # Invalid id
    # act:
    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/get-by-id?id={caseinfo_id}")
    # assert:
    assert response.status_code == 404
    assert response.json() == {"detail": "Case Information not found"}


# ------------------------------------------------------------------------------
# /api/v1/caseinfo/delete-by-id
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(REGUL, REGUL)], indirect=True)
async def test_delete_caseinfo_by_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a caseinfo by id as regular user."""
    _ = db_session
    _ = test_user
    # act:
    # Create a caseinfo
    response_create = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    # Get the caseinfo id
    response_list = client_user.get(f"{settings.API_V1_STR}/caseinfo/list/")
    caseinfo_id = response_list.json()[0]["id"]
    response_delete = client_user.delete(
        f"{settings.API_V1_STR}/caseinfo/delete-by-id?id={caseinfo_id}"
    )
    # Verify that the caseinfo was not deleted
    response_list2 = client_user.get(f"{settings.API_V1_STR}/caseinfo/list/")
    # assert:
    assert response_create.status_code == 200
    assert response_delete.status_code == 401
    assert response_delete.json() == {"detail": "Unauthorized"}
    assert response_list2.status_code == 200
    assert response_list2.json()[0]["id"] == caseinfo_id


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_delete_caseinfo_by_id_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a caseinfo by id as superuser."""
    _ = db_session
    _ = test_user
    # act:
    # Create a caseinfo
    response_create = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    # Get the caseinfo id
    response_list = client_user.get(f"{settings.API_V1_STR}/caseinfo/list/")
    caseinfo_id = response_list.json()[0]["id"]
    response_delete = client_user.delete(
        f"{settings.API_V1_STR}/caseinfo/delete-by-id?id={caseinfo_id}"
    )
    # Verify that the caseinfo is indeed deleted
    response_get_by_id = client_user.get(
        f"{settings.API_V1_STR}/caseinfo/get-by-id?id={caseinfo_id}"
    )
    # act:
    assert response_create.status_code == 200
    assert response_delete.status_code == 200
    assert response_delete.json()["id"] == caseinfo_id
    assert response_get_by_id.status_code == 404  # Not Found


@pytest.mark.anyio
async def test_delete_caseinfo_by_id_anon(db_session: AsyncSession, client: TestClient):
    """Test deleting a caseinfo by id as anonymous user."""
    _ = db_session
    # arrange:
    caseinfo_id = uuid.uuid4()
    # act:
    response = client.delete(f"{settings.API_V1_STR}/caseinfo/delete-by-id?id={caseinfo_id}/")
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_delete_caseinfo_by_invalid_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a caseinfo by invalid id."""
    # arrange:
    caseinfo_id = uuid.uuid4()
    # act:
    response = client_user.delete(f"{settings.API_V1_STR}/caseinfo/delete-by-id?id={caseinfo_id}")
    # assert:
    assert response.status_code == 404
    assert response.json() == {"detail": "Case Information not found"}


# ------------------------------------------------------------------------------
# /api/v1/caseinfo/list
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(REGUL, REGUL)], indirect=True)
async def test_list_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing caseinfos as regular user."""
    _ = db_session
    # act:
    # Create a caseinfo
    response_create = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    response_list = client_user.get(f"{settings.API_V1_STR}/caseinfo/list/")
    # assert:
    assert response_create.status_code == 200
    assert response_list.status_code == 200
    assert response_list.json()[0]["pseudonym"] == "test1"
    assert response_list.json()[0]["age_of_onset_month"] == 20
    assert response_list.json()[0]["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_list_caseinfo_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing caseinfos as superuser."""
    _ = db_session
    # act:
    # Create a caseinfo
    response_crate = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    response_list = client_user.get(f"{settings.API_V1_STR}/caseinfo/list/")
    # assert:
    assert response_crate.status_code == 200
    assert response_list.status_code == 200
    assert response_list.json()[0]["pseudonym"] == "test1"
    assert response_list.json()[0]["age_of_onset_month"] == 20
    assert response_list.json()[0]["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_list_caseinfo_anon(db_session: AsyncSession, client: TestClient):
    """Test listing caseinfos as anonymous user."""
    _ = db_session
    # act:
    response = client.get(f"{settings.API_V1_STR}/caseinfo/list/")
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_list_no_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
):
    """Test listing caseinfos with no caseinfos."""
    _ = db_session
    # act:
    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/list/")
    # assert:
    assert response.status_code == 200
    assert response.json() == []


# ------------------------------------------------------------------------------
# api/v1/caseinfo/get
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(REGUL, REGUL)], indirect=True)
async def test_get_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a caseinfo as regular user."""
    _ = db_session
    # act:
    # Create a caseinfo
    response_create = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    response_get = client_user.get(f"{settings.API_V1_STR}/caseinfo/get")
    # assert:
    assert response_create.status_code == 200
    assert response_get.status_code == 200
    assert response_get.json()["pseudonym"] == "test1"
    assert response_get.json()["age_of_onset_month"] == 20
    assert response_get.json()["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_get_caseinfo_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a caseinfo as superuser."""
    _ = db_session
    # act:
    # Create a caseinfo
    response_create = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    response_get = client_user.get(f"{settings.API_V1_STR}/caseinfo/get")
    # assert:
    assert response_create.status_code == 200
    assert response_get.status_code == 200
    assert response_get.json()["pseudonym"] == "test1"
    assert response_get.json()["age_of_onset_month"] == 20
    assert response_get.json()["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_get_caseinfo_anon(db_session: AsyncSession, client: TestClient):
    """Test getting a caseinfo as anonymous user."""
    _ = db_session
    # act:
    response = client.get(f"{settings.API_V1_STR}/caseinfo/get")
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_get_no_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
):
    """Test getting a caseinfo with no caseinfos."""
    _ = db_session
    # act:
    response = client_user.get(f"{settings.API_V1_STR}/caseinfo/get")
    # assert:
    assert response.status_code == 404
    assert response.json() == {"detail": "Case Information not found"}


# ------------------------------------------------------------------------------
# api/v1/caseinfo/update
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(REGUL, REGUL)], indirect=True)
async def test_update_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test updating a caseinfo as regular user."""
    _ = db_session
    # Create a caseinfo
    # act:
    response_create = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    response_update = client_user.put(
        f"{settings.API_V1_STR}/caseinfo/update",
        json={"pseudonym": "test2", "age_of_onset_month": 21},
    )
    # assert:
    assert response_create.status_code == 200
    assert response_update.status_code == 200
    assert response_update.json()["pseudonym"] == "test2"
    assert response_update.json()["age_of_onset_month"] == 21
    assert response_update.json()["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_update_caseinfo_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test updating a caseinfo as superuser."""
    _ = db_session
    # act:
    # Create a caseinfo
    response_create = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    response_update = client_user.put(
        f"{settings.API_V1_STR}/caseinfo/update",
        json={"pseudonym": "test2", "age_of_onset_month": 21},
    )
    # assert:
    assert response_create.status_code == 200
    assert response_update.status_code == 200
    assert response_update.json()["pseudonym"] == "test2"
    assert response_update.json()["age_of_onset_month"] == 21
    assert response_update.json()["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_update_caseinfo_anon(db_session: AsyncSession, client: TestClient):
    """Test updating a caseinfo as anonymous user."""
    _ = db_session
    # act:
    response = client.put(
        f"{settings.API_V1_STR}/caseinfo/update",
        json={"pseudonym": "test2", "age_of_onset_month": 21},
    )
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_update_caseinfo_patch(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test updating a caseinfo with patch as superuser."""
    _ = db_session
    # act:
    # Create a caseinfo
    response_create = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    response_update = client_user.patch(
        f"{settings.API_V1_STR}/caseinfo/update",
        json={"pseudonym": "test2", "age_of_onset_month": 21},
    )
    # assert:
    assert response_create.status_code == 200
    assert response_update.status_code == 200
    assert response_update.json()["pseudonym"] == "test2"
    assert response_update.json()["age_of_onset_month"] == 21
    assert response_update.json()["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_update_no_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
):
    """Test updating a caseinfo with no caseinfos."""
    _ = db_session
    # act:
    response = client_user.put(
        f"{settings.API_V1_STR}/caseinfo/update",
        json={"pseudonym": "test2", "age_of_onset_month": 21},
    )
    # assert:
    assert response.status_code == 404
    assert response.json() == {"detail": "Case Information not found"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_update_caseinfo_invalid_enum(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test updating a caseinfo with invalid enums."""
    _ = db_session
    _ = test_user
    # act:
    # Create a caseinfo
    response_create = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    response = client_user.put(
        f"{settings.API_V1_STR}/caseinfo/update",
        json={"pseudonym": "test2", "age_of_onset_month": [21], "sex": "invalid_sex"},
    )
    # assert:
    assert response_create.status_code == 200
    assert response.status_code == 422


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_update_caseinfo_invalid_terms(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test updating a caseinfo with invalid terms."""
    _ = db_session
    _ = test_user
    # act:
    # Create a caseinfo
    response_create = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    response_update = client_user.put(
        f"{settings.API_V1_STR}/caseinfo/update/",
        json={
            "pseudonym": "test1",
            "age_of_onset_month": 20,
            "diseases": [{"omimId_invalid": "string"}],
        },
    )
    # assert:
    assert response_create.status_code == 200
    assert response_update.status_code == 422


# ------------------------------------------------------------------------------
# api/v1/caseinfo/delete
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(REGUL, REGUL)], indirect=True)
async def test_delete_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a caseinfo as regular user."""
    _ = db_session
    _ = test_user
    # act:
    # Create a caseinfo
    response_create = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    response_delete = client_user.delete(f"{settings.API_V1_STR}/caseinfo/delete")
    # Verify that the caseinfo is indeed deleted
    response_get = client_user.get(f"{settings.API_V1_STR}/caseinfo/get")
    # assert:
    assert response_create.status_code == 200
    assert response_delete.status_code == 200
    assert response_delete.json()["pseudonym"] == "test1"
    assert response_get.status_code == 404


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_delete_caseinfo_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a caseinfo as superuser."""
    _ = db_session
    _ = test_user
    # act:
    # Create a caseinfo
    response_create = client_user.post(
        f"{settings.API_V1_STR}/caseinfo/create/",
        json={"pseudonym": "test1", "age_of_onset_month": 20},
    )
    response_delete = client_user.delete(f"{settings.API_V1_STR}/caseinfo/delete")
    # Verify that the caseinfo is indeed deleted
    response_get = client_user.get(f"{settings.API_V1_STR}/caseinfo/get")

    # assert:
    assert response_create.status_code == 200
    assert response_delete.status_code == 200
    assert response_delete.json()["pseudonym"] == "test1"
    assert response_get.status_code == 404


@pytest.mark.anyio
async def test_delete_caseinfo_anon(db_session: AsyncSession, client: TestClient):
    """Test deleting a caseinfo as anonymous user."""
    _ = db_session
    # act:
    response = client.delete(f"{settings.API_V1_STR}/caseinfo/delete")
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_delete_no_caseinfo(
    db_session: AsyncSession,
    client_user: TestClient,
):
    """Test deleting a caseinfo with no caseinfos."""
    _ = db_session
    # act:
    response = client_user.delete(f"{settings.API_V1_STR}/caseinfo/delete")
    # assert:
    assert response.status_code == 404
    assert response.json() == {"detail": "Case Information not found"}
