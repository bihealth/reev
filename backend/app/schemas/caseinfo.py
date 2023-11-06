from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class Inheritance(Enum):
    AutosomalDominant = "NCIT:C94245"
    AutosomalRecessive = "NCIT:C94246"
    Cosegregation = "NCIT:C94599"
    GeneticAnticipation = "NCIT:C93189"
    GeneticLinkage = "NCIT:C94542"
    XLinkedRecessive = "NCIT:C94247"
    Unknown = "reev:unknown_inheritance"


class Sex(Enum):
    Male = "PATO:0000384"
    Female = "PATO:0000383"
    Unknown = "reev:unknown_sex"


class Ethnicity(Enum):
    AfricanAmerican = "NCIT:C128937"
    AshkenaziJewish = "NCIT:C17950"
    EastAsian = "NCIT:C161419"
    Finnish = "NCIT:C43865"
    European = "NCIT:C43851"
    Latino = "NCIT:C17459"
    MiddleEastern = "NCIT:C43866"
    SouthAsian = "NCIT:C41263"
    Other = "NCIT:C104495"
    Unknown = "reev:unknown_ethnicity"


class Zygosity(Enum):
    Heterozygous = "GENO:0000135"
    Homozygous = "NCIT:C45826"
    CompoundHeterozygous = "NCIT:C198518"
    Unknown = "reev:unknown_zygosity"


class DiseaseTerm(BaseModel):
    # len(term_id) <= 64
    omim_id: str
    # len(name) <= 512
    name: str
    # term_id.startswith("OMIM:") or term_id.startswith("Orphanet:") or term_id.startswith("MONDO:")


class HpoTerm(BaseModel):
    # len(term_id) <= 64
    term_id: str
    # len(name) <= 512
    name: str
    # term_id ~= /^HP:\d{7}$/


class CaseInfoBase(BaseModel):
    user: UUID | None = None
    pseudonym: str | None = None
    diseases: list[DiseaseTerm] | None = None
    hpo_terms: list[HpoTerm] | None = None
    inheritance: Inheritance = Inheritance.Unknown
    affected_family_members: bool | None = None
    sex: Sex = Sex.Unknown
    age_of_onset_month: int | None = None
    ethinicity: Ethnicity = Ethnicity.Unknown
    zygosity: Zygosity = Zygosity.Unknown
    family_segregation: bool | None = None


class CaseInfoCreate(CaseInfoBase):
    pass


class CaseInfoUpdate(CaseInfoBase):
    pass


class CaseInfoInDbBase(CaseInfoBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID


class CaseInfoRead(CaseInfoInDbBase):
    pass


class CaseInfoInDb(CaseInfoInDbBase):
    pass
