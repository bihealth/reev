import logging
import asyncio
import datetime

from asgiref.sync import async_to_sync
from sqlalchemy import *
from app import crud, models, schemas
from app.db.session import SyncSessionLocal, SessionLocal

import clinvar_api.models as clinvar_api_models
from app.clinvarsub import SubmissionActivityHandler
from app.worker import handle_submission_activity

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("app.clinvarsub")
logger.setLevel(logging.DEBUG)


request_payload = clinvar_api_models.SubmissionContainer.model_validate({
    "assertion_criteria": {
        "db": "PubMed",
        "id": "25741868",
    },
    "clinvar_submission": [{
        "clinical_significance": {
            "clinical_significance_description": clinvar_api_models.ClinicalSignificanceDescription.UNCERTAIN_SIGNIFICANCE.value,
            "date_last_evaluated": datetime.date.today().strftime("%Y-%m-%d"),
            "comment": "<SOME-TEXT-HERE>",
        },
        "condition_set": {
            "condition": [
                {
                    "name": "not provided"
                },
                {
                    "db": "HP",
                    "id": "HP:0000007",
                    # "name": "Autosomal dominant inheritance"
                }
            ]
        },
        "observed_in": [
            {
                "affected_status": clinvar_api_models.AffectedStatus.YES.value,
                "allele_origin": clinvar_api_models.AlleleOrigin.GERMLINE.value,
                "collection_method": clinvar_api_models.CollectionMethod.CLINICAL_TESTING.value,
                "clinical_features": None,
                "clinical_features_comment": None,
                "number_of_individuals": None,
                "struct_var_method_type": None,
            }
        ],
        "record_status": "novel",
        "variant_set": {
            "variant": [
                {
                    "chromosome_coordinates": {
                        "assembly": clinvar_api_models.Assembly.GRCH37.value,
                        "chromosome": "11",
                        "start": 179390771,
                        "stop": 179390771,
                        "reference_allele": "A",
                        "alternate_allele": "G",
                    },
                    # "copy"number": "1",
                    # "hgvs": "NC_000011.9:g.179390771A>G",
                    # "reference_copy_number": 2,
                    # "variant_type": VariantType.TRANSLOCATION.value,
                }
            ]
        },
    }],
    "clinvar_submission-release_status": clinvar_api_models.ReleaseStatus.PUBLIC,
    # "clinvar_submission_id": str(submissionactivity_db.id),
})

async def main():
    with SyncSessionLocal() as session:
        print("query for user")
        user = session.execute(select(models.User)).scalars().unique().first()
        print(f"user.email = {user.email}", user.email)
        stmt = select(models.User).filter(models.User.email == 'admin@example.com')
        user = session.execute(stmt).scalars().first()

        stmt = select(models.SubmittingOrg)
        session.execute(stmt).scalars().first()

        stmt = select(models.SubmittingOrg)
        submittingorg = session.execute(stmt).scalars().first()
        if not submittingorg:
            print('creating')
            submittingorg = await crud.submittingorg.create(
                SessionLocal(),
                obj_in=schemas.SubmittingOrgCreate(
                    label='medgen',
                    clinvar_api_token='JZ2itRuwT7rhSSxhAyzbAKlDIAdjJD51T8rXz5wlRbKZQR094eK0VmA9EZoOGHNC',
                    owner=user.id,
                ),
            )
        submittingorg = schemas.SubmittingOrgInDb.model_validate(submittingorg)
        print(submittingorg.model_dump(mode="json"))

    async with SessionLocal() as session:
        stmt = select(models.SubmissionThread)
        submissionthread_db = (await session.execute(stmt)).scalars().first()
        # if submissionthread_db:
        #     await crud.submissionthread.remove(session, id=submissionthread_db.id)
        #     submissionthread_db = None
        if not submissionthread_db:
            print('creating')
            submissionthread_db = await crud.submissionthread.create(
                session,
                obj_in=schemas.SubmissionThreadCreate(
                    label='medgen',
                    primary_variant_desc='grch37-11-179390771-A-G',
                    owner=user.id,
                    desired_presence=schemas.VariantPresence.PRESENT,
                    status=schemas.SubmissionThreadStatus.INITIAL,
                    submittingorg_id=submittingorg.id,
                ),
            )
        submissionthread = schemas.SubmissionThreadUpdate.model_validate(submissionthread_db).model_copy(
            update={
                "primary_variant_desc": 'grch37-11-179390771-A-G',
                "status": schemas.SubmissionThreadStatus.WAITING,
            })
        submissionthread_db = await crud.submissionthread.update(session, db_obj=submissionthread_db, obj_in=submissionthread)
        submissionthread = schemas.SubmissionThreadInDb.model_validate(submissionthread_db)
        print(submissionthread.model_dump(mode="json"))

        stmt = select(models.SubmissionActivity)
        submissionactivity_db = (await session.execute(stmt)).scalars().first()
        if not submissionactivity_db:
            print('creating')
            submissionactivity_db = await crud.submissionactivity.create(
                session,
                obj_in=schemas.SubmissionActivityCreate(
                    submissionthread_id=submissionthread.id,
                    kind=schemas.SubmissionActivityKind.CREATE,
                    status=schemas.SubmissionActivityStatus.WAITING,
                    request_timestamp=None,
                    request_payload=request_payload,
                    response_status=None,
                    response_payload=None,
                    response_timestamp=None,
                ),
            )
        submissionactivity_db = (
            await crud
                .submissionactivity
                .update(
                    session,
                    db_obj=submissionactivity_db,
                    obj_in=schemas.SubmissionActivityUpdate.model_validate(
                        obj=submissionactivity_db
                    ).model_copy(
                        update={
                            "status": schemas.SubmissionActivityStatus.WAITING
                        }
                    )
                )
        )
        submissionactivity = schemas.SubmissionActivityInDb.model_validate(submissionactivity_db)
        print(submissionactivity.model_dump(mode="json"))

        res = handle_submission_activity.delay(str(submissionactivity_db.id))
        print(f"task = {res}", res)

asyncio.run(main())
