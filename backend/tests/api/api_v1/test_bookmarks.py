import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.user import User

# ------------------------------------------------------------------------------
# /api/v1/bookmarks/create
# ------------------------------------------------------------------------------


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_create_bookmark(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test creating a bookmark as regular user."""
    _ = db_session
    response = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    assert response.status_code == 200
    assert response.json()["obj_type"] == "gene"
    assert response.json()["obj_id"] == "exampleGene"
    assert response.json()["user"] == str(test_user.id)


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_create_bookmark_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test creating a bookmark as superuser."""
    _ = db_session
    response = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    assert response.status_code == 200
    assert response.json()["obj_type"] == "gene"
    assert response.json()["obj_id"] == "exampleGene"
    assert response.json()["user"] == str(test_user.id)


@pytest.mark.asyncio
async def test_create_bookmark_anon(db_session: AsyncSession, client: TestClient):
    """Test creating a bookmark as anonymous user."""
    _ = db_session
    response = client.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_create_bookmark_invalid_data(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test creating a bookmark with invalid data."""
    _ = db_session
    response = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "invalid", "obj_id": "invalid"},
    )
    assert response.status_code == 422


# ------------------------------------------------------------------------------
# api/v1/bookmarks/list-all
# ------------------------------------------------------------------------------


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_list_all_bookmarks(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing all bookmarks as regular user."""
    _ = db_session
    # Create a bookmark
    response = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    assert response.status_code == 200

    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/list-all/")
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_list_all_bookmarks_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing all bookmarks as superuser."""
    _ = db_session
    # Create a bookmark
    response = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    assert response.status_code == 200

    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/list-all/")
    assert response.status_code == 200
    assert response.json()[0]["obj_type"] == "gene"
    assert response.json()[0]["obj_id"] == "exampleGene"
    assert response.json()[0]["user"] == str(test_user.id)


@pytest.mark.asyncio
async def test_list_all_bookmarks_anon(db_session: AsyncSession, client: TestClient):
    """Test listing all bookmarks as anonymous user."""
    _ = db_session
    response = client.get(f"{settings.API_V1_STR}/bookmarks/list-all/")
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_list_all_no_bookmarks(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing all bookmarks as superuser when there are no bookmarks."""
    _ = db_session
    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/list-all/")
    assert response.status_code == 200
    assert response.json() == []


# ------------------------------------------------------------------------------
# api/v1/bookmarks/get-by-id
# ------------------------------------------------------------------------------


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_get_bookmark_by_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a bookmark by id as regular user."""
    bookmark_id = uuid.uuid4()
    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/get-by-id?id={bookmark_id}")
    assert response.status_code == 401  # Forbidden access should be 403


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_get_bookmark_by_id_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a bookmark by id as superuser."""
    # Create a bookmark
    response = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    assert response.status_code == 200
    # Get the bookmark id
    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/list/")
    bookmark_id = response.json()[0]["id"]

    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/get-by-id?id={bookmark_id}")
    assert response.status_code == 200
    assert response.json()["id"] == bookmark_id


@pytest.mark.asyncio
async def test_get_bookmark_by_id_anon(db_session: AsyncSession, client: TestClient):
    """Test getting a bookmark by id as anonymous user."""
    _ = db_session
    bookmark_id = uuid.uuid4()
    response = client.get(f"{settings.API_V1_STR}/bookmarks/get-by-id?id={bookmark_id}/")
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_get_bookmark_by_invalid_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a bookmark by invalid id as superuser."""
    bookmark_id = uuid.uuid4()  # Invalid id
    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/get-by-id?id={bookmark_id}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Bookmark not found"}


# ------------------------------------------------------------------------------
# api/v1/bookmarks/delete-by-id
# ------------------------------------------------------------------------------


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_delete_bookmark_by_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a bookmark by id as regular user."""
    # Create a bookmark
    response = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    assert response.status_code == 200
    # Get the bookmark id
    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/list/")
    bookmark_id = response.json()[0]["id"]

    response = client_user.delete(f"{settings.API_V1_STR}/bookmarks/delete-by-id?id={bookmark_id}")
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}

    # Verify that the bookmark was not deleted
    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/list/")
    assert response.status_code == 200
    assert response.json()[0]["id"] == bookmark_id


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_delete_bookmark_by_id_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a bookmark by id as superuser."""
    # Create a bookmark
    response = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    assert response.status_code == 200
    # Get the bookmark id
    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/list/")
    bookmark_id = response.json()[0]["id"]

    response = client_user.delete(f"{settings.API_V1_STR}/bookmarks/delete-by-id?id={bookmark_id}")
    assert response.status_code == 200
    assert response.json()["id"] == bookmark_id

    # Verify that the bookmark is indeed deleted
    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/get-by-id?id={bookmark_id}")
    assert response.status_code == 404  # Not Found


@pytest.mark.asyncio
async def test_delete_bookmark_by_id_anon(db_session: AsyncSession, client: TestClient):
    """Test deleting a bookmark by id as anonymous user."""
    _ = db_session
    bookmark_id = uuid.uuid4()
    response = client.delete(f"{settings.API_V1_STR}/bookmarks/delete-by-id?id={bookmark_id}/")
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_delete_bookmark_by_invalid_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a bookmark by invalid id as superuser."""
    bookmark_id = uuid.uuid4()

    response = client_user.delete(f"{settings.API_V1_STR}/bookmarks/delete-by-id?id={bookmark_id}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Bookmark not found"}


# ------------------------------------------------------------------------------
# api/v1/bookmarks/list
# ------------------------------------------------------------------------------


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_list_bookmarks(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing bookmarks as regular user."""
    _ = db_session
    # Create a bookmark
    response = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    assert response.status_code == 200

    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/list/")
    assert response.status_code == 200
    assert response.json()[0]["obj_type"] == "gene"
    assert response.json()[0]["obj_id"] == "exampleGene"
    assert response.json()[0]["user"] == str(test_user.id)


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_list_bookmarks_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing bookmarks as superuser."""
    _ = db_session
    # Create a bookmark
    response = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    assert response.status_code == 200

    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/list/")
    assert response.status_code == 200
    assert response.json()[0]["obj_type"] == "gene"
    assert response.json()[0]["obj_id"] == "exampleGene"
    assert response.json()[0]["user"] == str(test_user.id)


@pytest.mark.asyncio
async def test_list_bookmarks_anon(db_session: AsyncSession, client: TestClient):
    """Test listing bookmarks as anonymous user."""
    _ = db_session
    response = client.get(f"{settings.API_V1_STR}/bookmarks/list/")
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_list_no_bookmarks(
    db_session: AsyncSession,
    client_user: TestClient,
):
    """Test listing bookmarks as superuser when there are no bookmarks."""
    _ = db_session
    response = client_user.get(f"{settings.API_V1_STR}/bookmarks/list/")
    assert response.status_code == 200
    assert response.json() == []


# ------------------------------------------------------------------------------
# api/v1/bookmarks/get
# ------------------------------------------------------------------------------


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_get_bookmark(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a bookmark as regular user."""
    _ = db_session
    # Create a bookmark
    response = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    assert response.status_code == 200

    response = client_user.get(
        f"{settings.API_V1_STR}/bookmarks/get?obj_type=gene&obj_id=exampleGene"
    )
    assert response.status_code == 200
    assert response.json()["obj_type"] == "gene"
    assert response.json()["obj_id"] == "exampleGene"
    assert response.json()["user"] == str(test_user.id)


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_get_bookmark_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a bookmark as superuser."""
    _ = db_session
    # Create a bookmark
    response = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )
    assert response.status_code == 200

    response = client_user.get(
        f"{settings.API_V1_STR}/bookmarks/get?obj_type=gene&obj_id=exampleGene"
    )
    assert response.status_code == 200
    assert response.json()["obj_type"] == "gene"
    assert response.json()["obj_id"] == "exampleGene"
    assert response.json()["user"] == str(test_user.id)


@pytest.mark.asyncio
async def test_get_bookmark_anon(db_session: AsyncSession, client: TestClient):
    """Test getting a bookmark as anonymous user."""
    _ = db_session
    response = client.get(f"{settings.API_V1_STR}/bookmarks/get?obj_type=gene&obj_id=exampleGene")
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_get_no_bookmarks(
    db_session: AsyncSession,
    client_user: TestClient,
):
    """Test getting a bookmark as superuser when there are no bookmarks."""
    _ = db_session
    response = client_user.get(
        f"{settings.API_V1_STR}/bookmarks/get?obj_type=gene&obj_id=exampleGene"
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "Bookmark not found"}


# ------------------------------------------------------------------------------
# api/v1/bookmarks/delete
# ------------------------------------------------------------------------------


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(False, False)], indirect=True)
async def test_delete_bookmark(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a bookmark as regular user."""
    _ = db_session
    # Create a bookmark
    response = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )

    response = client_user.delete(
        f"{settings.API_V1_STR}/bookmarks/delete?obj_type=gene&obj_id=exampleGene"
    )
    assert response.status_code == 200
    assert response.json()["obj_type"] == "gene"

    # Verify that the bookmark is indeed deleted
    response = client_user.get(
        f"{settings.API_V1_STR}/bookmarks/get?obj_type=gene&obj_id=exampleGene"
    )
    assert response.status_code == 404


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_delete_bookmark_superuser(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a bookmark as superuser."""
    _ = db_session
    # Create a bookmark
    response = client_user.post(
        f"{settings.API_V1_STR}/bookmarks/create/",
        json={"obj_type": "gene", "obj_id": "exampleGene"},
    )

    response = client_user.delete(
        f"{settings.API_V1_STR}/bookmarks/delete?obj_type=gene&obj_id=exampleGene"
    )
    assert response.status_code == 200
    assert response.json()["obj_type"] == "gene"

    # Verify that the bookmark is indeed deleted
    response = client_user.get(
        f"{settings.API_V1_STR}/bookmarks/get?obj_type=gene&obj_id=exampleGene"
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_bookmark_anon(db_session: AsyncSession, client: TestClient):
    """Test deleting a bookmark as anonymous user."""
    _ = db_session
    response = client.delete(
        f"{settings.API_V1_STR}/bookmarks/delete?obj_type=gene&obj_id=exampleGene"
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.asyncio
@pytest.mark.parametrize("test_user, client_user", [(True, True)], indirect=True)
async def test_delete_no_bookmarks(
    db_session: AsyncSession,
    client_user: TestClient,
):
    """Test deleting a bookmark as superuser when there are no bookmarks."""
    _ = db_session
    response = client_user.delete(
        f"{settings.API_V1_STR}/bookmarks/delete?obj_type=gene&obj_id=exampleGene"
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "Bookmark not found"}
