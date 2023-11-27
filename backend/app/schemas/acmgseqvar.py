from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class Presence(Enum):
    Present = "present"
    Absent = "absent"
    Unknown = "unknown"


class Evidence(Enum):
    PathogenicVeryStrong = ("Pathogenic Very Strong",)
    PathogenicStrong = ("Pathogenic Strong",)
    PathogenicModerate = ("Pathogenic Moderate",)
    PathogenicSupporting = ("Pathogenic Supporting",)
    BenignStandalone = ("Benign Standalone",)
    BenignStrong = ("Benign Strong",)
    BenignSupporting = ("Benign Supporting",)
    NotSet = "Not Set"


class Criteria(Enum):
    Pvs1 = ("Pvs1",)
    Ps1 = ("Ps1",)
    Ps2 = ("Ps2",)
    Ps3 = ("Ps3",)
    Ps4 = ("Ps4",)
    Pm1 = ("Pm1",)
    Pm2 = ("Pm2",)
    Pm3 = ("Pm3",)
    Pm4 = ("Pm4",)
    Pm5 = ("Pm5",)
    Pm6 = ("Pm6",)
    Pp1 = ("Pp1",)
    Pp2 = ("Pp2",)
    Pp3 = ("Pp3",)
    Pp4 = ("Pp4",)
    Pp5 = ("Pp5",)
    Ba1 = ("Ba1",)
    Bs1 = ("Bs1",)
    Bs2 = ("Bs2",)
    Bs3 = ("Bs3",)
    Bs4 = ("Bs4",)
    Bp1 = ("Bp1",)
    Bp2 = ("Bp2",)
    Bp3 = ("Bp3",)
    Bp4 = ("Bp4",)
    Bp5 = ("Bp5",)
    Bp6 = ("Bp6",)
    Bp7 = "Bp7"


class SeqVarCriteria(BaseModel):
    criteria: Criteria
    presence: Presence
    evidence: Evidence


class AcmgSeqVar(BaseModel):
    user: UUID | None = None
    seqvar_id: str | None = None
    criteria: list[SeqVarCriteria] | None = None


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
