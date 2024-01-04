import re

import pydantic
import pytest

from app.schemas import common

GOOD_SEQVARS = [
    ("grch37", "1", 123, "A", "T"),
    ("grch38", "1", 123, "A", "T"),
    ("grch37", "22", 123, "A", "T"),
    ("grch37", "X", 123, "A", "T"),
    ("grch37", "Y", 123, "A", "T"),
    ("grch37", "MT", 123, "A", "T"),
    ("grch37", "1", 123, "TA", "T"),
    ("grch37", "1", 123, "A", "AT"),
]


@pytest.mark.parametrize(
    "release,chrom,pos,ref,alt",
    GOOD_SEQVARS,
)
def test_re_seqvar_good(
    release: str,
    chrom: str,
    pos: int,
    ref: str,
    alt: str,
):
    assert re.match(common.RE_SEQVAR, f"{release}-{chrom}-{pos}-{ref}-{alt}") is not None


BAD_SEQVARS = [
    ("T2T", "1", 123, "A", "T"),
    ("GRCh37", "1", 123, "A", "T"),
    ("grch37", "23", 123, "A", "T"),
    ("grch37", "0", 123, "A", "T"),
    ("grch37", "1", 123, "", "T"),
    ("grch37", "1", 123, "A", ""),
    ("grch37", "1", 123, "A", "Tx"),
]


@pytest.mark.parametrize(
    "release,chrom,pos,ref,alt",
    GOOD_SEQVARS,
)
def test_seqvarname_good(
    release: str,
    chrom: str,
    pos: int,
    ref: str,
    alt: str,
):
    class Model(pydantic.BaseModel):
        name: common.SeqvarName

    assert (
        Model(name=f"{release}-{chrom}-{pos}-{ref}-{alt}").name
        == f"{release}-{chrom}-{pos}-{ref}-{alt}"
    )

    class Model2(pydantic.BaseModel):
        name: common.VarName

    assert (
        Model2(name=f"{release}-{chrom}-{pos}-{ref}-{alt}").name
        == f"{release}-{chrom}-{pos}-{ref}-{alt}"
    )


@pytest.mark.parametrize(
    "release,chrom,pos,ref,alt",
    BAD_SEQVARS,
)
def test_re_seqvar_bad(
    release: str,
    chrom: str,
    pos: int,
    ref: str,
    alt: str,
):
    assert re.match(common.RE_SEQVAR, f"{release}-{chrom}-{pos}-{ref}-{alt}") is None


@pytest.mark.parametrize(
    "release,chrom,pos,ref,alt",
    BAD_SEQVARS,
)
def test_seqvarname_bad(
    release: str,
    chrom: str,
    pos: int,
    ref: str,
    alt: str,
):
    class Model(pydantic.BaseModel):
        name: common.SeqvarName

    with pytest.raises(pydantic.ValidationError):
        Model(name=f"{release}-{chrom}-{pos}-{ref}-{alt}")

    class Model2(pydantic.BaseModel):
        name: common.VarName

    with pytest.raises(pydantic.ValidationError):
        Model2(name=f"{release}-{chrom}-{pos}-{ref}-{alt}")


GOOD_STRUCVARS = [
    ("DEL", "grch37", "1", 123, 456),
    ("DUP", "grch37", "1", 123, 456),
    ("DEL", "grch38", "1", 123, 456),
    ("DEL", "grch37", "2", 123, 456),
    ("DEL", "grch37", "22", 123, 456),
    ("DEL", "grch37", "X", 123, 456),
    ("DEL", "grch37", "Y", 123, 456),
    ("DEL", "grch37", "MT", 123, 456),
]


@pytest.mark.parametrize(
    "typ,release,chrom,start,stop",
    GOOD_STRUCVARS,
)
def test_re_strucvar_good(
    typ: str,
    release: str,
    chrom: str,
    start: int,
    stop: str,
):
    assert re.match(common.RE_STRUCVAR, f"{typ}-{release}-{chrom}-{start}-{stop}") is not None


@pytest.mark.parametrize(
    "typ,release,chrom,start,stop",
    GOOD_STRUCVARS,
)
def test_strucvarname_good(
    typ: str,
    release: str,
    chrom: str,
    start: int,
    stop: str,
):
    class Model(pydantic.BaseModel):
        name: common.StrucvarName

    assert (
        Model(name=f"{typ}-{release}-{chrom}-{start}-{stop}").name
        == f"{typ}-{release}-{chrom}-{start}-{stop}"
    )

    class Model2(pydantic.BaseModel):
        name: common.VarName

    assert (
        Model2(name=f"{typ}-{release}-{chrom}-{start}-{stop}").name
        == f"{typ}-{release}-{chrom}-{start}-{stop}"
    )


BAD_STRUCVARS = [
    ("INV", "grch37", "1", 123, 456),
    ("DEL", "GRCh37", "1", 123, 456),
    ("DEL", "grch37", "23", 123, 456),
    ("DEL", "grch37", "0", 123, 456),
]


@pytest.mark.parametrize(
    "typ,release,chrom,start,stop",
    BAD_STRUCVARS,
)
def test_re_strucvar_bad(
    typ: str,
    release: str,
    chrom: str,
    start: int,
    stop: str,
):
    assert re.match(common.RE_STRUCVAR, f"{typ}-{release}-{chrom}-{start}-{stop}") is None


@pytest.mark.parametrize(
    "typ,release,chrom,start,stop",
    BAD_STRUCVARS,
)
def test_strucvarname_bad(
    typ: str,
    release: str,
    chrom: str,
    start: int,
    stop: str,
):
    class Model(pydantic.BaseModel):
        name: common.StrucvarName

    with pytest.raises(pydantic.ValidationError):
        Model(name=f"{typ}-{release}-{chrom}-{start}-{stop}")

    class Model2(pydantic.BaseModel):
        name: common.VarName

    with pytest.raises(pydantic.ValidationError):
        Model2(name=f"{typ}-{release}-{chrom}-{start}-{stop}")


GOOD_HGNCIDS = [
    "HGNC:123",
    "HGNC:345",
]


@pytest.mark.parametrize(
    "hgnc_id",
    GOOD_HGNCIDS,
)
def test_re_hgncid_good(
    hgnc_id: str,
):
    assert re.match(common.RE_HGNCID, hgnc_id) is not None


@pytest.mark.parametrize(
    "hgnc_id",
    GOOD_HGNCIDS,
)
def test_hgncid_good(hgnc_id: str):
    class Model(pydantic.BaseModel):
        name: common.HgncId

    assert Model(name=hgnc_id).name == hgnc_id


BAD_HGNCIDS = ["HGNC:", "123", "HGNC:123x"]


@pytest.mark.parametrize(
    "hgnc_id",
    BAD_HGNCIDS,
)
def test_re_hgncid_bad(hgnc_id: str):
    assert re.match(common.RE_HGNCID, hgnc_id) is None


@pytest.mark.parametrize(
    "hgnc_id",
    BAD_HGNCIDS,
)
def test_hgncid_bad(hgnc_id: str):
    class Model(pydantic.BaseModel):
        name: common.HgncId

    with pytest.raises(pydantic.ValidationError):
        Model(name=hgnc_id)
