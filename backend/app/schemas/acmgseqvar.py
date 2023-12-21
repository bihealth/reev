from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class Presence(str, Enum):
    Present = "Present"
    Absent = "Absent"
    Unknown = "Unknown"


class Evidence(str, Enum):
    PathogenicVeryStrong = "Pathogenic Very Strong"
    PathogenicStrong = "Pathogenic Strong"
    PathogenicModerate = "Pathogenic Moderate"
    PathogenicSupporting = "Pathogenic Supporting"
    BenignStandalone = "Benign Standalone"
    BenignStrong = "Benign Strong"
    BenignSupporting = "Benign Supporting"
    NotSet = "Not Set"


class Criteria(str, Enum):
    PVS1 = "PVS1"
    PS1 = "PS1"
    PS2 = "PS2"
    PS3 = "PS3"
    PS4 = "PS4"
    PM1 = "PM1"
    PM2 = "PM2"
    PM3 = "PM3"
    PM4 = "PM4"
    PM5 = "PM5"
    PM6 = "PM6"
    PP1 = "PP1"
    PP2 = "PP2"
    PP3 = "PP3"
    PP4 = "PP4"
    BA1 = "BA1"
    BS1 = "BS1"
    BS2 = "BS2"
    BS3 = "BS3"
    BS4 = "BS4"
    BP1 = "BP1"
    BP2 = "BP2"
    BP3 = "BP3"
    BP4 = "BP4"
    BP5 = "BP5"
    BP7 = "BP7"


class SeqVarCriteria(BaseModel):
    criteria: Criteria
    presence: Presence
    evidence: Evidence


class AcmgRank(BaseModel):
    criterias: list[SeqVarCriteria]
    comment: str


class AcmgSeqVar(BaseModel):
    user: UUID | None = None
    seqvar_name: str | None = None
    acmg_rank: AcmgRank | None = None


class AcmgSeqVarCreate(AcmgSeqVar):
    pass


class AcmgSeqVarUpdate(AcmgSeqVar):
    pass


class AcmgSeqVarInDbBase(AcmgSeqVar):
    model_config = ConfigDict(from_attributes=True)

    id: UUID


class AcmgSeqVarRead(AcmgSeqVarInDbBase):
    pass


class AcmgSeqVarInDb(AcmgSeqVarInDbBase):
    pass
