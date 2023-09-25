/** The evidence level. */
enum AcmgEvidenceLevel {
  PathogenicVeryStrong = 'Pathogenic Very Strong',
  PathogenicStrong = 'Pathogenic Strong',
  PathogenicModerate = 'Pathogenic Moderate',
  PathogenicSupporting = 'Pathogenic Supporting',
  BenignStandalone = 'Benign Standalone',
  BenignStrong = 'Benign Strong',
  BenignSupporting = 'Benign Supporting',
  NotSet = 'Not Set'
}

/** Array of pathogenic evidence levels. */
const ACMG_EVIDENCE_LEVELS_PATHOGENIC = [
  AcmgEvidenceLevel.PathogenicVeryStrong,
  AcmgEvidenceLevel.PathogenicStrong,
  AcmgEvidenceLevel.PathogenicModerate,
  AcmgEvidenceLevel.PathogenicSupporting
]

/** Array of benign evidence levels. */
const ACMG_EVIDENCE_LEVELS_BENIGN = [
  AcmgEvidenceLevel.BenignStandalone,
  AcmgEvidenceLevel.BenignStrong,
  AcmgEvidenceLevel.BenignSupporting
]

/** The predefined ACMG criteria. */
enum AcmgCriteria {
  Pvs1 = 'Pvs1',
  Ps1 = 'Ps1',
  Ps2 = 'Ps2',
  Ps3 = 'Ps3',
  Ps4 = 'Ps4',
  Pm1 = 'Pm1',
  Pm2 = 'Pm2',
  Pm3 = 'Pm3',
  Pm4 = 'Pm4',
  Pm5 = 'Pm5',
  Pm6 = 'Pm6',
  Pp1 = 'Pp1',
  Pp2 = 'Pp2',
  Pp3 = 'Pp3',
  Pp4 = 'Pp4',
  Pp5 = 'Pp5',
  Ba1 = 'Ba1',
  Bs1 = 'Bs1',
  Bs2 = 'Bs2',
  Bs3 = 'Bs3',
  Bs4 = 'Bs4',
  Bp1 = 'Bp1',
  Bp2 = 'Bp2',
  Bp3 = 'Bp3',
  Bp4 = 'Bp4',
  Bp5 = 'Bp5',
  Bp6 = 'Bp6',
  Bp7 = 'Bp7'
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
  description: string
}

/** Predefined ACMG criteria. */
const ACMG_CRITERIA_DEFS: Map<AcmgCriteria, CriteriaDefinition> = new Map(
  [
    {
      criteria: AcmgCriteria.Pvs1,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicVeryStrong,
      label: 'PVS1',
      hint: 'Very strong evidence of pathogenicity',
      description: `Null variant (nonsense, frameshift, canonical ±1 or 2 splice sites, initiation codon, 
        single or multi-exon deletion) in a gene where LOF is a known mechanism of disease. Caution! 
        PVS1 confronts with PM4 and PP3! Use as strong if not subject to NMD but >10% of the protein 
        are affected.`
    },
    {
      criteria: AcmgCriteria.Ps1,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicStrong,
      label: 'PS1',
      hint: 'same amino acid change',
      description: `Same amino acid change as a previously established pathogenic variant regardless of 
        nucleotide change. CAVE not applicable for same nucleotide change, for same nucleotide 
        change use PS4.`
    },
    {
      criteria: AcmgCriteria.Ps2,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicStrong,
      label: 'PS2',
      hint: 'de novo (both maternity and paternity confirmed)',
      description: `De novo (both maternity and paternity confirmed) in a patient with the disease and no 
        family history.`
    },
    {
      criteria: AcmgCriteria.Ps3,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicStrong,
      label: 'PS3',
      hint: 'well-established in vitro or in vivo functional studies',
      description: `Well-established in vitro or in vivo functional studies supportive of a damaging effect on 
        the gene or gene product.`
    },
    {
      criteria: AcmgCriteria.Ps4,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicStrong,
      label: 'PS4',
      hint: 'prevalence in disease controls',
      description: `The prevalence of the variant in affected individuals is significantly increased compared 
        with the prevalence in controls.`
    },
    {
      criteria: AcmgCriteria.Pm1,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicModerate,
      label: 'PM1',
      hint: 'variant in hotspot (missense)',
      description: `Located in a mutational hot spot and/or critical and well-established functional domain 
        (e.g., active site of an enzyme) without benign variation.`
    },
    {
      criteria: AcmgCriteria.Pm2,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicModerate,
      label: 'PM2',
      hint: 'absent from controls (or at extremely low frequency if recessive)',
      description: `Absent from controls (or at extremely low frequency if recessive) in Exome Sequencing 
        Project, 1000 Genomes Project, or Exome Aggregation Consortium. New recommendation: use on 
        supporting only.`
    },
    {
      criteria: AcmgCriteria.Pm3,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicModerate,
      label: 'PM3',
      hint: 'AR: trans with known pathogenic',
      description: `For recessive disorders, detected in trans with a pathogenic variant.`
    },
    {
      criteria: AcmgCriteria.Pm4,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicModerate,
      label: 'PM4',
      hint: 'protein length change',
      description: `Protein length changes as a result of in-frame deletions/insertions in a nonrepeat region 
        or stop-loss variants. Do not use in combination with PVS1 or PP3.`
    },
    {
      criteria: AcmgCriteria.Pm5,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicModerate,
      label: 'PM5',
      hint: 'literature: AA exchange same pos',
      description: `Novel missense change at an amino acid residue where a different missense change determined 
        to be pathogenic has been seen before.`
    },
    {
      criteria: AcmgCriteria.Pm6,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicModerate,
      label: 'PM6',
      hint: 'assumed de novo',
      description: `Assumed de novo, but without confirmation of paternity and maternity.`
    },
    {
      criteria: AcmgCriteria.Pp1,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicSupporting,
      label: 'PP1',
      hint: 'cosegregates in family',
      description: `Cosegregation with disease in multiple affected family members in a gene definitively known 
        to cause the disease.`
    },
    {
      criteria: AcmgCriteria.Pp2,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicSupporting,
      label: 'PP2',
      hint: 'few missense in gene',
      description: `Missense variant in a gene that has a low rate of benign missense variation and in which 
        missense variants are a common mechanism of disease.`
    },
    {
      criteria: AcmgCriteria.Pp3,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicSupporting,
      label: 'PP3',
      hint: 'predicted pathogenic',
      description: `Multiple lines of computational evidence support a deleterious effect on the gene or gene 
        product (conservation, evolutionary, splicing impact, etc.). Do not use in combination with 
        PVS1 or PM4.`
    },
    {
      criteria: AcmgCriteria.Pp4,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicSupporting,
      label: 'PP4',
      hint: 'phenotype/pedigree match gene',
      description: `Patient's phenotype or family history is highly specific for a disease with a single 
        genetic etiology.`
    },
    {
      criteria: AcmgCriteria.Pp5,
      defaultEvidenceLevel: AcmgEvidenceLevel.PathogenicSupporting,
      label: 'PP5',
      hint: 'reliable source: pathogenic',
      description: `Reputable source recently reports variant as pathogenic, but the evidence is not available 
        to the laboratoryto perform an independent evaluation. Note: Not recommended to use anymore, 
        use PS3 and PS4 at different levels of evidence.`
    },
    {
      criteria: AcmgCriteria.Ba1,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignStandalone,
      label: 'BA1',
      hint: 'AF > 5% in ExAC, 1000G, or ESP',
      description:
        'Allele frequency is >5% in Exome Sequencing Project, 1000 Genomes Project, or Exome Aggregation Consortium'
    },
    {
      criteria: AcmgCriteria.Bs1,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignStrong,
      label: 'BS1',
      hint: 'disease: allele freq. too high',
      description: 'Allele frequency is greater than expected for disorder'
    },
    {
      criteria: AcmgCriteria.Bs2,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignStrong,
      label: 'BS2',
      hint: 'observed in healthy individual',
      description:
        'Observed in a healthy adult individual for a recessive (homozygous), dominant (heterozygous), or X-linked (hemizygous) disorder, with full penetrance expected at an early age'
    },
    {
      criteria: AcmgCriteria.Bs3,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignStrong,
      label: 'BS3',
      hint: 'functional studies: benign',
      description:
        'Well-established in vitro or in vivo functional studies show no damaging effect on protein function or splicing'
    },
    {
      criteria: AcmgCriteria.Bs4,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignStrong,
      label: 'BS4',
      hint: 'lack of segregation',
      description: 'Lack of segregation in affected members of a family'
    },
    {
      criteria: AcmgCriteria.Bp1,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignSupporting,
      label: 'BP1',
      hint: 'missense in gene with truncating',
      description:
        'Missense variant in a gene for which primarily truncating variants are known to cause disease'
    },
    {
      criteria: AcmgCriteria.Bp2,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignSupporting,
      label: 'BP2',
      hint: 'other variant is causative',
      description:
        'Observed in trans with a pathogenic variant for a fully penetrant dominant gene/disorder or observed in cis with a pathogenic variant in any inheritance pattern'
    },
    {
      criteria: AcmgCriteria.Bp3,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignSupporting,
      label: 'BP3',
      hint: 'in-frame indel',
      description: 'In-frame deletions/insertions in a repetitive region without a known function'
    },
    {
      criteria: AcmgCriteria.Bp4,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignSupporting,
      label: 'BP4',
      hint: 'prediction: benign',
      description:
        'Multiple lines of computational evidence suggest no impact on gene or gene product (conservation, evolutionary,splicing impact, etc.)'
    },
    {
      criteria: AcmgCriteria.Bp5,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignSupporting,
      label: 'BP5',
      hint: 'different gene in other case',
      description: 'Variant found in a case with an alternate molecular basis for disease'
    },
    {
      criteria: AcmgCriteria.Bp6,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignSupporting,
      label: 'BP6',
      hint: 'reputable source: benign',
      description:
        'Reputable source recently reports variant as benign, but the evidence is not available to the laboratory to perform an independent evaluation'
    },
    {
      criteria: AcmgCriteria.Bp7,
      defaultEvidenceLevel: AcmgEvidenceLevel.BenignSupporting,
      label: 'BP7',
      hint: 'silent, no splicing/conservation',
      description:
        'A synonymous (silent) variant for which splicing prediction algorithms predict no impact to the splice consensus sequence nor the creation of a new splice site AND the nucleotide is not highly conserved'
    }
  ].map((def: CriteriaDefinition) => [def.criteria, def])
)

/** The presence of a criteria. */
enum Presence {
  Present = 'Present',
  Absent = 'Absent',
  Unknown = 'Unknown'
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
  Default = 'Default',
  InterVar = 'InterVar',
  User = 'User'
}

/** All state sources from lowest to highest priority. */
const ALL_STATE_SOURCES = [StateSource.Default, StateSource.InterVar, StateSource.User]

/** Mapping from `AcmgCriteria` to `CriteriaState`. */
type CriteriaToState = { [key in AcmgCriteria]: CriteriaState }

/** Mapping from `StateSource` to `CriteriaState` */
type SourceToCriteriaToState = { [key in StateSource]: CriteriaToState }

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
      User: this.createCriteriaStateMap(StateSource.User)
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
    if (
      !this.criteriaStates[source] ||
      !this.criteriaStates[source][criteria] ||
      !this.criteriaStates[source][criteria].presence
    ) {
      throw new Error(`Criteria ${criteria} not found for source ${source}`)
    } else {
      this.criteriaStates[source][criteria].presence = presence
    }
  }

  /** Resets the presence of all criteria for a `StateSource.User` to `Presence.Absent`. */
  setUserPresenceAbsent() {
    for (const criteria of ALL_ACMG_CRITERIA) {
      this.setPresence(StateSource.User, criteria, Presence.Absent)
    }
  }

  /** Resets the presence of all criteria for a `StateSource.User` to a presence of `StateSource.InterVar`. */
  setUserPresenceInterVar() {
    for (const criteria of ALL_ACMG_CRITERIA) {
      const criteriaStateInterVar = this.getCriteriaStateFromSource(criteria, StateSource.InterVar)
      this.setPresence(StateSource.User, criteria, criteriaStateInterVar.presence)
    }
  }

  /** Sets the `evidenceLevel` of a `CriteriaState` for a given `StateSource` and `AcmgCriteria`. */
  setEvidenceLevel(source: StateSource, criteria: AcmgCriteria, evidenceLevel: AcmgEvidenceLevel) {
    if (source === StateSource.Default) {
      throw new Error('Cannot set presence for default source')
    }

    if (
      !this.criteriaStates[source] ||
      !this.criteriaStates[source][criteria] ||
      !this.criteriaStates[source][criteria].evidenceLevel
    ) {
      throw new Error(`Criteria ${criteria} not found for source ${source}`)
    } else {
      this.criteriaStates[source][criteria].evidenceLevel = evidenceLevel
    }
  }

  /** Returns the raw map of states, don't use to modify. */
  getStates() {
    return this.criteriaStates
  }

  /** Returns the number of active criteria with a given evidence level. */
  getActiveEvidenceCounts(evidence: AcmgEvidenceLevel) {
    let count = 0
    for (const criteria of ALL_ACMG_CRITERIA) {
      const criteriaState = this.getCriteriaState(criteria)
      if (criteriaState.evidenceLevel === evidence && criteriaState.presence === Presence.Present) {
        count++
      }
    }
    return count
  }
}

export {
  AcmgCriteria,
  AcmgEvidenceLevel,
  ACMG_CRITERIA_DEFS,
  ALL_ACMG_CRITERIA,
  ALL_STATE_SOURCES,
  ACMG_EVIDENCE_LEVELS_PATHOGENIC,
  ACMG_EVIDENCE_LEVELS_BENIGN,
  type CriteriaDefinition,
  type CriteriaState,
  type CriteriaToState,
  MultiSourceAcmgCriteriaState,
  Presence,
  StateSource
}
