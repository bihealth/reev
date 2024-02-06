import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.user import User
from tests.conftest import ObjNames, UserChoice

#: Shortcut for regular user.
REGUL = UserChoice.REGULAR
#: Shortcut for verified user.
VERIF = UserChoice.VERIFIED
#: Shortcut for superuser.
SUPER = UserChoice.SUPERUSER

# ------------------------------------------------------------------------------
# /api/v1/comments/create
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(VERIF, VERIF)], indirect=True)
async def test_create_comment(
    db_session: AsyncSession, client_user: TestClient, test_user: User, obj_names: ObjNames
):
    """Test creating a comment as regular user."""
    _ = db_session
    # act:
    response = client_user.post(
        f"{settings.API_V1_STR}/comments/create/",
        json={"obj_type": "gene", "obj_id": obj_names.gene[0], "text": "This is a test comment."},
    )
    # assert:
    assert response.status_code == 200
    assert response.json()["obj_type"] == "gene"
    assert response.json()["obj_id"] == obj_names.gene[0]
    assert response.json()["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_create_comment_superuser(
    db_session: AsyncSession, client_user: TestClient, test_user: User, obj_names: ObjNames
):
    """Test creating a comment as superuser."""
    _ = db_session
    # act:
    response = client_user.post(
        f"{settings.API_V1_STR}/comments/create/",
        json={"obj_type": "gene", "obj_id": obj_names.gene[0], "text": "This is a test comment."},
    )
    # assert:
    assert response.status_code == 200
    assert response.json()["obj_type"] == "gene"
    assert response.json()["obj_id"] == obj_names.gene[0]
    assert response.json()["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_create_comment_anon(
    db_session: AsyncSession, client: TestClient, obj_names: ObjNames
):
    """Test creating a comment as anonymous user."""
    _ = db_session
    # act:
    response = client.post(
        f"{settings.API_V1_STR}/comments/create/",
        json={"obj_type": "gene", "obj_id": obj_names.gene[0], "text": "This is a test comment."},
    )
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_create_comment_invalid_data(
    db_session: AsyncSession, client_user: TestClient, test_user: User, obj_names: ObjNames
):
    """Test creating a comment with invalid data."""
    _ = db_session
    _ = test_user
    # act:
    response = client_user.post(
        f"{settings.API_V1_STR}/comments/create/",
        json={"obj_type": "invalid", "obj_id": "invalid", "text": "This is a test comment."},
    )
    # assert:
    assert response.status_code == 422


# ------------------------------------------------------------------------------
# api/v1/comments/list-all
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(VERIF, VERIF)], indirect=True)
async def test_list_all_comments(
    db_session: AsyncSession, client_user: TestClient, test_user: User, obj_names: ObjNames
):
    """Test listing all comments as regular user."""
    _ = db_session
    _ = test_user
    # act:
    # Create a comment
    response_create = client_user.post(
        f"{settings.API_V1_STR}/comments/create/",
        json={"obj_type": "gene", "obj_id": obj_names.gene[0], "text": "This is a test comment."},
    )
    assert response_create.status_code == 200  # guard assertion
    response_list_all = client_user.get(f"{settings.API_V1_STR}/comments/list-all/")
    # assert:s
    assert response_list_all.status_code == 200
    assert response_list_all.json()[0]["obj_type"] == "gene"
    assert response_list_all.json()[0]["obj_id"] == obj_names.gene[0]
    assert response_list_all.json()[0]["text"] == "This is a test comment."
    assert response_list_all.json()[0]["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_list_all_comments_superuser(
    db_session: AsyncSession, client_user: TestClient, test_user: User, obj_names: ObjNames
):
    """Test listing all comments as superuser."""
    _ = db_session
    # act:
    # Create a comment
    response_create = client_user.post(
        f"{settings.API_V1_STR}/comments/create/",
        json={"obj_type": "gene", "obj_id": obj_names.gene[0], "text": "This is a test comment."},
    )
    assert response_create.status_code == 200  # guard assertion
    response_list_all = client_user.get(f"{settings.API_V1_STR}/comments/list-all/")
    # assert:
    assert response_list_all.status_code == 200
    assert response_list_all.json()[0]["obj_type"] == "gene"
    assert response_list_all.json()[0]["obj_id"] == obj_names.gene[0]
    assert response_list_all.json()[0]["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_list_all_comments_anon(db_session: AsyncSession, client: TestClient):
    """Test listing all comments as anonymous user."""
    _ = db_session
    # act:
    response = client.get(f"{settings.API_V1_STR}/comments/list-all/")
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_list_all_no_comments(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test listing all comments as superuser when there are no comments."""
    _ = db_session
    _ = test_user
    # act:
    response = client_user.get(f"{settings.API_V1_STR}/comments/list-all/")
    # assert:
    assert response.status_code == 200
    assert response.json() == []


# ------------------------------------------------------------------------------
# api/v1/comments/get-by-id
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(VERIF, VERIF)], indirect=True)
async def test_get_comment_by_id(
    db_session: AsyncSession, client_user: TestClient, test_user: User, obj_names: ObjNames
):
    """Test getting a comment by id as regular user."""
    _ = db_session
    _ = test_user
    # arrange:
    comment_id = uuid.uuid4()
    # act:
    response = client_user.get(f"{settings.API_V1_STR}/comments/get-by-id?id={comment_id}")
    # assert:
    assert response.status_code == 401  # Forbidden access should be 403


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_get_comment_by_id_superuser(
    db_session: AsyncSession, client_user: TestClient, test_user: User, obj_names: ObjNames
):
    """Test getting a comment by id as superuser."""
    _ = db_session
    _ = test_user
    # act:
    # Create a comment
    response_create = client_user.post(
        f"{settings.API_V1_STR}/comments/create/",
        json={"obj_type": "gene", "obj_id": obj_names.gene[0], "text": "This is a test comment."},
    )
    assert response_create.status_code == 200  # guard assertion
    # Get the comment id
    response_list = client_user.get(f"{settings.API_V1_STR}/comments/list/")
    comment_id = response_list.json()[0]["id"]
    response_get_by_id = client_user.get(
        f"{settings.API_V1_STR}/comments/get-by-id?id={comment_id}"
    )
    # assert:
    assert response_get_by_id.status_code == 200
    assert response_get_by_id.json()["id"] == comment_id


@pytest.mark.anyio
async def test_get_comment_by_id_anon(db_session: AsyncSession, client: TestClient):
    """Test getting a comment by id as anonymous user."""
    _ = db_session
    # arrange:
    comment_id = uuid.uuid4()
    # act:
    response = client.get(f"{settings.API_V1_STR}/comments/get-by-id?id={comment_id}/")
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_get_comment_by_invalid_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test getting a comment by invalid id as superuser."""
    _ = db_session
    _ = test_user
    # arrange:
    comment_id = uuid.uuid4()  # Invalid id
    # act:
    response = client_user.get(f"{settings.API_V1_STR}/comments/get-by-id?id={comment_id}")
    # assert:
    assert response.status_code == 404
    assert response.json() == {"detail": "Comment not found"}


# ------------------------------------------------------------------------------
# api/v1/comments/delete-by-id
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(VERIF, VERIF)], indirect=True)
async def test_delete_comment_by_id(
    db_session: AsyncSession, client_user: TestClient, test_user: User, obj_names: ObjNames
):
    """Test deleting a comment by id as regular user."""
    _ = db_session
    _ = test_user
    # act:
    # Create a comment
    response_create = client_user.post(
        f"{settings.API_V1_STR}/comments/create/",
        json={"obj_type": "gene", "obj_id": obj_names.gene[0], "text": "This is a test comment."},
    )
    assert response_create.status_code == 200  # guard assertion
    # Get the comment id
    response_list = client_user.get(f"{settings.API_V1_STR}/comments/list/")
    comment_id = response_list.json()[0]["id"]
    response_delete_by_id = client_user.delete(
        f"{settings.API_V1_STR}/comments/delete-by-id?id={comment_id}"
    )
    # Verify that the comment was not deleted
    response_list = client_user.get(f"{settings.API_V1_STR}/comments/list/")
    # assert:
    assert response_delete_by_id.status_code == 401
    assert response_delete_by_id.json() == {"detail": "Unauthorized"}
    assert response_list.status_code == 200
    assert response_list.json()[0]["id"] == comment_id


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_delete_comment_by_id_superuser(
    db_session: AsyncSession, client_user: TestClient, test_user: User, obj_names: ObjNames
):
    """Test deleting a comment by id as superuser."""
    _ = db_session
    _ = test_user
    # act:
    # Create a comment
    response_creat = client_user.post(
        f"{settings.API_V1_STR}/comments/create/",
        json={"obj_type": "gene", "obj_id": obj_names.gene[0], "text": "This is a test comment."},
    )
    # Get the comment id
    response_list = client_user.get(f"{settings.API_V1_STR}/comments/list/")
    comment_id = response_list.json()[0]["id"]
    response_delete = client_user.delete(
        f"{settings.API_V1_STR}/comments/delete-by-id?id={comment_id}"
    )
    # Verify that the comment is indeed deleted
    response_get_by_id = client_user.get(
        f"{settings.API_V1_STR}/comments/get-by-id?id={comment_id}"
    )
    # assert:
    assert response_creat.status_code == 200
    assert response_delete.status_code == 200
    assert response_delete.json()["id"] == comment_id
    assert response_get_by_id.status_code == 404  # Not Found


@pytest.mark.anyio
async def test_delete_comment_by_id_anon(db_session: AsyncSession, client: TestClient):
    """Test deleting a comment by id as anonymous user."""
    _ = db_session
    # arrange:
    comment_id = uuid.uuid4()
    # act:
    response = client.delete(f"{settings.API_V1_STR}/comments/delete-by-id?id={comment_id}/")
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_delete_comment_by_invalid_id(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    """Test deleting a comment by invalid id as superuser."""
    _ = db_session
    _ = test_user
    # arrange:
    comment_id = uuid.uuid4()
    # act:
    response = client_user.delete(f"{settings.API_V1_STR}/comments/delete-by-id?id={comment_id}")
    # assert:
    assert response.status_code == 404
    assert response.json() == {"detail": "Comment not found"}


# ------------------------------------------------------------------------------
# api/v1/comments/list
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(VERIF, VERIF)], indirect=True)
async def test_list_comments(
    db_session: AsyncSession, client_user: TestClient, test_user: User, obj_names: ObjNames
):
    """Test listing comments as regular user."""
    _ = db_session
    # arrange:
    # Create a comment
    response_create = client_user.post(
        f"{settings.API_V1_STR}/comments/create/",
        json={"obj_type": "gene", "obj_id": obj_names.gene[0], "text": "This is a test comment."},
    )
    assert response_create.status_code == 200  # guard assertion
    response_list = client_user.get(f"{settings.API_V1_STR}/comments/list/")
    # assert:
    assert response_list.status_code == 200
    assert response_list.json()[0]["obj_type"] == "gene"
    assert response_list.json()[0]["obj_id"] == obj_names.gene[0]
    assert response_list.json()[0]["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_list_comments_superuser(
    db_session: AsyncSession, client_user: TestClient, test_user: User, obj_names: ObjNames
):
    """Test listing comments as superuser."""
    _ = db_session
    # act:
    # Create a comment
    response_create = client_user.post(
        f"{settings.API_V1_STR}/comments/create/",
        json={"obj_type": "gene", "obj_id": obj_names.gene[0], "text": "This is a test comment."},
    )
    assert response_create.status_code == 200  # guard assertion
    response_list = client_user.get(f"{settings.API_V1_STR}/comments/list/")
    # assert:
    assert response_list.status_code == 200
    assert response_list.json()[0]["obj_type"] == "gene"
    assert response_list.json()[0]["obj_id"] == obj_names.gene[0]
    assert response_list.json()[0]["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_list_comments_anon(db_session: AsyncSession, client: TestClient):
    """Test listing comments as anonymous user."""
    _ = db_session
    # act:
    response = client.get(f"{settings.API_V1_STR}/comments/list/")
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("client_user", [(SUPER, SUPER)], indirect=True)
async def test_list_no_comments(
    db_session: AsyncSession,
    client_user: TestClient,
):
    """Test listing comments as superuser when there are no comments."""
    _ = db_session
    # act:
    response = client_user.get(f"{settings.API_V1_STR}/comments/list/")
    # assert:
    assert response.status_code == 200
    assert response.json() == []


# ------------------------------------------------------------------------------
# api/v1/comments/get
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(VERIF, VERIF)], indirect=True)
async def test_get_comment(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    obj_names: ObjNames,
):
    """Test getting a comment as regular user."""
    _ = db_session
    # act:
    # Create a comment
    response_create = client_user.post(
        f"{settings.API_V1_STR}/comments/create/",
        json={"obj_type": "gene", "obj_id": obj_names.gene[0], "text": "This is a test comment."},
    )
    assert response_create.status_code == 200  # guard assertion
    response_get = client_user.get(
        f"{settings.API_V1_STR}/comments/get?obj_type=gene&obj_id={obj_names.gene[0]}"
    )
    # assert:
    assert response_get.status_code == 200
    assert response_get.json()["obj_type"] == "gene"
    assert response_get.json()["obj_id"] == obj_names.gene[0]
    assert response_get.json()["user"] == str(test_user.id)


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_get_comment_superuser(
    db_session: AsyncSession, client_user: TestClient, test_user: User, obj_names: ObjNames
):
    """Test getting a comment as superuser."""
    _ = db_session
    # act:
    # Create a comment
    response_create = client_user.post(
        f"{settings.API_V1_STR}/comments/create/",
        json={"obj_type": "gene", "obj_id": obj_names.gene[0], "text": "This is a test comment."},
    )
    assert response_create.status_code == 200  # guard assertion
    response_get = client_user.get(
        f"{settings.API_V1_STR}/comments/get?obj_type=gene&obj_id={obj_names.gene[0]}"
    )
    # assert:
    assert response_get.status_code == 200
    assert response_get.json()["obj_type"] == "gene"
    assert response_get.json()["obj_id"] == obj_names.gene[0]
    assert response_get.json()["user"] == str(test_user.id)


@pytest.mark.anyio
async def test_get_comment_anon(db_session: AsyncSession, client: TestClient, obj_names: ObjNames):
    """Test getting a comment as anonymous user."""
    _ = db_session
    # act:
    response = client.get(
        f"{settings.API_V1_STR}/comments/get?obj_type=gene&obj_id={obj_names.gene[0]}"
    )
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("client_user", [(SUPER, SUPER)], indirect=True)
async def test_get_no_comments(
    db_session: AsyncSession, client_user: TestClient, obj_names: ObjNames
):
    """Test getting a comment as superuser when there are no comments."""
    _ = db_session
    # act:
    response = client_user.get(
        f"{settings.API_V1_STR}/comments/get?obj_type=gene&obj_id={obj_names.gene[0]}"
    )
    # assert:
    # Status code is 404 because we use internal agent
    assert response.status_code == 404
    assert response.json() == {"detail": "Comment not found"}


@pytest.mark.anyio
@pytest.mark.parametrize("client_user", [(SUPER, SUPER)], indirect=True)
async def test_get_no_comment_with_browser_header(
    db_session: AsyncSession, client_user: TestClient, obj_names: ObjNames
):
    """
    Test getting a comment as superuser when there are no comments by simulating the browser
    behaviour.
    """
    _ = db_session
    # act:
    response = client_user.get(
        f"{settings.API_V1_STR}/comments/get?obj_type=gene&obj_id={obj_names.gene[0]}",
        headers={"user-agent": "Mozilla/5.0"},
    )
    # assert:
    # Status code is 204 because we use browser agent
    assert response.status_code == 204


# ------------------------------------------------------------------------------
# api/v1/comments/delete
# ------------------------------------------------------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(VERIF, VERIF)], indirect=True)
async def test_delete_comment(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    obj_names: ObjNames,
):
    """Test deleting a comment as regular user."""
    _ = db_session
    _ = test_user
    # act:
    # Create a comment
    response_create = client_user.post(
        f"{settings.API_V1_STR}/comments/create/",
        json={"obj_type": "gene", "obj_id": obj_names.gene[0], "text": "This is a test comment."},
    )
    assert response_create.status_code == 200  # guard assertion
    response_delete = client_user.delete(
        f"{settings.API_V1_STR}/comments/delete?obj_type=gene&obj_id={obj_names.gene[0]}"
    )
    # Verify that the comment is indeed deleted
    response_get = client_user.get(
        f"{settings.API_V1_STR}/comments/get?obj_type=gene&obj_id={obj_names.gene[0]}"
    )
    # assert:
    assert response_delete.status_code == 200
    assert response_delete.json()["obj_type"] == "gene"
    assert response_get.status_code == 404


@pytest.mark.anyio
@pytest.mark.parametrize("test_user, client_user", [(SUPER, SUPER)], indirect=True)
async def test_delete_comment_superuser(
    db_session: AsyncSession, client_user: TestClient, test_user: User, obj_names: ObjNames
):
    """Test deleting a comment as superuser."""
    _ = db_session
    _ = test_user
    # act:
    # Create a comment
    response_create = client_user.post(
        f"{settings.API_V1_STR}/comments/create/",
        json={"obj_type": "gene", "obj_id": obj_names.gene[0], "text": "This is a test comment."},
    )
    response_delete = client_user.delete(
        f"{settings.API_V1_STR}/comments/delete?obj_type=gene&obj_id={obj_names.gene[0]}"
    )
    # Verify that the comment is indeed deleted
    response_get = client_user.get(
        f"{settings.API_V1_STR}/comments/get?obj_type=gene&obj_id={obj_names.gene[0]}"
    )
    # assert:
    assert response_delete.status_code == 200
    assert response_delete.json()["obj_type"] == "gene"
    assert response_get.status_code == 404


@pytest.mark.anyio
async def test_delete_comment_anon(
    db_session: AsyncSession, client: TestClient, obj_names: ObjNames
):
    """Test deleting a comment as anonymous user."""
    _ = db_session
    # act:
    response = client.delete(
        f"{settings.API_V1_STR}/comments/delete?obj_type=gene&obj_id={obj_names.gene[0]}"
    )
    # assert:
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


@pytest.mark.anyio
@pytest.mark.parametrize("client_user", [(SUPER, SUPER)], indirect=True)
async def test_delete_no_comments(
    db_session: AsyncSession, client_user: TestClient, obj_names: ObjNames
):
    """Test deleting a comment as superuser when there are no comments."""
    _ = db_session
    # act:
    response = client_user.delete(
        f"{settings.API_V1_STR}/comments/delete?obj_type=gene&obj_id={obj_names.gene[0]}"
    )
    # assert:
    # Status code is 404 because we use internal agent
    assert response.status_code == 404
    assert response.json() == {"detail": "Comment not found"}


@pytest.mark.anyio
@pytest.mark.parametrize("client_user", [(SUPER, SUPER)], indirect=True)
async def test_delete_no_comment_with_browser_header(
    db_session: AsyncSession, client_user: TestClient, obj_names: ObjNames
):
    """
    Test deleting a comment as superuser when there are no comments by simulating the browser
    behaviour.
    """
    _ = db_session
    # act:
    response = client_user.delete(
        f"{settings.API_V1_STR}/comments/delete?obj_type=gene&obj_id={obj_names.gene[0]}",
        headers={"user-agent": "Mozilla/5.0"},
    )
    # assert:
    # Status code is 204 because we use browser agent
    assert response.status_code == 204
