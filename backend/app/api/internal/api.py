import datetime
import subprocess

from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.api.internal.endpoints import proxy, remote
from app.core.config import settings

api_router = APIRouter()

api_router.include_router(proxy.router, prefix="/proxy", tags=["proxy"])
api_router.include_router(remote.router, prefix="/remote", tags=["remote"])


class DataVersions(BaseModel):
    """Container with data versions."""

    #: String to use for AlphaMissense version.
    alphamissense: str
    #: String to use for ClinGen gene curation version.
    clingen_gene: str
    #: String to use for ClinGen variant curation version.
    clingen_variant: str
    #: String to use for GRCh37 ENSEMBL version.
    ensembl_37: str
    #: String to use for GRCh38 ENSEMBL version.
    ensembl_38: str
    #: String to use for ENSEMBL version.
    ensembl: str
    #: String to use for current date.
    today: str
    #: Version of dbNSFP.
    dbnsfp: str
    #: Version of dbscSNV.
    dbscsnv: str
    #: Version of CADD.
    cadd: str
    #: Version of gnomAD for constraints.
    gnomad_constraints: str
    #: Version of gnomAD mtDNA.
    gnomad_mtdna: str
    #: Version of gnomAD v2.
    gnomad_v2: str
    #: Version of gnomAD v3.
    gnomad_v3: str
    #: Version of gnomAD v4.
    gnomad_v4: str
    #: Version of gnomAD SV.
    gnomad_sv: str
    #: Version of gnomAD CNV v4.
    gnomad_cnv4: str
    #: Version of gnomAD SV v4.
    gnomad_sv4: str
    #: Version of dbVar.
    dbvar: str
    #: Version of DGV.
    dgv: str
    #: Version of DGV Gold Standard.
    dgv_gs: str
    #: ExAC CNVs.
    exac_cnv: str
    #: Thousand Genomes SVs.
    g1k_svs: str
    #: HelixMtDb
    helixmtdb: str
    #: UCSC conservation (GRCh37).
    ucsc_cons_37: str
    #: UCSC conservation (GRCh38).
    ucsc_cons_38: str
    #: UCSC repeat masker (GRCh37).
    ucsc_rmsk_37: str
    #: UCSC repeat masker (GRCh38).
    ucsc_rmsk_38: str
    #: UCSC genomicSuperDups (GRCh37).
    ucsc_genomic_super_dups_37: str
    #: UCSC genomicSuperDups (GRCh38).
    ucsc_genomic_super_dups_38: str
    #: UCSC genome browser altSeqLiftOverPsl (GRCh37).
    ucsc_alt_seq_liftover_37: str
    #: UCSC genome browser altSeqLiftOverPsl (GRCh38).
    ucsc_alt_seq_liftover_38: str
    #: UCSC genome browser fixSeqLiftOverPsl (GRCh37).
    ucsc_fix_seq_liftover_37: str
    #: UCSC genome browser fixSeqLiftOverPsl (GRCh38).
    ucsc_fix_seq_liftover_38: str
    #: RefSeq version (GRCh37).
    refseq_37: str
    #: RefSeq version (GRCh38).
    refseq_38: str
    #: dbSNP version.
    dbsnp: str
    #: ACMG secondary findings version.
    acmg_sf: str
    #: HPO
    hpo: str
    #: Orphadata
    orphadata: str
    #: Pathogenic MMS
    patho_mms: str
    #: Mehari transcript data.
    mehari_tx: str
    #: ClinVar release.
    clinvar_release: str
    #: ClinVar version.
    clinvar_version: str
    #: Marker file for the tracks version.  This allows us to update the
    #: tracks BED files later on.
    tracks: str
    #: RefSeq functional elements for GRCh37.
    refseq_fe_37: str
    #: RefSeq functional elements for GRCh38.
    refseq_fe_38: str

#: The current date.
TODAY = datetime.date.strftime(datetime.date.today(), "%Y%m%d")

#: The data versions to use.
DATA_VERSIONS = DataVersions(
    alphamissense="1",
    clingen_gene=TODAY,
    clingen_variant=TODAY,
    ensembl_37="87",
    ensembl_38="109",
    ensembl="111",
    today=TODAY,
    dbnsfp="4.5",
    dbscsnv="1.1",
    cadd="1.6",
    gnomad_constraints="4.0",
    gnomad_mtdna="3.1",
    gnomad_v2="2.1.1",
    gnomad_v3="3.1.2",
    gnomad_v4="4.0",
    gnomad_sv="2.1.1",
    gnomad_cnv4="4.0",
    gnomad_sv4="4.0",
    dbvar="20231030",
    dgv="20200225",
    dgv_gs="20160515",
    exac_cnv="0.3.1",
    g1k_svs="phase3v2",
    helixmtdb="20200327",
    ucsc_cons_37="20161007",
    ucsc_cons_38="20190906",
    ucsc_rmsk_37="20200322",
    ucsc_rmsk_38="20221018",
    ucsc_genomic_super_dups_37="20111025",
    ucsc_genomic_super_dups_38="20141019",
    ucsc_alt_seq_liftover_37="20200322",
    ucsc_alt_seq_liftover_38="20221103",
    ucsc_fix_seq_liftover_37="20200524",
    ucsc_fix_seq_liftover_38="20221103",
    refseq_37="105",
    refseq_38="GCF_000001405.40+RS_2023_03",
    dbsnp="b151",
    acmg_sf="3.1",
    hpo="20240116",
    orphadata=TODAY,
    patho_mms="20220730",
    mehari_tx="0.4.4",
    clinvar_release="2023_09",
    clinvar_version="v2.0",
    tracks="0",
    refseq_fe_37="105.20201022",
    refseq_fe_38="110",
)


@api_router.get("/version")
@api_router.post("/version")
async def version():
    """
    Return reev version.

    :return: reev version
    :rtype: str
    """
    if settings.REEV_VERSION:
        version = settings.REEV_VERSION
    else:
        version = subprocess.check_output(["git", "describe", "--tags", "--dirty"]).strip()
    return Response(content=version)


@api_router.get("/frontend-settings")
@api_router.post("/frontend-settings")
async def frontend_settings():
    """
    Return frontend settings.

    :return: frontend settings
    :rtype: dict
    """
    frontend_settings = {
        "matomo_host": settings.MATOMO_HOST,
        "matomo_site_id": settings.MATOMO_SITE_ID,
    }
    return JSONResponse(content=frontend_settings)


@api_router.get("/data-versions")
@api_router.post("/data-versions")
async def data_versions():
    """
    Return versions of data and services used in the application.
    
    :return: A JSON response containing the versions of various data and services.
    :rtype: dict
    """
    return JSONResponse(content=DATA_VERSIONS.__dict__)
