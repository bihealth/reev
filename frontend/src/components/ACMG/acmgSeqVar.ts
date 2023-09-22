/** The evidence level. */
enum AcmgEvidenceLevel {
  PathogenicVeryStrong,
  PathogenicStrong,
  PathogenicModerate,
  PathogenicSupporting,
  BenignStandalone,
  BenignStrong,
  BenignSupporting,
  NotSet
}

/** The predefined ACMG criteria. */
enum AcmgCriteria {
  Pvs1 = "Pvs1",
  Ps1 = "Ps1",
  Ps2 = "Ps2",
  Ps3 = "Ps3",
  Ps4 = "Ps4",
  Pm1 = "Pm1",
  Pm2 = "Pm2",
  Pm3 = "Pm3",
  Pm4 = "Pm4",
  Pm5 = "Pm5",
  Pm6 = "Pm6",
  Pp1 = "Pp1",
  Pp2 = "Pp2",
  Pp3 = "Pp3",
  Pp4 = "Pp4",
  Pp5 = "Pp5",
  Ba1 = "Ba1",
  Bs1 = "Bs1",
  Bs2 = "Bs2",
  Bs3 = "Bs3",
  Bs4 = "Bs4",
  Bp1 = "Bp1",
  Bp2 = "Bp2",
  Bp3 = "Bp3",
  Bp4 = "Bp4",
  Bp5 = "Bp5",
  Bp6 = "Bp6",
  Bp7 = "Bp7"
}

/** Array of all ACMG criteria. */
const ALL_ACMG_CRITERIA = [
  AcmgCriteria.Pvs1,
  AcmgCriteria.Ps1,
  AcmgCriteria.Ps2,
  AcmgCriteria.Ps3,
  AcmgCriteria.Ps4,
  AcmgCriteria.Pm1,
  AcmgCriteria.Pm2,
  AcmgCriteria.Pm3,
  AcmgCriteria.Pm4,
  AcmgCriteria.Pm5,
  AcmgCriteria.Pm6,
  AcmgCriteria.Pp1,
  AcmgCriteria.Pp2,
  AcmgCriteria.Pp3,
  AcmgCriteria.Pp4,
  AcmgCriteria.Pp5,
  AcmgCriteria.Ba1,
  AcmgCriteria.Bs1,
  AcmgCriteria.Bs2,
  AcmgCriteria.Bs3,
  AcmgCriteria.Bs4,
  AcmgCriteria.Bp1,
  AcmgCriteria.Bp2,
  AcmgCriteria.Bp3,
  AcmgCriteria.Bp4,
  AcmgCriteria.Bp5,
  AcmgCriteria.Bp6,
  AcmgCriteria.Bp7
]

/** Detailed definition of one ACMG criteria such as PVS1. */
interface CriteriaDefinition {
  criteria: AcmgCriteria
  defaultEvidenceLevel: AcmgEvidenceLevel
  label: string
  hint: string
}

/** Predefined ACMG criteria. */
const ACMG_CRITERIA_DEFS: Map<AcmgCriteria, CriteriaDefinition> = new Map(
  [
    {
      criteria: AcmgCriteria.Pvs1,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicVeryStrong,
      label: 'PVS1',
      hint: 'Very strong evidence of pathogenicity'
    },
    {
      criteria: AcmgCriteria.Ps1,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicStrong,
      label: 'PS1',
      hint: 'same amino acid change',
    },
    {
      criteria: AcmgCriteria.Ps2,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicStrong,
      label: 'PS2',
      hint: 'de novo (both maternity and paternity confirmed)',
    },
    {
      criteria: AcmgCriteria.Ps3,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicStrong,
      label: 'PS3',
      hint: 'well-established in vitro or in vivo functional studies',
    },
    {
      criteria: AcmgCriteria.Ps4,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicStrong,
      label: 'PS4',
      hint: 'prevalence in disease controls',
    },
    {
      criteria: AcmgCriteria.Pm1,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicModerate,
      label: 'PM1',
      hint: 'variant in hotspot (missense)',
    },
    {
      criteria: AcmgCriteria.Pm2,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicModerate,
      label: 'PM2',
      hint: 'absent from controls (or at extremely low frequency if recessive)',
    },
    {
      criteria: AcmgCriteria.Pm3,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicModerate,
      label: 'PM3',
      hint: 'AR: trans with known pathogenic',
    },
    {
      criteria: AcmgCriteria.Pm4,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicModerate,
      label: 'PM4',
      hint: 'protein length change',
    },
    {
      criteria: AcmgCriteria.Pm5,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicModerate,
      label: 'PM5',
      hint: 'literature: AA exchange same pos',
    },
    {
      criteria: AcmgCriteria.Pm6,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicModerate,
      label: 'PM6',
      hint: 'assumed de novo',
    },
    {
      criteria: AcmgCriteria.Pp1,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicSupporting,
      label: 'PP1',
      hint: 'cosegregates in family',
    },
    {
      criteria: AcmgCriteria.Pp2,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicSupporting,
      label: 'PP2',
      hint: 'few missense in gene',
    },
    {
      criteria: AcmgCriteria.Pp3,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicSupporting,
      label: 'PP3',
      hint: 'predicted pathogenic',
    },
    {
      criteria: AcmgCriteria.Pp4,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicSupporting,
      label: 'PP4',
      hint: 'phenotype/pedigree match gene',
    },
    {
      criteria: AcmgCriteria.Pp5,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicSupporting,
      label: 'PP5',
      hint: 'reliable source: pathogenic',
    },
    {
      criteria: AcmgCriteria.Ba1,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignStandalone,
      label: 'BA1',
      hint: 'AF > 5% in ExAC, 1000G, or ESP',
    },
    {
      criteria: AcmgCriteria.Bs1,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignStrong,
      label: 'BS1',
      hint: 'disease: allele freq. too high',
    },
    {
      criteria: AcmgCriteria.Bs2,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignStrong,
      label: 'BS2',
      hint: 'observed in healthy individual',
    },
    {
      criteria: AcmgCriteria.Bs3,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignStrong,
      label: 'BS3',
      hint: 'functional studies: benign',
    },
    {
      criteria: AcmgCriteria.Bs4,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignStrong,
      label: 'BS4',
      hint: 'lack of segregation',
    },
    {
      criteria: AcmgCriteria.Bp1,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignSupporting,
      label: 'BP1',
      hint: 'missense in gene with truncating',
    },
    {
      criteria: AcmgCriteria.Bp2,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignSupporting,
      label: 'BP2',
      hint: 'other variant is causative',
    },
    {
      criteria: AcmgCriteria.Bp3,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignSupporting,
      label: 'BP3',
      hint: 'in-frame indel',
    },
    {
      criteria: AcmgCriteria.Bp4,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignSupporting,
      label: 'BP4',
      hint: 'prediction: benign',
    },
    {
      criteria: AcmgCriteria.Bp5,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignSupporting,
      label: 'BP5',
      hint: 'different gene in other case',
    },
    {
      criteria: AcmgCriteria.Bp6,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignSupporting,
      label: 'BP6',
      hint: 'reputable source: benign',
    },
    {
      criteria: AcmgCriteria.Bp7,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignSupporting,
      label: 'BP7',
      hint: 'silent, no splicing/conservation',
    }
  ].map((def: CriteriaDefinition) => [def.criteria, def])
)

/** The presence of a criteria. */
enum Presence {
  Present,
  Absent,
  Unknown
}

/** The state of a criteria.
 *
 * Could stem from the default definition (e.g., from the ACMG guidelines paper),
 * user input, or automated prediction tools.
 */
interface CriteriaState {
  /** Criteria referred to. */
  criteria: AcmgCriteria
  /** Whether it's present (true), absent (false), or unknown (null) */
  presence: Presence
  /** Optionally, an evidence level
   *
   * This is used by prediction tools to override the default and by the user
   * to override both default and prediction tools.
   */
  evidenceLevel: AcmgEvidenceLevel
}

/** Define where a given selection state comes from. */
enum StateSource {
  Default = "Default",
  InterVar = "InterVar",
  User = "User"
}

/** All state sources from lowest to highest priority. */
const ALL_STATE_SOURCES = [StateSource.Default, StateSource.InterVar, StateSource.User]

/** Mapping from `AcmgCriteria` to `CriteriaState`. */
type CriteriaToState = {[key in AcmgCriteria]: CriteriaState}

/** Mapping from `StateSource` to `CriteriaState` */
type SourceToCriteriaToState = {[key in StateSource]: CriteriaToState}

/**
 * Contains the ACMG selection states from different sources and handles the
 * logic of merging / overrides.
 */
class MultiSourceAcmgCriteriaState {
  criteriaStates: SourceToCriteriaToState

  constructor() {
    this.criteriaStates = {
      Default: this.createCriteriaStateMap(StateSource.Default),
      InterVar: this.createCriteriaStateMap(StateSource.InterVar),
      User: this.createCriteriaStateMap(StateSource.User),
    }
  }

  /** Creates a map of criteria states for a given source. */
  protected createCriteriaStateMap(source: StateSource): CriteriaToState {
    const isDefault = source === StateSource.Default
    return {
      Pvs1: {
        criteria: AcmgCriteria.Pvs1,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.PathogenicVeryStrong : AcmgEvidenceLevel.NotSet
      },
      Ps1: {
        criteria: AcmgCriteria.Ps1,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.PathogenicStrong : AcmgEvidenceLevel.NotSet
      },
      Ps2: {
        criteria: AcmgCriteria.Ps2,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.PathogenicStrong : AcmgEvidenceLevel.NotSet
      },
      Ps3: {
        criteria: AcmgCriteria.Ps3,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.PathogenicStrong : AcmgEvidenceLevel.NotSet
      },
      Ps4: {
        criteria: AcmgCriteria.Ps4,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.PathogenicStrong : AcmgEvidenceLevel.NotSet
      },
      Pm1: {
        criteria: AcmgCriteria.Pm1,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.PathogenicModerate : AcmgEvidenceLevel.NotSet
      },
      Pm2: {
        criteria: AcmgCriteria.Pm2,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.PathogenicModerate : AcmgEvidenceLevel.NotSet
      },
      Pm3: {
        criteria: AcmgCriteria.Pm3,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.PathogenicModerate : AcmgEvidenceLevel.NotSet
      },
      Pm4: {
        criteria: AcmgCriteria.Pm4,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.PathogenicModerate : AcmgEvidenceLevel.NotSet
      },
      Pm5: {
        criteria: AcmgCriteria.Pm5,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.PathogenicModerate : AcmgEvidenceLevel.NotSet
      },
      Pm6: {
        criteria: AcmgCriteria.Pm6,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.PathogenicModerate : AcmgEvidenceLevel.NotSet
      },
      Pp1: {
        criteria: AcmgCriteria.Pp1,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.PathogenicSupporting : AcmgEvidenceLevel.NotSet
      },
      Pp2: {
        criteria: AcmgCriteria.Pp2,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.PathogenicSupporting : AcmgEvidenceLevel.NotSet
      },
      Pp3: {
        criteria: AcmgCriteria.Pp3,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.PathogenicSupporting : AcmgEvidenceLevel.NotSet
      },
      Pp4: {
        criteria: AcmgCriteria.Pp4,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.PathogenicSupporting : AcmgEvidenceLevel.NotSet
      },
      Pp5: {
        criteria: AcmgCriteria.Pp5,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.PathogenicSupporting : AcmgEvidenceLevel.NotSet
      },
      Ba1: {
        criteria: AcmgCriteria.Ba1,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.BenignStandalone : AcmgEvidenceLevel.NotSet
      },
      Bs1: {
        criteria: AcmgCriteria.Bs1,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.BenignStrong : AcmgEvidenceLevel.NotSet
      },
      Bs2: {
        criteria: AcmgCriteria.Bs2,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.BenignStrong : AcmgEvidenceLevel.NotSet
      },
      Bs3: {
        criteria: AcmgCriteria.Bs3,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.BenignStrong : AcmgEvidenceLevel.NotSet
      },
      Bs4: {
        criteria: AcmgCriteria.Bs4,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.BenignStrong : AcmgEvidenceLevel.NotSet
      },
      Bp1: {
        criteria: AcmgCriteria.Bp1,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.BenignSupporting : AcmgEvidenceLevel.NotSet
      },
      Bp2: {
        criteria: AcmgCriteria.Bp2,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.BenignSupporting : AcmgEvidenceLevel.NotSet
      },
      Bp3: {
        criteria: AcmgCriteria.Bp3,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.BenignSupporting : AcmgEvidenceLevel.NotSet
      },
      Bp4: {
        criteria: AcmgCriteria.Bp4,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.BenignSupporting : AcmgEvidenceLevel.NotSet
      },
      Bp5: {
        criteria: AcmgCriteria.Bp5,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.BenignSupporting : AcmgEvidenceLevel.NotSet
      },
      Bp6: {
        criteria: AcmgCriteria.Bp6,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.BenignSupporting : AcmgEvidenceLevel.NotSet
      },
      Bp7: {
        criteria: AcmgCriteria.Bp7,
        presence: Presence.Unknown,
        evidenceLevel: isDefault ? AcmgEvidenceLevel.BenignSupporting : AcmgEvidenceLevel.NotSet
      }
    }
  }

  /** Gets the effective `CriteriaState` for an `AcmgCriteria`.*/
  getCriteriaState(criteria: AcmgCriteria): CriteriaState {
    let presence = Presence.Unknown
    let evidenceLevel = AcmgEvidenceLevel.NotSet

    for (const stateSource of ALL_STATE_SOURCES) {
      if (!this.criteriaStates[stateSource]) {
        continue
      }
      
      const criteriaState = this.criteriaStates[stateSource][criteria]
      if (criteriaState) {
        if (criteriaState.criteria !== criteria) {
          throw new Error('criteria mismatch; should never happen')
        }

        if (criteriaState.presence !== Presence.Unknown) {
          presence = criteriaState.presence
        }
        if (criteriaState.evidenceLevel !== AcmgEvidenceLevel.NotSet) {
          evidenceLevel = criteriaState.evidenceLevel
        }
      }
    }

    return {
      criteria,
      presence,
      evidenceLevel
    }
  }

  /** Get the `CriteriaState` for an explicit `StateSource`.
   *
   * This will be the original object, do not modify it.
   */
  getCriteriaStateFromSource(criteria: AcmgCriteria, source: StateSource): CriteriaState {
    if (!this.criteriaStates[source] || !this.criteriaStates[source][criteria]) {
      throw new Error(`Criteria ${criteria} not found for source ${source}`)
    } else {
      return this.criteriaStates[source][criteria]
    }
  }

  /** Sets the `presence` of a `CriteriaState` for a given `StateSource` and `AcmgCriteria. */
  setPresence(source: StateSource, criteria: AcmgCriteria, presence: Presence) {
    if (source === StateSource.Default) {
      throw new Error('Cannot set presence for default source')
    }

    if (!this.criteriaStates[source] || !this.criteriaStates[source][criteria] || !this.criteriaStates[source][criteria].presence) {
      throw new Error(`Criteria ${criteria} not found for source ${source}`)
    } else {
      this.criteriaStates[source][criteria].presence = presence
    }
  }

  /** Sets the `evidenceLevel` of a `CriteriaState` for a given `StateSource` and `AcmgCriteria`. */
  setEvidenceLevel(source: StateSource, criteria: AcmgCriteria, evidenceLevel: AcmgEvidenceLevel) {
    if (source === StateSource.Default) {
      throw new Error('Cannot set presence for default source')
    }

    if (!this.criteriaStates[source] || !this.criteriaStates[source][criteria] || !this.criteriaStates[source][criteria].evidenceLevel) {
      throw new Error(`Criteria ${criteria} not found for source ${source}`)
    } else {
      this.criteriaStates[source][criteria].evidenceLevel = evidenceLevel
    }
  }

  /** Returns the raw map of states, don't use to modify. */
  getStates() {
    return this.criteriaStates
  }
}
