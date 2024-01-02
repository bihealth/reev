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
# /api/v1/bookmarks/create
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(REGUL, REGUL)], indirect=True)
async def test_create_bookmark(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test creating a bookmark as regular user."""
    _ = db_session
    # act:
    response = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    # assert:
    assert response.status_code == 200
    assert response.json()["obj_type"] == "gene"
    assert response.json()["obj_id"] == "exampleGene"
    assert response.json()["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_create_bookmark_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test creating a bookmark as superuser."""
    _ = db_session
    # act:
    response = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    # assert:
    assert response.status_code == 200
    assert response.json()["obj_type"] == "gene"
    assert response.json()["obj_id"] == "exampleGene"
    assert response.json()["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_create_bookmark_anon(db_session: AsyncSession, client: TestClient):
    """Test creating a bookmark as anonymous user."""
    _ = db_session
    # act:
    response = client.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_create_bookmark_invalid_data(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test creating a bookmark with invalid data."""
    _ = db_session
    _ = test_user
    # act:
    response = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "invalid", "obj_id": "invalid"},
    )
    # assert:
    assert response.status_code == 422


# ------------------------------------------------------------------------------
# api/v1/bookmarks/list-all
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(REGUL, REGUL)], indirect=True)
async def test_list_all_bookmarks(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing all bookmarks as regular user."""
    _ = db_session
    _ = test_user
    # act:
    # Create a bookmark
    response_create = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    response_list_all = client_user.get(f"{settings.API_V1_STR}/bookmarks/list-all/")
    # assert:s
    assert response_create.status_code == 200
    assert response_list_all.status_code == 401
    assert response_list_all.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_list_all_bookmarks_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing all bookmarks as superuser."""
    _ = db_session
    # act:
    # Create a bookmark
    response_create = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    response_list_all = client_user.get(f"{settings.API_V1_STR}/bookmarks/list-all/")
    # assert:
    assert response_create.status_code == 200
    assert response_list_all.status_code == 200
    assert response_list_all.json()[0]["obj_type"] == "gene"
    assert response_list_all.json()[0]["obj_id"] == "exampleGene"
    assert response_list_all.json()[0]["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_list_all_bookmarks_anon(db_session: AsyncSession, client: TestClient):
    """Test listing all bookmarks as anonymous user."""
    _ = db_session
    # act:
    response = client.get(f"{settings.API_V1_STR}/bookmarks/list-all/")
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_list_all_no_bookmarks(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing all bookmarks as superuser when there are no bookmarks."""
    _ = db_session
    _ = test_user
    # act:
    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/list-all/")
    # assert:
    assert response.status_code == 200
    assert response.json() == []


# ------------------------------------------------------------------------------
# api/v1/bookmarks/get-by-id
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(REGUL, REGUL)], indirect=True)
async def test_get_bookmark_by_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a bookmark by id as regular user."""
    _ = db_session
    _ = test_user
    # arrange:
    bookmark_id = uuid.uuid4()
    # act:
    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/get-by-id?id={bookmark_id}")
    # assert:
    assert response.status_code == 401  # Forbidden access should be 403


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_get_bookmark_by_id_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a bookmark by id as superuser."""
    _ = db_session
    _ = test_user
    # act:
    # Create a bookmark
    response_create = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    # Get the bookmark id
    response_list = client_user.get(f"{settings.API_V1_STR}/bookmarks/list/")
    bookmark_id = response_list.json()[0]["id"]
    response_get_by_id = client_user.get(
        f"{settings.API_V1_STR}/bookmarks/get-by-id?id={bookmark_id}"
    )
    # assert:
    assert response_create.status_code == 200
    assert response_get_by_id.status_code == 200
    assert response_get_by_id.json()["id"] == bookmark_id


@pytest.mark.anyio
async def test_get_bookmark_by_id_anon(db_session: AsyncSession, client: TestClient):
    """Test getting a bookmark by id as anonymous user."""
    _ = db_session
    # arrange:
    bookmark_id = uuid.uuid4()
    # act:
    response = client.get(f"{settings.API_V1_STR}/bookmarks/get-by-id?id={bookmark_id}/")
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_get_bookmark_by_invalid_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a bookmark by invalid id as superuser."""
    _ = db_session
    _ = test_user
    # arrange:
    bookmark_id = uuid.uuid4()  # Invalid id
    # act:
    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/get-by-id?id={bookmark_id}")
    # assert:
    assert response.status_code == 404
    assert response.json() == {"detail": "Bookmark not found"}


# ------------------------------------------------------------------------------
# api/v1/bookmarks/delete-by-id
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(REGUL, REGUL)], indirect=True)
async def test_delete_bookmark_by_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a bookmark by id as regular user."""
    _ = db_session
    _ = test_user
    # act:
    # Create a bookmark
    response_create = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    # Get the bookmark id
    response_list = client_user.get(f"{settings.API_V1_STR}/bookmarks/list/")
    bookmark_id = response_list.json()[0]["id"]
    response_delete_by_id = client_user.delete(
        f"{settings.API_V1_STR}/bookmarks/delete-by-id?id={bookmark_id}"
    )
    # Verify that the bookmark was not deleted
    response_list = client_user.get(f"{settings.API_V1_STR}/bookmarks/list/")
    # assert:
    assert response_create.status_code == 200
    assert response_delete_by_id.status_code == 401
    assert response_delete_by_id.json() == {"detail": "Unauthorized"}
    assert response_list.status_code == 200
    assert response_list.json()[0]["id"] == bookmark_id


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_delete_bookmark_by_id_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a bookmark by id as superuser."""
    _ = db_session
    _ = test_user
    # act:
    # Create a bookmark
    response_creat = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    # Get the bookmark id
    response_list = client_user.get(f"{settings.API_V1_STR}/bookmarks/list/")
    bookmark_id = response_list.json()[0]["id"]
    response_delete = client_user.delete(
        f"{settings.API_V1_STR}/bookmarks/delete-by-id?id={bookmark_id}"
    )
    # Verify that the bookmark is indeed deleted
    response_get_by_id = client_user.get(
        f"{settings.API_V1_STR}/bookmarks/get-by-id?id={bookmark_id}"
    )
    # assert:
    assert response_creat.status_code == 200
    assert response_delete.status_code == 200
    assert response_delete.json()["id"] == bookmark_id
    assert response_get_by_id.status_code == 404  # Not Found


@pytest.mark.anyio
async def test_delete_bookmark_by_id_anon(db_session: AsyncSession, client: TestClient):
    """Test deleting a bookmark by id as anonymous user."""
    _ = db_session
    # arrange:
    bookmark_id = uuid.uuid4()
    # act:
    response = client.delete(f"{settings.API_V1_STR}/bookmarks/delete-by-id?id={bookmark_id}/")
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_delete_bookmark_by_invalid_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a bookmark by invalid id as superuser."""
    _ = db_session
    _ = test_user
    # arrange:
    bookmark_id = uuid.uuid4()
    # act:
    response = client_user.delete(f"{settings.API_V1_STR}/bookmarks/delete-by-id?id={bookmark_id}")
    # assert:
    assert response.status_code == 404
    assert response.json() == {"detail": "Bookmark not found"}


# ------------------------------------------------------------------------------
# api/v1/bookmarks/list
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(REGUL, REGUL)], indirect=True)
async def test_list_bookmarks(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing bookmarks as regular user."""
    _ = db_session
    # arrange:
    # Create a bookmark
    response_create = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    response_list = client_user.get(f"{settings.API_V1_STR}/bookmarks/list/")
    # assert:
    assert response_create.status_code == 200
    assert response_list.status_code == 200
    assert response_list.json()[0]["obj_type"] == "gene"
    assert response_list.json()[0]["obj_id"] == "exampleGene"
    assert response_list.json()[0]["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_list_bookmarks_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing bookmarks as superuser."""
    _ = db_session
    # act:
    # Create a bookmark
    response_create = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    response_list = client_user.get(f"{settings.API_V1_STR}/bookmarks/list/")
    # assert:
    assert response_create.status_code == 200
    assert response_list.status_code == 200
    assert response_list.json()[0]["obj_type"] == "gene"
    assert response_list.json()[0]["obj_id"] == "exampleGene"
    assert response_list.json()[0]["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_list_bookmarks_anon(db_session: AsyncSession, client: TestClient):
    """Test listing bookmarks as anonymous user."""
    _ = db_session
    # act:
    response = client.get(f"{settings.API_V1_STR}/bookmarks/list/")
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_list_no_bookmarks(
    db_session: AsyncSession,
    client_user: TestClient,
):
    """Test listing bookmarks as superuser when there are no bookmarks."""
    _ = db_session
    # act:
    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/list/")
    # assert:
    assert response.status_code == 200
    assert response.json() == []


# ------------------------------------------------------------------------------
# api/v1/bookmarks/get
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(REGUL, REGUL)], indirect=True)
async def test_get_bookmark(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a bookmark as regular user."""
    _ = db_session
    # act:
    # Create a bookmark
    response_create = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    response_get = client_user.get(
        f"{settings.API_V1_STR}/bookmarks/get?obj_type=gene&obj_id=exampleGene"
    )
    # assert:
    assert response_create.status_code == 200
    assert response_get.status_code == 200
    assert response_get.json()["obj_type"] == "gene"
    assert response_get.json()["obj_id"] == "exampleGene"
    assert response_get.json()["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_get_bookmark_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a bookmark as superuser."""
    _ = db_session
    # act:
    # Create a bookmark
    response_create = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    response_get = client_user.get(
        f"{settings.API_V1_STR}/bookmarks/get?obj_type=gene&obj_id=exampleGene"
    )
    # assert:
    assert response_create.status_code == 200
    assert response_get.status_code == 200
    assert response_get.json()["obj_type"] == "gene"
    assert response_get.json()["obj_id"] == "exampleGene"
    assert response_get.json()["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_get_bookmark_anon(db_session: AsyncSession, client: TestClient):
    """Test getting a bookmark as anonymous user."""
    _ = db_session
    # act:
    response = client.get(f"{settings.API_V1_STR}/bookmarks/get?obj_type=gene&obj_id=exampleGene")
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_get_no_bookmarks(
    db_session: AsyncSession,
    client_user: TestClient,
):
    """Test getting a bookmark as superuser when there are no bookmarks."""
    _ = db_session
    # act:
    response = client_user.get(
        f"{settings.API_V1_STR}/bookmarks/get?obj_type=gene&obj_id=exampleGene"
    )
    # assert:
    assert response.status_code == 404
    assert response.json() == {"detail": "Bookmark not found"}


# ------------------------------------------------------------------------------
# api/v1/bookmarks/delete
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(REGUL, REGUL)], indirect=True)
async def test_delete_bookmark(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a bookmark as regular user."""
    _ = db_session
    # act:
    # Create a bookmark
    response_create = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    response_delete = client_user.delete(
        f"{settings.API_V1_STR}/bookmarks/delete?obj_type=gene&obj_id=exampleGene"
    )
    # Verify that the bookmark is indeed deleted
    response_get = client_user.get(
        f"{settings.API_V1_STR}/bookmarks/get?obj_type=gene&obj_id=exampleGene"
    )
    # assert:
    assert response_delete.status_code == 200
    assert response_delete.json()["obj_type"] == "gene"
    assert response_get.status_code == 404


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_delete_bookmark_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a bookmark as superuser."""
    _ = db_session
    # act:
    # Create a bookmark
    response_create = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    response_delete = client_user.delete(
        f"{settings.API_V1_STR}/bookmarks/delete?obj_type=gene&obj_id=exampleGene"
    )
    # Verify that the bookmark is indeed deleted
    response_get = client_user.get(
        f"{settings.API_V1_STR}/bookmarks/get?obj_type=gene&obj_id=exampleGene"
    )
    # assert:
    assert response_delete.status_code == 200
    assert response_delete.json()["obj_type"] == "gene"
    assert response_get.status_code == 404


@pytest.mark.anyio
async def test_delete_bookmark_anon(db_session: AsyncSession, client: TestClient):
    """Test deleting a bookmark as anonymous user."""
    _ = db_session
    # act:
    response = client.delete(
        f"{settings.API_V1_STR}/bookmarks/delete?obj_type=gene&obj_id=exampleGene"
    )
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_delete_no_bookmarks(
    db_session: AsyncSession,
    client_user: TestClient,
):
    """Test deleting a bookmark as superuser when there are no bookmarks."""
    _ = db_session
    # act:
    response = client_user.delete(
        f"{settings.API_V1_STR}/bookmarks/delete?obj_type=gene&obj_id=exampleGene"
    )
    # assert:
    assert response.status_code == 404
    assert response.json() == {"detail": "Bookmark not found"}
