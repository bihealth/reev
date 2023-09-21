interface CriteriaDescType {
  id: string
  label: string
  hint: string
}

const CriteriaDefinitions: Record<string, CriteriaDescType> = {
  pvs1: {
    id: 'pvs1',
    label: 'PVS1',
    hint: 'null variant'
  },
  ps1: {
    id: 'ps1',
    label: 'PS1',
    hint: 'same amino acid change'
  },
  ps2: {
    id: 'ps2',
    label: 'PS2',
    hint: 'de novo (both maternity and paternity confirmed)'
  },
  ps3: {
    id: 'ps3',
    label: 'PS3',
    hint: 'well-established in vitro or in vivo functional studies'
  },
  ps4: {
    id: 'ps4',
    label: 'PS4',
    hint: 'prevalence in disease controls'
  },
  pm1: {
    id: 'pm1',
    label: 'PM1',
    hint: 'variant in hotspot (missense)'
  },
  pm2: {
    id: 'pm2',
    label: 'PM2',
    hint: 'absent from controls (or at extremely low frequency if recessive)'
  },
  pm3: {
    id: 'pm3',
    label: 'PM3',
    hint: 'AR: trans with known pathogenic'
  },
  pm4: {
    id: 'pm4',
    label: 'PM4',
    hint: 'protein length change'
  },
  pm5: {
    id: 'pm5',
    label: 'PM5',
    hint: 'literature: AA exchange same pos'
  },
  pm6: {
    id: 'pm6',
    label: 'PM6',
    hint: 'assumed de novo'
  },
  pp1: {
    id: 'pp1',
    label: 'PP1',
    hint: 'cosegregates in family'
  },
  pp2: {
    id: 'pp2',
    label: 'PP2',
    hint: 'few missense in gene'
  },
  pp3: {
    id: 'pp3',
    label: 'PP3',
    hint: 'predicted pathogenic'
  },
  pp4: {
    id: 'pp4',
    label: 'PP4',
    hint: 'phenotype/pedigree match gene'
  },
  pp5: {
    id: 'pp5',
    label: 'PP5',
    hint: 'reliable source: pathogenic'
  },
  ba1: {
    id: 'ba1',
    label: 'BA1',
    hint: 'AF > 5% in ExAC, 1000G, or ESP'
  },
  bs1: {
    id: 'bs1',
    label: 'BS1',
    hint: 'disease: allele freq. too high'
  },
  bs2: {
    id: 'bs2',
    label: 'BS2',
    hint: 'observed in healthy individual'
  },
  bs3: {
    id: 'bs3',
    label: 'BS3',
    hint: 'functional studies: benign'
  },
  bs4: {
    id: 'bs4',
    label: 'BS4',
    hint: 'lack of segregation'
  },
  bp1: {
    id: 'bp1',
    label: 'BP1',
    hint: 'missense in gene with truncating'
  },
  bp2: {
    id: 'bp2',
    label: 'BP2',
    hint: 'other variant is causative'
  },
  bp3: {
    id: 'bp3',
    label: 'BP3',
    hint: 'in-frame indel'
  },
  bp4: {
    id: 'bp4',
    label: 'BP4',
    hint: 'prediction: benign'
  },
  bp5: {
    id: 'bp5',
    label: 'BP5',
    hint: 'different gene in other case'
  },
  bp6: {
    id: 'bp6',
    label: 'BP6',
    hint: 'reputable source: benign'
  },
  bp7: {
    id: 'bp7',
    label: 'BP7',
    hint: 'silent, no splicing/conservation'
  }
}

enum AcmgEvidenceLevel {
  PVS = 8,
  PS = 4,
  PM = 2,
  PP = 1,
  BA = -8,
  BS = -4,
  BP = -2
}

interface CriteriaStateType {
  id: string
  active: boolean
  evidence: AcmgEvidenceLevel
  description: string
}

const CriteriaState: Record<string, CriteriaStateType> = {
  pvs1: {
    id: 'pvs1',
    active: false,
    evidence: AcmgEvidenceLevel.PVS,
    description:
      'Null variant (nonsense, frameshift, canonical ±1 or 2 splice sites, initiation codon, single or multi-exon deletion) in a gene where LOF is a known mechanism of disease'
  },
  ps1: {
    id: 'ps1',
    active: false,
    evidence: AcmgEvidenceLevel.PS,
    description:
      'Same amino acid change as a previously established pathogenic variant regardless of nucleotide change'
  },
  ps2: {
    id: 'ps2',
    active: false,
    evidence: AcmgEvidenceLevel.PS,
    description:
      'De novo (both maternity and paternity confirmed) in a patient with the disease and no family history'
  },
  ps3: {
    id: 'ps3',
    active: false,
    evidence: AcmgEvidenceLevel.PS,
    description:
      'Well-established in vitro or in vivo functional studies supportive of a damaging effect on the gene or gene product'
  },
  ps4: {
    id: 'ps4',
    active: false,
    evidence: AcmgEvidenceLevel.PS,
    description:
      'The prevalence of the variant in affected individuals is significantly increased compared with the prevalence in controls'
  },
  pm1: {
    id: 'pm1',
    active: false,
    evidence: AcmgEvidenceLevel.PM,
    description:
      'Located in a mutational hot spot and/or critical and well-established functional domain (e.g., active site of an enzyme) without benign variation'
  },
  pm2: {
    id: 'pm2',
    active: false,
    evidence: AcmgEvidenceLevel.PM,
    description:
      'Absent from controls (or at extremely low frequency if recessive) in Exome Sequencing Project, 1000 Genomes Project, or Exome Aggregation Consortium'
  },
  pm3: {
    id: 'pm3',
    active: false,
    evidence: AcmgEvidenceLevel.PM,
    description: 'For recessive disorders, detected in trans with a pathogenic variant'
  },
  pm4: {
    id: 'pm4',
    active: false,
    evidence: AcmgEvidenceLevel.PM,
    description:
      'Protein length changes as a result of in-frame deletions/insertions in a nonrepeat region or stop-loss variants'
  },
  pm5: {
    id: 'pm5',
    active: false,
    evidence: AcmgEvidenceLevel.PM,
    description:
      'Novel missense change at an amino acid residue where a different missense change determined to be pathogenic has been seen before'
  },
  pm6: {
    id: 'pm6',
    active: false,
    evidence: AcmgEvidenceLevel.PM,
    description: 'Assumed de novo, but without confirmation of paternity and maternity'
  },
  pp1: {
    id: 'pp1',
    active: false,
    evidence: AcmgEvidenceLevel.PP,
    description:
      'Cosegregation with disease in multiple affected family members in a gene definitively known to cause the disease'
  },
  pp2: {
    id: 'pp2',
    active: false,
    evidence: AcmgEvidenceLevel.PP,
    description:
      'Missense variant in a gene that has a low rate of benign missense variation and in which missense variants are a common mechanism of disease'
  },
  pp3: {
    id: 'pp3',
    active: false,
    evidence: AcmgEvidenceLevel.PP,
    description:
      'Multiple lines of computational evidence support a deleterious effect on the gene or gene product (conservation, evolutionary, splicing impact, etc.)'
  },
  pp4: {
    id: 'pp4',
    active: false,
    evidence: AcmgEvidenceLevel.PP,
    description:
      "Patient's phenotype or family history is highly specific for a disease with a single genetic etiology"
  },
  pp5: {
    id: 'pp5',
    active: false,
    evidence: AcmgEvidenceLevel.PP,
    description:
      'Reputable source recently reports variant as pathogenic, but the evidence is not available to the laboratoryto perform an independent evaluation'
  },
  ba1: {
    id: 'ba1',
    active: false,
    evidence: AcmgEvidenceLevel.BA,
    description:
      'Allele frequency is >5% in Exome Sequencing Project, 1000 Genomes Project, or Exome Aggregation Consortium'
  },
  bs1: {
    id: 'bs1',
    active: false,
    evidence: AcmgEvidenceLevel.BS,
    description: 'Allele frequency is greater than expected for disorder'
  },
  bs2: {
    id: 'bs2',
    active: false,
    evidence: AcmgEvidenceLevel.BS,
    description:
      'Observed in a healthy adult individual for a recessive (homozygous), dominant (heterozygous), or X-linked (hemizygous) disorder, with full penetrance expected at an early age'
  },
  bs3: {
    id: 'bs3',
    active: false,
    evidence: AcmgEvidenceLevel.BS,
    description:
      'Well-established in vitro or in vivo functional studies show no damaging effect on protein function or splicing'
  },
  bs4: {
    id: 'bs4',
    active: false,
    evidence: AcmgEvidenceLevel.BS,
    description: 'Lack of segregation in affected members of a family'
  },
  bp1: {
    id: 'bp1',
    active: false,
    evidence: AcmgEvidenceLevel.BP,
    description:
      'Missense variant in a gene for which primarily truncating variants are known to cause disease'
  },
  bp2: {
    id: 'bp2',
    active: false,
    evidence: AcmgEvidenceLevel.BP,
    description:
      'Observed in trans with a pathogenic variant for a fully penetrant dominant gene/disorder or observed in cis with a pathogenic variant in any inheritance pattern'
  },
  bp3: {
    id: 'bp3',
    active: false,
    evidence: AcmgEvidenceLevel.BP,
    description: 'In-frame deletions/insertions in a repetitive region without a known function'
  },
  bp4: {
    id: 'bp4',
    active: false,
    evidence: AcmgEvidenceLevel.BP,
    description:
      'Multiple lines of computational evidence suggest no impact on gene or gene product (conservation, evolutionary,splicing impact, etc.)'
  },
  bp5: {
    id: 'bp5',
    active: false,
    evidence: AcmgEvidenceLevel.BP,
    description: 'Variant found in a case with an alternate molecular basis for disease'
  },
  bp6: {
    id: 'bp6',
    active: false,
    evidence: AcmgEvidenceLevel.BP,
    description:
      'Reputable source recently reports variant as benign, but the evidence is not available to the laboratory to perform an independent evaluation'
  },
  bp7: {
    id: 'bp7',
    active: false,
    evidence: AcmgEvidenceLevel.BP,
    description:
      'A synonymous (silent) variant for which splicing prediction algorithms predict no impact to the splice consensus sequence nor the creation of a new splice site AND the nucleotide is not highly conserved'
  }
}

const ACMGRanking = {
  default: { ...CriteriaState },
  interVar: { ...CriteriaState },
  userSelected: { ...CriteriaState }
}

export {
  type CriteriaDescType,
  CriteriaDefinitions,
  AcmgEvidenceLevel,
  type CriteriaStateType,
  CriteriaState,
  ACMGRanking
}
