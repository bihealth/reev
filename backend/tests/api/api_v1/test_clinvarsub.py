import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.core.config import settings
from app.models.user import User
from app.schemas.clinvarsub import SubmittingOrgCreate

# ------------------------------------------------------------------------------
# POST /api/v1/clinvarsub/submittingorgs
# ------------------------------------------------------------------------------


@pytest.mark.anyio
async def test_list_submittingorg(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    # create new submitting org
    orgs = [
        await crud.submittingorg.create(
            db_session,
            obj_in=SubmittingOrgCreate(
                owner=test_user.id,
                label="my-org-1",
                clinvar_api_token="my-token",
            ),
        ),
        await crud.submittingorg.create(
            db_session,
            obj_in=SubmittingOrgCreate(
                owner=test_user.id,
                label="my-org-2",
                clinvar_api_token="my-token",
            ),
        ),
    ]
    # run the tests
    response = client_user.get(
        f"{settings.API_V1_STR}/clinvarsub/submittingorgs/",
    )
    assert response.status_code == 200
    pages = response.json()
    assert len(pages["items"]) == 2
    assert pages["items"][0]["label"] == "my-org-1"
    assert pages["items"][1]["label"] == "my-org-2"


@pytest.mark.anyio
async def test_create_submittingorg(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    response = client_user.post(
        f"{settings.API_V1_STR}/clinvarsub/submittingorgs",
        json={
            "owner": None,
            "label": "my-org",
            "clinvar_api_token": "my-token",
        },
    )
    assert response.status_code == 200
    assert response.json() == {
        "owner": str(test_user.id),
        "label": "my-org",
        "id": response.json()["id"],
    }, "response should match expected"
    assert await crud.submittingorg.get(
        db_session, response.json()["id"]
    ), "record with id should exist"


@pytest.mark.anyio
@pytest.mark.parametrize("is_owner", [True, False])
async def test_read_submittingorg(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    is_owner: bool,
):
    # create new submitting org
    submittingorg = await crud.submittingorg.create(
        db_session,
        obj_in=SubmittingOrgCreate(
            owner=test_user.id if is_owner else uuid.uuid4(),
            label="my-org",
            clinvar_api_token="my-token",
        ),
    )
    # run the tests
    response = client_user.get(
        f"{settings.API_V1_STR}/clinvarsub/submittingorgs/{submittingorg.id}",
    )
    if is_owner:
        assert response.status_code == 200
        assert response.json()["label"] == "my-org"
    else:
        assert response.status_code == 403


@pytest.mark.anyio
async def test_update_submittingorg(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
):
    # create new submitting org
    submittingorg = await crud.submittingorg.create(
        db_session,
        obj_in=SubmittingOrgCreate(
            owner=test_user.id,
            label="my-org",
            clinvar_api_token="my-token",
        ),
    )
    # run the tests
    response = client_user.put(
        f"{settings.API_V1_STR}/clinvarsub/submittingorgs/{submittingorg.id}",
        json={"label": "my-org-new"},
    )
    assert response.status_code == 200
    assert response.json()["label"] == "my-org-new", "updated from response"
    obj_in_db = await crud.submittingorg.get(db_session, response.json()["id"])
    assert obj_in_db
    assert obj_in_db.label == "my-org-new", "updated in database"


@pytest.mark.anyio
@pytest.mark.parametrize("is_owner", [True, False])
async def test_list_submittingorgs(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    is_owner: bool,
):
    # create new submitting org
    submittingorg = await crud.submittingorg.create(
        db_session,
        obj_in=SubmittingOrgCreate(
            owner=test_user.id if is_owner else uuid.uuid4(),
            label="my-org",
            clinvar_api_token="my-token",
        ),
    )
    # run the tests
    response = client_user.get(
        f"{settings.API_V1_STR}/clinvarsub/submittingorgs/{submittingorg.id}",
    )
    if is_owner:
        assert response.status_code == 200
        assert response.json()["label"] == "my-org"
    else:
        assert response.status_code == 403


@pytest.mark.anyio
@pytest.mark.parametrize("is_owner", [True, False])
async def test_delete_submittingorg(
    db_session: AsyncSession,
    client_user: TestClient,
    test_user: User,
    is_owner: bool,
):
    # create new submitting org
    submittingorg = await crud.submittingorg.create(
        db_session,
        obj_in=SubmittingOrgCreate(
            owner=test_user.id if is_owner else uuid.uuid4(),
            label="my-org",
            clinvar_api_token="my-token",
        ),
    )
    # run the tests
    response = client_user.delete(
        f"{settings.API_V1_STR}/clinvarsub/submittingorgs/{submittingorg.id}",
    )
    if is_owner:
        assert response.status_code == 200
        assert response.json()["label"] == "my-org"
        assert not await crud.submittingorg.get(db_session, response.json()["id"])
    else:
        assert response.status_code == 403
