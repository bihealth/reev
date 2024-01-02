"""Endpoints for the ClinVar submission API."""

import logging
from typing import Generic, Optional, TypeVar

from fastapi import APIRouter, Depends, HTTPException
from fastapi_pagination.bases import CursorRawParams
from fastapi_pagination.cursor import CursorPage, CursorParams
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas, worker
from app.api import deps
from app.api.deps import current_active_user
from app.models.clinvarsub import SubmissionActivityStatus
from app.models.user import User

logger = logging.getLogger(__name__)

router = APIRouter()

T = TypeVar("T")


class TotalCursorParams(CursorParams):
    """Cursor params with total count."""

    def to_raw_params(self) -> CursorRawParams:
        params = super().to_raw_params()
        params.include_total = True

        return params


class TotalCursorPage(CursorPage[T], Generic[T]):
    """Cursor page with total count."""

    __params_type__ = TotalCursorParams


# -- SumbmittingOrg -----------------------------------------------------------


@router.get("/submittingorgs", response_model=TotalCursorPage[schemas.SubmittingOrgRead])
async def list_submittingorgs(
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    List submitting orgs of current user in paginated fashion.

    :return: Paginated list of results.
    """
    query = crud.submittingorg.query_by_owner(user_id=user.id)
    return await paginate(db, query)


@router.post("/submittingorgs", response_model=schemas.SubmittingOrgRead)
async def create_submittingorg(
    submittingorg: schemas.SubmittingOrgCreate,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Create a new submitting org.

    :param submittingorg: Data of submitting org to create.
    :return: Created submitting org.
    """
    submittingorg.owner = user.id
    return await crud.submittingorg.create(db, obj_in=submittingorg)


@router.get(
    "/submittingorgs/{submittingorg_id}",
    response_model=schemas.SubmittingOrgRead,
)
async def get_submittingorg_by_id(
    submittingorg_id: str,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Retrieve submitting org (current user must be owner).

    :param id: Submitting org UUID.
    :return: Submitting org data.
    """
    response = await crud.submittingorg.get(db, id=submittingorg_id)
    if not response:  # pragma: no cover
        raise HTTPException(status_code=404, detail="submitting org not found")
    elif response.owner != user.id:
        raise HTTPException(status_code=403, detail="user not owner of submitting org")
    else:
        return response


@router.put(
    "/submittingorgs/{submittingorg_id}",
    response_model=schemas.SubmittingOrgRead,
)
async def update_submittingorg(
    submittingorg_id: str,
    submittingorg: schemas.SubmittingOrgUpdate,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Update submitting org (current user must be owner).

    :return: Paginated list of results.
    """
    submittingorg_db = await crud.submittingorg.get(db, id=submittingorg_id)
    if not submittingorg_db:  # pragma: no cover
        raise HTTPException(status_code=404, detail="submitting org not found")
    elif submittingorg_db.owner != user.id:
        raise HTTPException(status_code=403, detail="user not owner of submitting org")
    else:
        return await crud.submittingorg.update(db, db_obj=submittingorg_db, obj_in=submittingorg)


@router.delete(
    "/submittingorgs/{submittingorg_id}",
    response_model=schemas.SubmittingOrgRead,
)
async def delete_submittingorg(
    submittingorg_id: str,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Update submitting org (current user must be owner).

    :return: Paginated list of results.
    """
    submittingorg_db = await crud.submittingorg.get(db, id=submittingorg_id)
    if not submittingorg_db:  # pragma: no cover
        raise HTTPException(status_code=404, detail="submitting org not found")
    elif submittingorg_db.owner != user.id:
        raise HTTPException(status_code=403, detail="user not owner of submitting org")
    else:
        return await crud.submittingorg.remove(db, id=submittingorg_id)


# -- SubmissionThread ---------------------------------------------------------


@router.get("/submissionthreads", response_model=TotalCursorPage[schemas.SubmissionThreadRead])
async def list_submissionthreads(
    primary_variant_desc: Optional[str] = None,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    List submission threads of current user in paginated fashion.

    :return: Paginated list of results.
    """
    query = crud.submissionthread.query_by_user(
        user_id=user.id, primary_variant_desc=primary_variant_desc
    )
    return await paginate(db, query)


@router.post("/submissionthreads", response_model=schemas.SubmissionThreadRead)
async def create_submissionthread(
    submissionthread: schemas.SubmissionThreadCreate,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Create a new submission thread.

    :param submissionthread: Data of submission thread to create.
    :return: Created submission thread.
    """
    submittingorg = await crud.submittingorg.get(db, id=submissionthread.submittingorg_id)
    if not submittingorg:  # pragma: no cover
        raise HTTPException(status_code=404, detail="submitting org not found")
    elif submittingorg.owner != user.id:
        raise HTTPException(status_code=403, detail="user not owner of submitting org")
    else:
        return await crud.submissionthread.create(db, obj_in=submissionthread)


@router.put(
    "/submissionthreads/{submissionthread_id}",
    response_model=schemas.SubmissionThreadRead,
)
async def update_submissionthread(
    submissionthread_id: str,
    submissionthread: schemas.SubmissionThreadUpdate,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Update submission thread (current user must be owner).

    :param id: Submission thread UUID.
    :return: Submission tread data.
    """
    submissionthread_db = await crud.submissionthread.get(db, id=submissionthread_id)
    if not submissionthread_db:  # pragma: no cover
        raise HTTPException(status_code=404, detail="submission thread not found")
    submittingorg = await crud.submittingorg.get(db, id=submissionthread_db.submittingorg_id)
    if not submittingorg:  # pragma: no cover
        raise HTTPException(status_code=404, detail="submitting org not found")
    elif submittingorg.owner != user.id:
        raise HTTPException(status_code=403, detail="user not owner of submitting org")
    else:
        return await crud.submissionthread.update(
            db, db_obj=submissionthread_db, obj_in=submissionthread
        )


@router.get(
    "/submissionthreads/{submissionthread_id}",
    response_model=schemas.SubmissionThreadRead,
)
async def get_submissionthread_by_id(
    submissionthread_id: str,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Retrieve submission thread (current user must be owner).

    :param id: Submission thread UUID.
    :return: Submission tread data.
    """
    submissionthread_db = await crud.submissionthread.get(db, id=submissionthread_id)
    if not submissionthread_db:  # pragma: no cover
        raise HTTPException(status_code=404, detail="submission thread not found")
    submittingorg = await crud.submittingorg.get(db, id=submissionthread_db.submittingorg_id)
    if not submittingorg:  # pragma: no cover
        raise HTTPException(status_code=404, detail="submitting org not found")
    elif submittingorg.owner != user.id:
        raise HTTPException(status_code=403, detail="user not owner of submitting org")
    else:
        return submissionthread_db


@router.delete(
    "/submissionthreads/{submissionthread_id}",
    response_model=schemas.SubmissionThreadRead,
)
async def delete_submissionthread(
    submissionthread_id: str,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Update submission thread (current user must be owner).

    :return: Paginated list of results.
    """
    submissionthread_db = await crud.submissionthread.get(db, id=submissionthread_id)
    if not submissionthread_db:  # pragma: no cover
        raise HTTPException(status_code=404, detail="submission thread not found")
    submittingorg = await crud.submittingorg.get(db, id=submissionthread_db.submittingorg_id)
    if not submittingorg:  # pragma: no cover
        raise HTTPException(status_code=404, detail="submitting org not found")
    elif submittingorg.owner != user.id:
        raise HTTPException(status_code=403, detail="user not owner of submitting org")
    else:
        return await crud.submissionthread.remove(db, id=submissionthread_id)


# -- SubmissionActivity -------------------------------------------------------


@router.get(
    "/submissionthreads/{submissionthread_id}/activities",
    response_model=TotalCursorPage[schemas.SubmissionActivityRead],
)
async def list_submissionactivities(
    submissionthread_id: str,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    List submission activities of given submission thread.

    Current user must be owner.

    :param submissionthread_id: Submission thread UUID.
    :return: Paginated list of results.
    """
    submissionthread_db = await crud.submissionthread.get(db, id=submissionthread_id)
    if not submissionthread_db:  # pragma: no cover
        raise HTTPException(status_code=404, detail="submission thread not found")
    submittingorg = await crud.submittingorg.get(db, id=submissionthread_db.submittingorg_id)
    if not submittingorg:  # pragma: no cover
        raise HTTPException(status_code=404, detail="submitting org not found")
    elif submittingorg.owner != user.id:
        raise HTTPException(status_code=403, detail="user not owner of submitting org")
    query = crud.submissionactivity.query_by_submissionthread(
        submissionthread_id=submissionthread_id
    )
    return await paginate(db, query)


@router.post(
    "/submissionthreads/{submissionthread_id}/activities",
    response_model=schemas.SubmissionActivityRead,
)
async def create_submissionactivity(
    submissionthread_id: str,
    submissionactivity: schemas.SubmissionActivityCreate,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Create a new submission activity in the given thread.

    :param submissionthread_id: Submission thread UUID.
    :return: Created submission activity.
    """
    submissionthread_db = await crud.submissionthread.get(db, id=submissionthread_id)
    if not submissionthread_db:  # pragma: no cover
        raise HTTPException(status_code=404, detail="submission thread not found")
    submittingorg = await crud.submittingorg.get(db, id=submissionthread_db.submittingorg_id)
    if not submittingorg:  # pragma: no cover
        raise HTTPException(status_code=404, detail="submitting org not found")
    elif submittingorg.owner != user.id:
        raise HTTPException(status_code=403, detail="user not owner of submitting org")
    else:
        return await crud.submissionactivity.create(db, obj_in=submissionactivity)


@router.put(
    "/submissionactivities/{submissionactivity_id}",
    response_model=schemas.SubmissionActivityRead,
)
async def update_submissionactivity(
    submissionactivity_id: str,
    submissionactivity: schemas.SubmissionActivityUpdate,
    db: AsyncSession = Depends(deps.get_db),
    user: User = Depends(current_active_user),
):
    """
    Create a new submission activity in the given thread.

    :param submissionthread_id: Submission thread UUID.
    :return: Created submission activity.
    """
    submissionactivity_db = await crud.submissionactivity.get(db, id=submissionactivity_id)
    if not submissionactivity_db:  # pragma: no cover
        raise HTTPException(status_code=404, detail="submission activity not found")
    submissionthread_db = await crud.submissionthread.get(
        db, id=submissionactivity_db.submissionthread_id
    )
    if not submissionthread_db:  # pragma: no cover
        raise HTTPException(status_code=404, detail="submission thread not found")
    submittingorg = await crud.submittingorg.get(db, id=submissionthread_db.submittingorg_id)
    if not submittingorg:  # pragma: no cover
        raise HTTPException(status_code=404, detail="submitting org not found")
    elif submittingorg.owner != user.id:
        raise HTTPException(status_code=403, detail="user not owner of submitting org")
    else:
        # Create submission activity and schedule it to be executed by the worker
        # if it changed from any state to `WAITING`.
        old_status = submissionactivity_db.status
        result = await crud.submissionactivity.update(
            db, db_obj=submissionactivity_db, obj_in=submissionactivity
        )
        logger.info("%s %s", old_status, submissionactivity.status)
        if (
            old_status != SubmissionActivityStatus.WAITING
            and submissionactivity.status == SubmissionActivityStatus.WAITING
        ):
            logger.info('submitting submission activity "%s" to worker', submissionactivity_id)
            worker.handle_submission_activity.delay(submissionactivity_id)
        return result
