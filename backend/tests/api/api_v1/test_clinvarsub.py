import itertools
import uuid
from typing import Optional

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.core.config import settings
from app.models.clinvarsub import SubmissionThread, SubmittingOrg
from app.models.user import User
from app.schemas.clinvarsub import (
    SubmissionThreadCreate,
    SubmissionThreadUpdate,
    SubmittingOrgCreate,
)

# == /api/v1/clinvarsub/submittingorgs ========================================

# -- GET /api/v1/clinvarsub/submittingorgs ------------------------------------


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


# -- POST /api/v1/clinvarsub/submittingorgs -----------------------------------


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


# -- GET /api/v1/clinvarsub/submittingorgs/{id} -------------------------------


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


# -- PUT /api/v1/clinvarsub/submittingorgs/{id} -------------------------------


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


# -- DELETE /api/v1/clinvarsub/submittingorgs/{id} ----------------------------


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


# == /api/v1/clinvarsub/submissionthreads =====================================

# -- GET /api/v1/clinvarsub/submissionthreads ---------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize(
    "is_owner, good_query", itertools.product((True, False), (None, True, False))
)
async def test_list_submissionthreads(
    db_session: AsyncSession,
    client_user: TestClient,
    submittingorg: SubmittingOrg,
    submissionthread: SubmissionThread,
    is_owner: bool,
    good_query: Optional[bool],
):
    """
    :param is_owner: test case where ``client_user`` is owner or not
    :param good_query: unless ``None``, use query with or without entries
    """
    if not is_owner:
        # make thread owned by different user
        await crud.submissionthread.update(
            db_session, db_obj=submissionthread, obj_in={"submittingorg": uuid.uuid4()}
        )

    # run the test
    if good_query is None:
        query = ""
    else:
        val = submissionthread.primary_variant_id if good_query else "BOGUS"
        query = f"?primary_variant_id={val}"
    response = client_user.get(
        f"{settings.API_V1_STR}/clinvarsub/submissionthreads{query}",
    )
    assert response.status_code == 200
    pages = response.json()
    if is_owner and good_query is not False:
        assert len(pages["items"]) == 1
        assert pages["items"][0] == {
            "effective_scv": None,
            "effective_presence": None,
            "desired_presence": "present",
            "status": "initial",
            "id": str(submissionthread.id),
            "submittingorg": str(submittingorg.id),
        }
    else:
        assert len(pages["items"]) == 0


# -- POST /api/v1/clinvarsub/submissionthreads --------------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("is_owner", (True, False))
async def test_create_submissionthreads(
    db_session: AsyncSession,
    client_user: TestClient,
    submittingorg: SubmittingOrg,
    submissionthread_create: SubmissionThreadCreate,
    is_owner: bool,
):
    if not is_owner:
        # make submission org owned by different user
        await crud.submittingorg.update(
            db_session, db_obj=submittingorg, obj_in={"owner": uuid.uuid4()}
        )

    # run the test
    response = client_user.post(
        f"{settings.API_V1_STR}/clinvarsub/submissionthreads",
        json=submissionthread_create.model_dump(mode="json"),
    )
    if is_owner:
        assert response.status_code == 200
        assert response.json() == {
            "effective_scv": None,
            "effective_presence": None,
            "desired_presence": "present",
            "status": "initial",
            "id": response.json()["id"],
            "submittingorg": str(submittingorg.id),
        }
    else:
        assert response.status_code == 403


# -- GET /api/v1/clinvarsub/submissionthreads/{id} ----------------------------


@pytest.mark.anyio
@pytest.mark.parametrize("is_owner", [True, False])
async def test_read_submissionthreads(
    db_session: AsyncSession,
    client_user: TestClient,
    submittingorg: SubmittingOrg,
    submissionthread: SubmissionThread,
    is_owner: bool,
):
    if not is_owner:
        # make submittingorg owned by different user
        await crud.submittingorg.update(
            db_session, db_obj=submittingorg, obj_in={"owner": uuid.uuid4()}
        )

    # run the tests
    response = client_user.get(
        f"{settings.API_V1_STR}/clinvarsub/submissionthreads/{submissionthread.id}",
    )
    if is_owner:
        assert response.status_code == 200
        assert response.json() == {
            "effective_scv": None,
            "effective_presence": None,
            "desired_presence": "present",
            "status": "initial",
            "id": response.json()["id"],
            "submittingorg": str(submittingorg.id),
        }
    else:
        assert response.status_code == 403
