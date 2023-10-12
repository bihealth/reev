/** The predefined ACMG criteria for DEL CNVs. */
enum AcmgCriteriaCNVLoss {
  Loss1A = 'L1A',
  Loss1B = 'L1B',
  Loss2A = 'L2A',
  Loss2B = 'L2B',
  Loss2C1 = 'L2C-1',
  Loss2C2 = 'L2C-2',
  Loss2D1 = 'L2D-1',
  Loss2D2 = 'L2D-2',
  Loss2D3 = 'L2D-3',
  Loss2D4 = 'L2D-4',
  Loss2E = 'L2E',
  Loss2F = 'L2F',
  Loss2G = 'L2G',
  Loss2H = 'L2H',
  Loss3A = 'L3A',
  Loss3B = 'L3B',
  Loss3C = 'L3C',
  Loss4A = 'L4A',
  Loss4B = 'L4B',
  Loss4C = 'L4C',
  Loss4D = 'L4D',
  Loss4E = 'L4E',
  Loss4F = 'L4F',
  Loss4G = 'L4G',
  Loss4H = 'L4H',
  Loss4I = 'L4I',
  Loss4J = 'L4J',
  Loss4K = 'L4K',
  Loss4L = 'L4L',
  Loss4M = 'L4M',
  Loss4N = 'L4N',
  Loss4O = 'L4O',
  Loss5A = 'L5A',
  Loss5B = 'L5B',
  Loss5C = 'L5C',
  Loss5D = 'L5D',
  Loss5E = 'L5E',
  Loss5F = 'L5F',
  Loss5G = 'L5G',
  Loss5H = 'L5H'
}

/** The predefined ACMG criteria for DUP CNVs. */
enum AcmgCriteriaCNVGain {
  Gain1A = 'G1A',
  Gain1B = 'G1B',
  Gain2A = 'G2A',
  Gain2B = 'G2B',
  Gain2C = 'G2C',
  Gain2D = 'G2D',
  Gain2E = 'G2E',
  Gain2F = 'G2F',
  Gain2G = 'G2G',
  Gain2H = 'G2H',
  Gain2I = 'G2I',
  Gain2J = 'G2J',
  Gain2K = 'G2K',
  Gain2L = 'G2L',
  Gain3A = 'G3A',
  Gain3B = 'G3B',
  Gain3C = 'G3C',
  Gain4A = 'G4A',
  Gain4B = 'G4B',
  Gain4C = 'G4C',
  Gain4D = 'G4D',
  Gain4E = 'G4E',
  Gain4F = 'G4F',
  Gain4G = 'G4G',
  Gain4H = 'G4H',
  Gain4I = 'G4I',
  Gain4J = 'G4J',
  Gain4K = 'G4K',
  Gain4L = 'G4L',
  Gain4M = 'G4M',
  Gain4N = 'G4N',
  Gain4O = 'G4O',
  Gain5A = 'G5A',
  Gain5B = 'G5B',
  Gain5C = 'G5C',
  Gain5D = 'G5D',
  Gain5E = 'G5E',
  Gain5F = 'G5F',
  Gain5G = 'G5G',
  Gain5H = 'G5H'
}

/** Array of all ACMG criteria for DEL CNVs. */
const ACMG_CRITERIA_CNV_LOSS = [
  AcmgCriteriaCNVLoss.Loss1A,
  AcmgCriteriaCNVLoss.Loss1B,
  AcmgCriteriaCNVLoss.Loss2A,
  AcmgCriteriaCNVLoss.Loss2B,
  AcmgCriteriaCNVLoss.Loss2C1,
  AcmgCriteriaCNVLoss.Loss2C2,
  AcmgCriteriaCNVLoss.Loss2D1,
  AcmgCriteriaCNVLoss.Loss2D2,
  AcmgCriteriaCNVLoss.Loss2D3,
  AcmgCriteriaCNVLoss.Loss2D4,
  AcmgCriteriaCNVLoss.Loss2E,
  AcmgCriteriaCNVLoss.Loss2F,
  AcmgCriteriaCNVLoss.Loss2G,
  AcmgCriteriaCNVLoss.Loss2H,
  AcmgCriteriaCNVLoss.Loss3A,
  AcmgCriteriaCNVLoss.Loss3B,
  AcmgCriteriaCNVLoss.Loss3C,
  AcmgCriteriaCNVLoss.Loss4A,
  AcmgCriteriaCNVLoss.Loss4B,
  AcmgCriteriaCNVLoss.Loss4C,
  AcmgCriteriaCNVLoss.Loss4D,
  AcmgCriteriaCNVLoss.Loss4E,
  AcmgCriteriaCNVLoss.Loss4F,
  AcmgCriteriaCNVLoss.Loss4G,
  AcmgCriteriaCNVLoss.Loss4H,
  AcmgCriteriaCNVLoss.Loss4I,
  AcmgCriteriaCNVLoss.Loss4J,
  AcmgCriteriaCNVLoss.Loss4K,
  AcmgCriteriaCNVLoss.Loss4L,
  AcmgCriteriaCNVLoss.Loss4M,
  AcmgCriteriaCNVLoss.Loss4N,
  AcmgCriteriaCNVLoss.Loss4O,
  AcmgCriteriaCNVLoss.Loss5A,
  AcmgCriteriaCNVLoss.Loss5B,
  AcmgCriteriaCNVLoss.Loss5C,
  AcmgCriteriaCNVLoss.Loss5D,
  AcmgCriteriaCNVLoss.Loss5E,
  AcmgCriteriaCNVLoss.Loss5F,
  AcmgCriteriaCNVLoss.Loss5G,
  AcmgCriteriaCNVLoss.Loss5H
]

/** Array of all ACMG criteria for DUP CNVs. */
const ACMG_CRITERIA_CNV_GAIN = [
  AcmgCriteriaCNVGain.Gain1A,
  AcmgCriteriaCNVGain.Gain1B,
  AcmgCriteriaCNVGain.Gain2A,
  AcmgCriteriaCNVGain.Gain2B,
  AcmgCriteriaCNVGain.Gain2D,
  AcmgCriteriaCNVGain.Gain2E,
  AcmgCriteriaCNVGain.Gain2F,
  AcmgCriteriaCNVGain.Gain2G,
  AcmgCriteriaCNVGain.Gain2H,
  AcmgCriteriaCNVGain.Gain2I,
  AcmgCriteriaCNVGain.Gain2J,
  AcmgCriteriaCNVGain.Gain2K,
  AcmgCriteriaCNVGain.Gain2L,
  AcmgCriteriaCNVGain.Gain3A,
  AcmgCriteriaCNVGain.Gain3B,
  AcmgCriteriaCNVGain.Gain3C,
  AcmgCriteriaCNVGain.Gain4A,
  AcmgCriteriaCNVGain.Gain4B,
  AcmgCriteriaCNVGain.Gain4C,
  AcmgCriteriaCNVGain.Gain4D,
  AcmgCriteriaCNVGain.Gain4E,
  AcmgCriteriaCNVGain.Gain4F,
  AcmgCriteriaCNVGain.Gain4G,
  AcmgCriteriaCNVGain.Gain4H,
  AcmgCriteriaCNVGain.Gain4I,
  AcmgCriteriaCNVGain.Gain4J,
  AcmgCriteriaCNVGain.Gain4K,
  AcmgCriteriaCNVGain.Gain4L,
  AcmgCriteriaCNVGain.Gain4M,
  AcmgCriteriaCNVGain.Gain4N,
  AcmgCriteriaCNVGain.Gain4O,
  AcmgCriteriaCNVGain.Gain5A,
  AcmgCriteriaCNVGain.Gain5B,
  AcmgCriteriaCNVGain.Gain5C,
  AcmgCriteriaCNVGain.Gain5D,
  AcmgCriteriaCNVGain.Gain5E,
  AcmgCriteriaCNVGain.Gain5F,
  AcmgCriteriaCNVGain.Gain5G,
  AcmgCriteriaCNVGain.Gain5H
]

/** Detailed definition of one ACMG criteria. */
interface CriteriaCNVDefinition {
  criteria: AcmgCriteriaCNVLoss | AcmgCriteriaCNVGain
  defaultScore: number | null
  minScore?: number
  maxScore: number
  label: string
  hint: string
  description: string
  conflictingEvidence: Array<AcmgCriteriaCNVLoss | AcmgCriteriaCNVGain>
  slider: boolean
}

/** Predefined ACMG criteria for CNVs. */
const ACMG_CRITERIA_CNV_DEFS: Map<
  AcmgCriteriaCNVLoss | AcmgCriteriaCNVGain,
  CriteriaCNVDefinition
> = new Map(
  [
    {
      criteria: AcmgCriteriaCNVLoss.Loss1A,
      defaultScore: 0,
      maxScore: 0,
      label: '1A',
      hint: 'Copy number loss content',
      description: `Contains protein-coding or other known functionally important elements.`,
      conflictingEvidence: [AcmgCriteriaCNVLoss.Loss1B],
      slider: false
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss1B,
      defaultScore: -0.6,
      maxScore: -0.6,
      label: '1B',
      hint: '',
      description: `Does NOT contain protein-coding or any known functionally important elements.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss1A,
        AcmgCriteriaCNVLoss.Loss2A,
        AcmgCriteriaCNVLoss.Loss2B,
        AcmgCriteriaCNVLoss.Loss2C1,
        AcmgCriteriaCNVLoss.Loss2C2,
        AcmgCriteriaCNVLoss.Loss2D1,
        AcmgCriteriaCNVLoss.Loss2D2,
        AcmgCriteriaCNVLoss.Loss2D3,
        AcmgCriteriaCNVLoss.Loss2D4,
        AcmgCriteriaCNVLoss.Loss3B,
        AcmgCriteriaCNVLoss.Loss3C
      ],
      slider: false
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss2A,
      defaultScore: 1,
      minScore: 0,
      maxScore: 1,
      label: '2A',
      hint: 'Overlap with ESTABLISHED HI genes or genomic regions and consideration of reason for referral',
      description: `Complete overlap of an established HI gene or genomic region.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss1B,
        AcmgCriteriaCNVLoss.Loss2E,
        AcmgCriteriaCNVLoss.Loss2F,
        AcmgCriteriaCNVLoss.Loss2G,
        AcmgCriteriaCNVLoss.Loss2H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss2B,
      defaultScore: 0,
      maxScore: 0,
      label: '2B',
      hint: 'Continue evaluation',
      description: `Partial overlap of an established HI genomic region
      • The observed CNV does NOT contain the known causative gene or critical region for this
      established HI genomic region OR
      • Unclear if known causative gene or critical region is affected OR
      • No specific causative gene or critical region has been established for this HI
      genomic region.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss1B,
        AcmgCriteriaCNVLoss.Loss2E,
        AcmgCriteriaCNVLoss.Loss2F,
        AcmgCriteriaCNVLoss.Loss2G,
        AcmgCriteriaCNVLoss.Loss2H
      ],
      slider: false
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss2C1,
      defaultScore: 0.9,
      minScore: 0.45,
      maxScore: 1,
      label: '2C-1',
      hint: 'range: 0.45 - 1.0',
      description: `Partial overlap with the 5' end of an established HI gene (3' end of the gene not
        involved) and coding sequence is involved.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss1B,
        AcmgCriteriaCNVLoss.Loss2E,
        AcmgCriteriaCNVLoss.Loss2F,
        AcmgCriteriaCNVLoss.Loss2G,
        AcmgCriteriaCNVLoss.Loss2H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss2C2,
      defaultScore: 0,
      minScore: 0,
      maxScore: 0.45,
      label: '2C-2',
      hint: 'range: 0.45 - 1.0',
      description: `Partial overlap with the 5' end of an established HI gene (3' end of the gene not
        involved) and only the 5' UTR is involved.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss1B,
        AcmgCriteriaCNVLoss.Loss2E,
        AcmgCriteriaCNVLoss.Loss2F,
        AcmgCriteriaCNVLoss.Loss2G,
        AcmgCriteriaCNVLoss.Loss2H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss2D1,
      defaultScore: 0,
      maxScore: 0,
      label: '2D-1',
      hint: 'Continue evaluation',
      description: `Partial overlap with the 3' end of an established HI gene (5' end of the gene not
        involved) and only 3' untransalted region is involved.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss1B,
        AcmgCriteriaCNVLoss.Loss2E,
        AcmgCriteriaCNVLoss.Loss2F,
        AcmgCriteriaCNVLoss.Loss2G,
        AcmgCriteriaCNVLoss.Loss2H
      ],
      slider: false
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss2D2,
      defaultScore: 0.9,
      minScore: 0.45,
      maxScore: 0.9,
      label: '2D-2',
      hint: 'range: 0.45 - 0.9',
      description: `Partial overlap with the 3' end of an established HI gene (5' end of the gene not
        involved) and only the last exon is involved. Other established pathogenic variants have
        been reported in this exon.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss1B,
        AcmgCriteriaCNVLoss.Loss2E,
        AcmgCriteriaCNVLoss.Loss2F,
        AcmgCriteriaCNVLoss.Loss2G,
        AcmgCriteriaCNVLoss.Loss2H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss2D3,
      defaultScore: 0.3,
      minScore: 0,
      maxScore: 0.45,
      label: '2D-3',
      hint: 'range: 0.3 - 0.45',
      description: `Partial overlap with the 3' end of an established HI gene (5' end of the gene not
        involved) and only the last exon is involved. No other established pathogenic variants have
        been reported in this exon.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss1B,
        AcmgCriteriaCNVLoss.Loss2E,
        AcmgCriteriaCNVLoss.Loss2F,
        AcmgCriteriaCNVLoss.Loss2G,
        AcmgCriteriaCNVLoss.Loss2H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss2D4,
      defaultScore: 0.9,
      minScore: 0.45,
      maxScore: 1,
      label: '2D-4',
      hint: 'range: 0.45 - 1.0',
      description: `Partial overlap with the 3' end of an established HI gene (5' end of the gene not
        involved) and it includes other exons in addition to the last exon. Nonsense-mediated
        decay is expected to occur.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss1B,
        AcmgCriteriaCNVLoss.Loss2E,
        AcmgCriteriaCNVLoss.Loss2F,
        AcmgCriteriaCNVLoss.Loss2G,
        AcmgCriteriaCNVLoss.Loss2H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss2E,
      defaultScore: 0,
      minScore: 0,
      maxScore: 0.9,
      label: '2E',
      hint: `See ClinGen SVI working group
      PVS1 specifications
      • PVS1
      = 0.90
      (Range: 0.45 to 0.90)
      • PVS1_Strong
      = 0.45
      (Range: 0.30 to 0.90)
      • PVS1_Moderate or PM4 (in-frame
      indels)
      = 0.30
      (Range: 0.15 to 0.45)
      • PVS1_Supporting
      = 0.15
      (Range: 0 to 0.30)
      • N/A
      = No points, but continue
      evaluation`,
      description: `Both breakpoints are within the same gene (intragenic CNV; gene-level sequence
        variant). See ClinGen SVI working group
        PVS1 specifications
        • PVS1
        = 0.90
        (Range: 0.45 to 0.90)
        • PVS1_Strong
        = 0.45
        (Range: 0.30 to 0.90)
        • PVS1_Moderate or PM4 (in-frame
        indels)
        = 0.30
        (Range: 0.15 to 0.45)
        • PVS1_Supporting
        = 0.15
        (Range: 0 to 0.30)
        • N/A
        = No points, but continue
        evaluation.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss1B,
        AcmgCriteriaCNVLoss.Loss2A,
        AcmgCriteriaCNVLoss.Loss2B,
        AcmgCriteriaCNVLoss.Loss2C1,
        AcmgCriteriaCNVLoss.Loss2C2,
        AcmgCriteriaCNVLoss.Loss2D1,
        AcmgCriteriaCNVLoss.Loss2D2,
        AcmgCriteriaCNVLoss.Loss2D3,
        AcmgCriteriaCNVLoss.Loss2D4,
        AcmgCriteriaCNVLoss.Loss2F,
        AcmgCriteriaCNVLoss.Loss2G,
        AcmgCriteriaCNVLoss.Loss2H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss2F,
      defaultScore: -1,
      minScore: -1,
      maxScore: 0,
      label: '2F',
      hint: 'Overlap with ESTABLISHED benign genes or genomic regions',
      description: `Completely contained within an established benign CNV region.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss2A,
        AcmgCriteriaCNVLoss.Loss2B,
        AcmgCriteriaCNVLoss.Loss2C1,
        AcmgCriteriaCNVLoss.Loss2C2,
        AcmgCriteriaCNVLoss.Loss2D1,
        AcmgCriteriaCNVLoss.Loss2D2,
        AcmgCriteriaCNVLoss.Loss2D3,
        AcmgCriteriaCNVLoss.Loss2D4,
        AcmgCriteriaCNVLoss.Loss2E,
        AcmgCriteriaCNVLoss.Loss2G,
        AcmgCriteriaCNVLoss.Loss2H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss2G,
      defaultScore: 0,
      maxScore: 0,
      label: '2G',
      hint: 'Continue evaluation',
      description: `Overlaps an established benign CNV, but includes additional genomic material.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss1B,
        AcmgCriteriaCNVLoss.Loss2A,
        AcmgCriteriaCNVLoss.Loss2B,
        AcmgCriteriaCNVLoss.Loss2C1,
        AcmgCriteriaCNVLoss.Loss2C2,
        AcmgCriteriaCNVLoss.Loss2D1,
        AcmgCriteriaCNVLoss.Loss2D2,
        AcmgCriteriaCNVLoss.Loss2D3,
        AcmgCriteriaCNVLoss.Loss2D4,
        AcmgCriteriaCNVLoss.Loss2E,
        AcmgCriteriaCNVLoss.Loss2F,
        AcmgCriteriaCNVLoss.Loss2H
      ],
      slider: false
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss2H,
      defaultScore: 0.15,
      maxScore: 0.15,
      label: '2H',
      hint: 'Haploinsufficiency predictors',
      description: `Two or more HI predictors suggest that AT LEAST ONE gene in the interval is HI.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss1B,
        AcmgCriteriaCNVLoss.Loss2A,
        AcmgCriteriaCNVLoss.Loss2B,
        AcmgCriteriaCNVLoss.Loss2C1,
        AcmgCriteriaCNVLoss.Loss2C2,
        AcmgCriteriaCNVLoss.Loss2D1,
        AcmgCriteriaCNVLoss.Loss2D2,
        AcmgCriteriaCNVLoss.Loss2D3,
        AcmgCriteriaCNVLoss.Loss2D4,
        AcmgCriteriaCNVLoss.Loss2E,
        AcmgCriteriaCNVLoss.Loss2F,
        AcmgCriteriaCNVLoss.Loss2G
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss3A,
      defaultScore: 0,
      maxScore: 0,
      label: '3A',
      hint: 'Number of protein-coding RefSeq genes wholly or partially included in the copy-number loss',
      description: `0-24 genes.`,
      conflictingEvidence: [AcmgCriteriaCNVLoss.Loss3B, AcmgCriteriaCNVLoss.Loss3C],
      slider: false
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss3B,
      defaultScore: 0.45,
      minScore: 0,
      maxScore: 0.45,
      label: '3B',
      hint: '',
      description: `25-34 genes.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss1B,
        AcmgCriteriaCNVLoss.Loss2E,
        AcmgCriteriaCNVLoss.Loss3A,
        AcmgCriteriaCNVLoss.Loss3C
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss3C,
      defaultScore: 0.9,
      minScore: 0.45,
      maxScore: 0.9,
      label: '3C',
      hint: '',
      description: `35+ genes.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss1B,
        AcmgCriteriaCNVLoss.Loss2E,
        AcmgCriteriaCNVLoss.Loss3A,
        AcmgCriteriaCNVLoss.Loss3B
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss4A,
      defaultScore: 0.3,
      minScore: 0,
      maxScore: 0.9,
      label: '4A',
      hint: `Confirmed de novo: 0.45 points each Assumed de novo: 0.30 points each (range: 0.15 to 0.45)`,
      description: `Reported proband (from literature, public databases, or internal lab data) has either:
      • A complete deletion of or a LOF variant within gene encompassed by the observed
      copy-number loss OR
      • An overlapping copy-number loss similar in genomic content to the observed copynumber loss AND 
      the reported phenotype is highly specific and relatively unique to the gene or
      genomic region,`,
      conflictingEvidence: [AcmgCriteriaCNVLoss.Loss4B, AcmgCriteriaCNVLoss.Loss4C],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss4B,
      defaultScore: 0.3,
      minScore: 0,
      maxScore: 0.9,
      label: '4B',
      hint: `Confirmed de novo: 0.30 points each Assumed de novo: 0.15 point each (range: 0 to 0.45)`,
      description: `Reported proband (from literature, public databases, or internal lab data) has either:
      • A complete deletion of or a LOF variant within gene encompassed by the observed
      copy-number loss OR
      • An overlapping copy-number loss similar in genomic content to the observed copynumber loss AND 
      the reported phenotype is consistent with the gene/genomic region, is highly
      specific, but not necessarily unique to the gene/genomic region.`,
      conflictingEvidence: [AcmgCriteriaCNVLoss.Loss4A, AcmgCriteriaCNVLoss.Loss4C],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss4C,
      defaultScore: 0.15,
      minScore: 0,
      maxScore: 0.9,
      label: '4C',
      hint: `Confirmed de novo: 0.15 point each Assumed de novo: 0.10 point each (range: 0 to 0.30)`,
      description: `Reported proband (from literature, public databases, or internal lab data) has either:
      • A complete deletion of or a LOF variant within gene encompassed by the observed
      copy-number loss OR
      • An overlapping copy-number loss similar in genomic content to the observed copynumber loss AND 
      the reported phenotype is consistent with the gene/genomic region, but not highly
      specific and/or with high genetic heterogeneity.`,
      conflictingEvidence: [AcmgCriteriaCNVLoss.Loss4A, AcmgCriteriaCNVLoss.Loss4B],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss4D,
      defaultScore: 0,
      minScore: -0.3,
      maxScore: 0,
      label: '4D',
      hint: 'Individual case evidence — inconsistent phenotype (range: 0 to -0.3)',
      description: `Reported proband (from literature, public databases, or internal lab data) has either:
      • A complete deletion of or a LOF variant within gene encompassed by the observed
      copy-number loss OR
      • An overlapping copy-number loss similar in genomic content to the observed copynumber loss AND 
      the reported phenotype is NOT consistent with what is expected for the gene/
      genomic region or not consistent in general.`,
      conflictingEvidence: [],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss4E,
      defaultScore: 0.1,
      minScore: 0,
      maxScore: 0.3,
      label: '4E',
      hint: 'Individual case evidence — unknown inheritance (range: 0 to 0.15)',
      description: `Reported proband has a highly specific phenotype consistent with the gene/genomic
      region, but the inheritance of the variant is unknown.`,
      conflictingEvidence: [],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss4F,
      defaultScore: 0.15,
      minScore: 0,
      maxScore: 0.15,
      label: '4F',
      hint: 'Individual case evidence — segregation among similarly affected family members',
      description: `3-4 observed segregations.`,
      conflictingEvidence: [],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss4G,
      defaultScore: 0.3,
      minScore: 0,
      maxScore: 0.3,
      label: '4G',
      hint: '',
      description: `5-6 observed segregations.`,
      conflictingEvidence: [],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss4H,
      defaultScore: 0.45,
      minScore: 0,
      maxScore: 0.45,
      label: '4H',
      hint: '',
      description: `7+ observed segregations.`,
      conflictingEvidence: [],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss4I,
      defaultScore: -0.45,
      minScore: -0.9,
      maxScore: 0,
      label: '4I',
      hint: `Individual case evidence — nonsegregations -0.45 points per family (range: 0 to -0.45)`,
      description: `Variant is NOT found in another individual in the proband's family AFFECTED with a
      consistent, specific, well-defined phenotype (no known phenocopies).`,
      conflictingEvidence: [],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss4J,
      defaultScore: -0.3,
      minScore: -0.9,
      maxScore: 0,
      label: '4J',
      hint: `-0.30 points per family (range: 0 to -0.30)`,
      description: `Variant IS found in another individual in the proband's family UNAFFECTED with the
      specific, well-defined phenotype observed in the proband.`,
      conflictingEvidence: [],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss4K,
      defaultScore: -0.15,
      minScore: -0.3,
      maxScore: 0,
      label: '4K',
      hint: `-0.15 points per family (range: 0 to -0.15)`,
      description: `Variant IS found in another individual in the proband's family UNAFFECTED with the
      nonspecific phenotype observed in the proband`,
      conflictingEvidence: [],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss4L,
      defaultScore: 0.45,
      minScore: 0,
      maxScore: 0.45,
      label: '4L',
      hint: 'Case-control and population evidence. 0.45 per study (range: 0 to 0.45 per study)',
      description: `Statistically significant increase amongst observations in cases (with a consistent,
        specific, well-defined phenotype) compared with controls.`,
      conflictingEvidence: [],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss4M,
      defaultScore: 0.3,
      minScore: 0,
      maxScore: 0.45,
      label: '4M',
      hint: '0.30 per study (range: 0 to 0.30 per study',
      description: `Statistically significant increase amongst observations in cases (without a
        consistent, nonspecific phenotype OR unknown phenotype) compared with
        controls.`,
      conflictingEvidence: [],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss4N,
      defaultScore: -0.9,
      minScore: -0.9,
      maxScore: 0,
      label: '4N',
      hint: '-0.90 (per study) (range: 0 to -0.90 per study',
      description: `No statistically significant difference between observations in cases and controls.`,
      conflictingEvidence: [],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss4O,
      defaultScore: -0.9,
      minScore: -0.9,
      maxScore: 0,
      label: '4O',
      hint: '(range: 0 to -1)',
      description: `Overlap with common population variation.`,
      conflictingEvidence: [],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss5A,
      defaultScore: 0,
      minScore: 0,
      maxScore: 0.45,
      label: '5A',
      hint: `Observed copy-number loss is de novo. Use de novo scoring categories from section 4 
      (4A-4D) to determine score`,
      description: `Use appropriate category from de novo scoring section in section 4.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss5B,
        AcmgCriteriaCNVLoss.Loss5C,
        AcmgCriteriaCNVLoss.Loss5D,
        AcmgCriteriaCNVLoss.Loss5E,
        AcmgCriteriaCNVLoss.Loss5F,
        AcmgCriteriaCNVLoss.Loss5G,
        AcmgCriteriaCNVLoss.Loss5H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss5B,
      defaultScore: -0.3,
      minScore: -0.45,
      maxScore: 0,
      label: '5B',
      hint: `Observed copy-number loss is inherited. (range: 0 to -0.45)`,
      description: `Patient with specific, well-defined phenotype and no family history. CNV is
      inherited from an apparently unaffected parent.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss5A,
        AcmgCriteriaCNVLoss.Loss5C,
        AcmgCriteriaCNVLoss.Loss5D,
        AcmgCriteriaCNVLoss.Loss5E,
        AcmgCriteriaCNVLoss.Loss5F,
        AcmgCriteriaCNVLoss.Loss5G,
        AcmgCriteriaCNVLoss.Loss5H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss5C,
      defaultScore: -0.15,
      minScore: -0.3,
      maxScore: 0,
      label: '5C',
      hint: `(range: 0 to -0.30)`,
      description: ` Patient with nonspecific phenotype and no family history. CNV is inherited from an
      apparently unaffected parent.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss5A,
        AcmgCriteriaCNVLoss.Loss5B,
        AcmgCriteriaCNVLoss.Loss5D,
        AcmgCriteriaCNVLoss.Loss5E,
        AcmgCriteriaCNVLoss.Loss5F,
        AcmgCriteriaCNVLoss.Loss5G,
        AcmgCriteriaCNVLoss.Loss5H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss5D,
      defaultScore: 0,
      minScore: 0,
      maxScore: 0.45,
      label: '5D',
      hint: `Use segregation scoring categories from section 4 (4F-4H) to determine score`,
      description: `CNV segregates with a consistent phenotype observed in the patient's family.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss5A,
        AcmgCriteriaCNVLoss.Loss5B,
        AcmgCriteriaCNVLoss.Loss5C,
        AcmgCriteriaCNVLoss.Loss5E,
        AcmgCriteriaCNVLoss.Loss5F,
        AcmgCriteriaCNVLoss.Loss5G,
        AcmgCriteriaCNVLoss.Loss5H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss5E,
      defaultScore: 0,
      minScore: -0.45,
      maxScore: 0,
      label: '5E',
      hint: `Observed copy-number loss — nonsegregations. Use nonsegregation scoring categories
      from section 4 (4I-4K) to determine score`,
      description: `Use appropriate category from nonsegregation section in section 4.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss5A,
        AcmgCriteriaCNVLoss.Loss5B,
        AcmgCriteriaCNVLoss.Loss5C,
        AcmgCriteriaCNVLoss.Loss5D,
        AcmgCriteriaCNVLoss.Loss5F,
        AcmgCriteriaCNVLoss.Loss5G,
        AcmgCriteriaCNVLoss.Loss5H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss5F,
      defaultScore: 0,
      maxScore: 0,
      label: '5F',
      hint: `Other`,
      description: `Inheritance information is unavailable or uninformative.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss5A,
        AcmgCriteriaCNVLoss.Loss5B,
        AcmgCriteriaCNVLoss.Loss5C,
        AcmgCriteriaCNVLoss.Loss5D,
        AcmgCriteriaCNVLoss.Loss5E,
        AcmgCriteriaCNVLoss.Loss5G,
        AcmgCriteriaCNVLoss.Loss5H
      ],
      slider: false
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss5G,
      defaultScore: 0.1,
      minScore: 0,
      maxScore: 0.15,
      label: '5G',
      hint: '(range: 0 to 0.15)',
      description: `Inheritance information is unavailable or uninformative. The patient phenotype is
      nonspecific, but is consistent with what has been described in similar cases.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss5A,
        AcmgCriteriaCNVLoss.Loss5B,
        AcmgCriteriaCNVLoss.Loss5C,
        AcmgCriteriaCNVLoss.Loss5D,
        AcmgCriteriaCNVLoss.Loss5E,
        AcmgCriteriaCNVLoss.Loss5F,
        AcmgCriteriaCNVLoss.Loss5H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVLoss.Loss5H,
      defaultScore: 0.3,
      minScore: 0,
      maxScore: 0.3,
      label: '5H',
      hint: '(range: 0 to 0.30)',
      description: `Inheritance information is unavailable or uninformative. The patient phenotype is
      highly specific and consistent with what has been described in similar cases.`,
      conflictingEvidence: [
        AcmgCriteriaCNVLoss.Loss5A,
        AcmgCriteriaCNVLoss.Loss5B,
        AcmgCriteriaCNVLoss.Loss5C,
        AcmgCriteriaCNVLoss.Loss5D,
        AcmgCriteriaCNVLoss.Loss5E,
        AcmgCriteriaCNVLoss.Loss5F,
        AcmgCriteriaCNVLoss.Loss5G
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain1A,
      defaultScore: 0,
      maxScore: 0,
      label: '1A',
      hint: `Copy number gain content (Continue evaluation)`,
      description: `Contains protein-coding or other known functionally important elements.`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain1B],
      slider: false
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain1B,
      defaultScore: -0.6,
      maxScore: -0.6,
      label: '1B',
      hint: '',
      description: `Does NOT contain protein-coding or any known functionally important elements.`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain1A,
        AcmgCriteriaCNVGain.Gain2A,
        AcmgCriteriaCNVGain.Gain2B,
        AcmgCriteriaCNVGain.Gain2E,
        AcmgCriteriaCNVGain.Gain2G,
        AcmgCriteriaCNVGain.Gain2H,
        AcmgCriteriaCNVGain.Gain2I,
        AcmgCriteriaCNVGain.Gain2J,
        AcmgCriteriaCNVGain.Gain2K,
        AcmgCriteriaCNVGain.Gain2L,
        AcmgCriteriaCNVGain.Gain3B,
        AcmgCriteriaCNVGain.Gain3C
      ],
      slider: false
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain2A,
      defaultScore: 1,
      minScore: 0,
      maxScore: 1,
      label: '2A',
      hint: `Overlap with ESTABLISHED TS genes or genomic regions`,
      description: `Complete overlap; the TS gene or minimal critical region is fully contained within the
      observed copy-number gain.`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain1B,
        AcmgCriteriaCNVGain.Gain2C,
        AcmgCriteriaCNVGain.Gain2D,
        AcmgCriteriaCNVGain.Gain2E,
        AcmgCriteriaCNVGain.Gain2F,
        AcmgCriteriaCNVGain.Gain2I
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain2B,
      defaultScore: 0,
      maxScore: 0,
      label: '2B',
      hint: `Continue evaluation`,
      description: `Partial overlap of an established TS region
      • The observed CNV does NOT contain the known causative gene or critical region for this
      established TS genomic region OR
      • Unclear if the known causative gene or critical region is affected OR
      • No specific causative gene or critical region has been established for this TS genomic region.`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain1B,
        AcmgCriteriaCNVGain.Gain2C,
        AcmgCriteriaCNVGain.Gain2D
      ],
      slider: false
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain2C,
      defaultScore: -1,
      minScore: -1,
      maxScore: 0,
      label: '2C',
      hint: `Overlap with ESTABLISHED benign copy-number gain genes or genomic regions`,
      description: `Identical in gene content to the established benign copy-number gain.`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain2A, AcmgCriteriaCNVGain.Gain2B],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain2D,
      defaultScore: -1,
      minScore: -1,
      maxScore: 0,
      label: '2D',
      hint: '',
      description: `Smaller than established benign copy-number gain, breakpoint(s) does not interrupt
      protein-coding genes.`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain2A, AcmgCriteriaCNVGain.Gain2B],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain2E,
      defaultScore: 0,
      maxScore: 0,
      label: '2E',
      hint: 'Continue evaluation',
      description: ` Smaller than established benign copy-number gain, breakpoint(s) potentially interrupts
      protein-coding gene.`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain1B, AcmgCriteriaCNVGain.Gain2A],
      slider: false
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain2F,
      defaultScore: -0.9,
      minScore: -1,
      maxScore: 0,
      label: '2F',
      hint: '(range: 0 to -1)',
      description: `Larger than known benign copy-number gain, does not include additional proteincoding genes.`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain2A],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain2G,
      defaultScore: 0,
      maxScore: 0,
      label: '2G',
      hint: 'Continue evaluation',
      description: ` Overlaps a benign copy-number gain but includes additional genomic material.`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain1B],
      slider: false
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain2H,
      defaultScore: 0,
      maxScore: 0,
      label: '2H',
      hint: `Overlap with ESTABLISHED HI gene(s). Continue evaluation`,
      description: `HI gene fully contained within observed copy-number gain.`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain1B, AcmgCriteriaCNVGain.Gain2I],
      slider: false
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain2I,
      defaultScore: 0,
      minScore: 0,
      maxScore: 0.9,
      label: '2I',
      hint: `Breakpoint(s) within ESTABLISHED HI genes. See ClinGen SVI working group
      PVS1 specifications
      • PVS1
      = 0.90
      (Range: 0.45 to 0.90)
      • PVS1_Strong
      = 0.45
      (Range: 0.30 to 0.90)
      • N/A
      = 0 (Continue evaluation)`,
      description: ` Both breakpoints are within the same gene (gene-level sequence variant, possibly resulting
        in loss of function [LOF]). See ClinGen SVI working group
        PVS1 specifications
        • PVS1
        = 0.90
        (Range: 0.45 to 0.90)
        • PVS1_Strong
        = 0.45
        (Range: 0.30 to 0.90)
        • N/A
        = 0 (Continue evaluation).`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain1B,
        AcmgCriteriaCNVGain.Gain2H,
        AcmgCriteriaCNVGain.Gain2J,
        AcmgCriteriaCNVGain.Gain2K
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain2J,
      defaultScore: 0,
      maxScore: 0,
      label: '2J',
      hint: 'Continue evaluation',
      description: `One breakpoint is within an established HI gene, patient's phenotype is either inconsistent
      with what is expected for LOF of that gene OR unknown`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain1B, AcmgCriteriaCNVGain.Gain2I],
      slider: false
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain2K,
      defaultScore: 0.45,
      minScore: 0,
      maxScore: 0.45,
      label: '2K',
      hint: '',
      description: `One breakpoint is within an established HI gene, patient's phenotype is highly specific and
      consistent with what is expected for LOF of that gene.`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain1B, AcmgCriteriaCNVGain.Gain2I],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain2L,
      defaultScore: 0,
      maxScore: 0,
      label: '2L',
      hint: 'Breakpoints within other gene(s). Continue evaluation',
      description: ` One or both breakpoints are within gene(s) of no established clinical significance.`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain1B],
      slider: false
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain3A,
      defaultScore: 0,
      maxScore: 0,
      label: '3A',
      hint: `Number of protein-coding RefSeq genes wholly or partially included in the copy-number gain`,
      description: `0-34 genes.`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain3B, AcmgCriteriaCNVGain.Gain3C],
      slider: false
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain3B,
      defaultScore: 0.45,
      minScore: 0,
      maxScore: 0.45,
      label: '3B',
      hint: '',
      description: `35-49 genes.`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain1B,
        AcmgCriteriaCNVGain.Gain2I,
        AcmgCriteriaCNVGain.Gain3A,
        AcmgCriteriaCNVGain.Gain3C
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain3C,
      defaultScore: 0.9,
      minScore: 0,
      maxScore: 0.9,
      label: '3C',
      hint: '',
      description: `50+ genes.`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain1B,
        AcmgCriteriaCNVGain.Gain2I,
        AcmgCriteriaCNVGain.Gain3A,
        AcmgCriteriaCNVGain.Gain3B
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain4A,
      defaultScore: 0.3,
      minScore: 0,
      maxScore: 0.9,
      label: '4A',
      hint: `Confirmed de novo: 0.45 points each
      Assumed de novo: 0.30 points each (range:
      0.15 to 0.45)`,
      description: `Reported proband (from literature, public databases, or internal lab data) has either:
      • complete duplication of one or more genes within the observed copy-number gain OR
      • an overlapping copy-number gain similar in genomic content to the observed copy-number
      gain AND the reported phenotype is highly specific and relatively unique to the gene or genomic
      region.`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain4B,
        AcmgCriteriaCNVGain.Gain4C,
        AcmgCriteriaCNVGain.Gain4D
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain4B,
      defaultScore: 0.15,
      minScore: 0,
      maxScore: 0.9,
      label: '4B',
      hint: `Confirmed de novo: 0.30 points each
      Assumed de novo: 0.15 point each (range: 0
      to 0.45)`,
      description: `Reported proband (from literature, public databases, or internal lab data) has either:
      • complete duplication of one or more genes within the observed copy-number gain OR
      • an overlapping copy-number gain similar in genomic content to the observed copy-number
      gain AND the reported phenotype is consistent with the gene/genomic region, is highly specific,
      but is not necessarily unique to the gene/genomic region.`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain4A,
        AcmgCriteriaCNVGain.Gain4C,
        AcmgCriteriaCNVGain.Gain4D
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain4C,
      defaultScore: 0.15,
      minScore: 0,
      maxScore: 0.9,
      label: '4C',
      hint: `Confirmed de novo: 0.15 point each
      Assumed de novo: 0.10 point each (range: 0
      to 0.30)`,
      description: `Reported proband (from literature, public databases, or internal lab data) has either:
      • complete duplication of one or more genes within the observed copy-number gain OR
      • an overlapping copy-number gain similar in genomic content to the observed copy-number
      gain AND the reported phenotype is consistent with the gene/genomic region, but not highly
      specific and/or with high genetic heterogeneity.`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain4A,
        AcmgCriteriaCNVGain.Gain4B,
        AcmgCriteriaCNVGain.Gain4D
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain4D,
      defaultScore: 0,
      minScore: -0.3,
      maxScore: 0,
      label: '4D',
      hint: `Individual case evidence — inconsistent phenotype. 0 points each (range: 0 to -0.30)`,
      description: `Reported proband (from literature, public databases, or internal lab data) has either:
      • complete duplication of one or more genes within the observed copy-number gain OR
      • an overlapping copy-number gain similar in genomic content to the observed copy-number
      gain AND the reported phenotype is NOT consistent with the gene/genomic region or not
      consistent in general.`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain4A,
        AcmgCriteriaCNVGain.Gain4B,
        AcmgCriteriaCNVGain.Gain4C
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain4E,
      defaultScore: 0.1,
      minScore: 0,
      maxScore: 0.3,
      label: '4A',
      hint: `Individual case evidence — unknown inheritance. 0.10 points each (range: 0 to 0.15)`,
      description: `Reported proband has a highly specific phenotype consistent with the gene/genomic
      region, but the inheritance of the variant is unknown.`,
      conflictingEvidence: [],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain4F,
      defaultScore: 0.15,
      minScore: 0,
      maxScore: 0.45,
      label: '4F',
      hint: `Individual case evidence — segregation among similarly affected family members`,
      description: `3-4 observed segregations.`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain4G, AcmgCriteriaCNVGain.Gain4H],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain4G,
      defaultScore: 0.3,
      minScore: 0,
      maxScore: 0.3,
      label: '4G',
      hint: '',
      description: `5-6 observed segregations.`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain4F, AcmgCriteriaCNVGain.Gain4H],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain4H,
      defaultScore: 0.45,
      minScore: 0,
      maxScore: 0.45,
      label: '4H',
      hint: '',
      description: `7+ observed segregations.`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain4F, AcmgCriteriaCNVGain.Gain4G],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain4I,
      defaultScore: -0.45,
      minScore: -0.9,
      maxScore: 0,
      label: '4I',
      hint: `Individual case evidence — nonsegregations. -0.45 points per family (range: 0 to -0.45)`,
      description: `Variant is NOT found in another individual in the proband's family AFFECTED with a
      consistent, specific, well-defined phenotype (no known phenocopies).`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain4K],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain4J,
      defaultScore: -0.3,
      maxScore: -0.9,
      label: '4J',
      hint: `-0.30 points per family (range: 0 to -0.30)`,
      description: ` Variant IS found in another individual in the proband's family UNAFFECTED with the
      specific, well-defined phenotype observed in the proband.`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain4K],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain4K,
      defaultScore: -0.15,
      minScore: -0.3,
      maxScore: 0,
      label: '4K',
      hint: `-0.15 points per family (range: 0 to -0.15)`,
      description: `Variant IS found in another individual in the proband's family UNAFFECTED with the
      nonspecific phenotype observed in the proband.`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain4I, AcmgCriteriaCNVGain.Gain4J],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain4L,
      defaultScore: 0.45,
      minScore: 0,
      maxScore: 0.45,
      label: '4L',
      hint: `Case-control and population evidence. 0.45 per study (range: 0 to 0.45 per study)`,
      description: `Statistically significant increase among observations in cases (with a consistent, specific,
        well-defined phenotype) compared with controls.`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain4M],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain4M,
      defaultScore: 0.3,
      minScore: 0,
      maxScore: 0.45,
      label: '4M',
      hint: `0.30 per study (range: 0 to 0.30 per study)`,
      description: `Statistically significant increase among observations in cases (with a consistent,
        nonspecific phenotype or unknown phenotype) compared with controls.`,
      conflictingEvidence: [AcmgCriteriaCNVGain.Gain4L],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain4N,
      defaultScore: -0.9,
      minScore: -0.9,
      maxScore: 0,
      label: '4N',
      hint: `-0.90 (per study) (range: 0 to -0.90 per study)`,
      description: `No statistically significant difference between observations in cases and controls.`,
      conflictingEvidence: [],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain4O,
      defaultScore: -0.9,
      minScore: -0.9,
      maxScore: 0,
      label: '4O',
      hint: `(range: 0 to -1)`,
      description: `Overlap with common population variation.`,
      conflictingEvidence: [],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain5A,
      defaultScore: 0,
      minScore: 0,
      maxScore: 0.45,
      label: '5A',
      hint: `Observed copy-number gain is de novo. Use de novo scoring categories from section 4 (4A-4D) to determine score`,
      description: `Use appropriate category from de novo scoring section in section 4.`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain5B,
        AcmgCriteriaCNVGain.Gain5C,
        AcmgCriteriaCNVGain.Gain5D,
        AcmgCriteriaCNVGain.Gain5E,
        AcmgCriteriaCNVGain.Gain5F,
        AcmgCriteriaCNVGain.Gain5G,
        AcmgCriteriaCNVGain.Gain5H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain5B,
      defaultScore: -0.3,
      minScore: -0.45,
      maxScore: 0,
      label: '5B',
      hint: `Observed copy-number gain is inherited. (range: 0 to -0.45)`,
      description: `Patient with a specific, well-defined phenotype and no family history. Copy-number
      gain is inherited from an apparently unaffected parent.`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain5A,
        AcmgCriteriaCNVGain.Gain5C,
        AcmgCriteriaCNVGain.Gain5D,
        AcmgCriteriaCNVGain.Gain5E,
        AcmgCriteriaCNVGain.Gain5F,
        AcmgCriteriaCNVGain.Gain5G,
        AcmgCriteriaCNVGain.Gain5H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain5C,
      defaultScore: -0.15,
      minScore: -0.3,
      maxScore: 0,
      label: '5C',
      hint: `(range: 0 to -0.30)`,
      description: `Patient with nonspecific phenotype and no family history. Copy-number gain is
      inherited from an apparently unaffected parent.`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain5A,
        AcmgCriteriaCNVGain.Gain5B,
        AcmgCriteriaCNVGain.Gain5D,
        AcmgCriteriaCNVGain.Gain5E,
        AcmgCriteriaCNVGain.Gain5F,
        AcmgCriteriaCNVGain.Gain5G,
        AcmgCriteriaCNVGain.Gain5H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain5D,
      defaultScore: 0.45,
      minScore: 0,
      maxScore: 0.45,
      label: '5D',
      hint: `Use segregation scoring categories from in
      section 4 (4F-4H) to determine score`,
      description: `CNV segregates with consistent phenotype observed in the patient's family.`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain5A,
        AcmgCriteriaCNVGain.Gain5B,
        AcmgCriteriaCNVGain.Gain5C,
        AcmgCriteriaCNVGain.Gain5E,
        AcmgCriteriaCNVGain.Gain5F,
        AcmgCriteriaCNVGain.Gain5G,
        AcmgCriteriaCNVGain.Gain5H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain5E,
      defaultScore: -0.45,
      minScore: -0.45,
      maxScore: 0,
      label: '5E',
      hint: `Observed copy-number gain — nonsegregations. Use nonsegregation scoring categories from
      section 4 (4I-4K) to determine score`,
      description: `Use appropriate category from nonsegregation section in section 4.`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain5A,
        AcmgCriteriaCNVGain.Gain5B,
        AcmgCriteriaCNVGain.Gain5C,
        AcmgCriteriaCNVGain.Gain5D,
        AcmgCriteriaCNVGain.Gain5F,
        AcmgCriteriaCNVGain.Gain5G,
        AcmgCriteriaCNVGain.Gain5H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain5F,
      defaultScore: 0,
      maxScore: 0,
      label: '5F',
      hint: ``,
      description: `Inheritance information is unavailable or uninformative.`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain5A,
        AcmgCriteriaCNVGain.Gain5B,
        AcmgCriteriaCNVGain.Gain5C,
        AcmgCriteriaCNVGain.Gain5D,
        AcmgCriteriaCNVGain.Gain5E,
        AcmgCriteriaCNVGain.Gain5G,
        AcmgCriteriaCNVGain.Gain5H
      ],
      slider: false
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain5G,
      defaultScore: 0.1,
      minScore: 0,
      maxScore: 0.15,
      label: '5G',
      hint: `(range: 0 to 0.15)`,
      description: `Inheritance information is unavailable or uninformative. The patient phenotype is
      nonspecific, but is consistent with what has been described in similar cases.`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain5A,
        AcmgCriteriaCNVGain.Gain5B,
        AcmgCriteriaCNVGain.Gain5C,
        AcmgCriteriaCNVGain.Gain5D,
        AcmgCriteriaCNVGain.Gain5E,
        AcmgCriteriaCNVGain.Gain5F,
        AcmgCriteriaCNVGain.Gain5H
      ],
      slider: true
    },
    {
      criteria: AcmgCriteriaCNVGain.Gain5H,
      defaultScore: 0.3,
      minScore: 0,
      maxScore: 0.3,
      label: '5H',
      hint: `(range: 0 to 0.30)`,
      description: `. Inheritance information is unavailable or uninformative. The patient phenotype is highly
      specific and consistent with what has been described in similar cases.`,
      conflictingEvidence: [
        AcmgCriteriaCNVGain.Gain5A,
        AcmgCriteriaCNVGain.Gain5B,
        AcmgCriteriaCNVGain.Gain5C,
        AcmgCriteriaCNVGain.Gain5D,
        AcmgCriteriaCNVGain.Gain5E,
        AcmgCriteriaCNVGain.Gain5F,
        AcmgCriteriaCNVGain.Gain5G
      ],
      slider: true
    }
  ].map((def: CriteriaCNVDefinition) => [def.criteria, def])
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
interface CriteriaCNVState {
  /** Criteria referred to. */
  criteria: AcmgCriteriaCNVLoss | AcmgCriteriaCNVGain
  /** Presence of criteria. */
  presence: Presence
  /** The evidence score
   *
   * This is used by prediction tools to override the default and by the user
   * to override both default and prediction tools.
   */
  score: number | null
}

/** Define where a given selection state comes from. */
enum StateSourceCNV {
  Default = 'Default',
  AutoCNV = 'AutoCNV',
  User = 'User'
}

/** All state sources from lowest to highest priority. */
const ALL_STATE_SOURCES = [StateSourceCNV.Default, StateSourceCNV.AutoCNV, StateSourceCNV.User]

/** Mapping from `AcmgCriteriaCNV` to `CriteriaCNVState`. */
type CriteriaToState = { [key in AcmgCriteriaCNVLoss | AcmgCriteriaCNVGain]?: CriteriaCNVState }

/** Mapping from `StateSourceCNV` to `CriteriaCNVState` */
type SourceToCriteriaToState = { [key in StateSourceCNV]: CriteriaToState }

/**
 * Contains the ACMG selection states from different sources and handles the
 * logic of merging / overrides.
 */
class MultiSourceAcmgCriteriaCNVState {
  svType: string
  CriteriaCNVStates: SourceToCriteriaToState

  constructor(cnvType: string) {
    this.svType = cnvType
    this.CriteriaCNVStates = {
      Default: this.createCriteriaCNVStateMap(StateSourceCNV.Default, cnvType),
      AutoCNV: this.createCriteriaCNVStateMap(StateSourceCNV.AutoCNV, cnvType),
      User: this.createCriteriaCNVStateMap(StateSourceCNV.User, cnvType)
    }
  }

  /** Creates a map of criteria states for a given source. */
  protected createCriteriaCNVStateMap(source: StateSourceCNV, cnvType: string): CriteriaToState {
    const isDefault = source === StateSourceCNV.Default
    if (cnvType === 'DEL') {
      return {
        L1A: {
          criteria: AcmgCriteriaCNVLoss.Loss1A,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss1A) : null
        },
        L1B: {
          criteria: AcmgCriteriaCNVLoss.Loss1B,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss1B) : null
        },
        L2A: {
          criteria: AcmgCriteriaCNVLoss.Loss2A,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss2A) : null
        },
        L2B: {
          criteria: AcmgCriteriaCNVLoss.Loss2B,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss2B) : null
        },
        'L2C-1': {
          criteria: AcmgCriteriaCNVLoss.Loss2C1,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss2C1) : null
        },
        'L2C-2': {
          criteria: AcmgCriteriaCNVLoss.Loss2C2,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss2C2) : null
        },
        'L2D-1': {
          criteria: AcmgCriteriaCNVLoss.Loss2D1,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss2D1) : null
        },
        'L2D-2': {
          criteria: AcmgCriteriaCNVLoss.Loss2D2,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss2D2) : null
        },
        'L2D-3': {
          criteria: AcmgCriteriaCNVLoss.Loss2D3,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss2D3) : null
        },
        'L2D-4': {
          criteria: AcmgCriteriaCNVLoss.Loss2D4,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss2D4) : null
        },
        L2E: {
          criteria: AcmgCriteriaCNVLoss.Loss2E,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss2E) : null
        },
        L2F: {
          criteria: AcmgCriteriaCNVLoss.Loss2F,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss2F) : null
        },
        L2G: {
          criteria: AcmgCriteriaCNVLoss.Loss2G,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss2G) : null
        },
        L2H: {
          criteria: AcmgCriteriaCNVLoss.Loss2H,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss2H) : null
        },
        L3A: {
          criteria: AcmgCriteriaCNVLoss.Loss3A,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss3A) : null
        },
        L3B: {
          criteria: AcmgCriteriaCNVLoss.Loss3B,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss3B) : null
        },
        L3C: {
          criteria: AcmgCriteriaCNVLoss.Loss3C,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss3C) : null
        },
        L4A: {
          criteria: AcmgCriteriaCNVLoss.Loss4A,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss4A) : null
        },
        L4B: {
          criteria: AcmgCriteriaCNVLoss.Loss4B,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss4B) : null
        },
        L4C: {
          criteria: AcmgCriteriaCNVLoss.Loss4C,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss4C) : null
        },
        L4D: {
          criteria: AcmgCriteriaCNVLoss.Loss4D,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss4D) : null
        },
        L4E: {
          criteria: AcmgCriteriaCNVLoss.Loss4E,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss4E) : null
        },
        L4F: {
          criteria: AcmgCriteriaCNVLoss.Loss4F,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss4F) : null
        },
        L4G: {
          criteria: AcmgCriteriaCNVLoss.Loss4G,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss4G) : null
        },
        L4H: {
          criteria: AcmgCriteriaCNVLoss.Loss4H,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss4H) : null
        },
        L4I: {
          criteria: AcmgCriteriaCNVLoss.Loss4I,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss4I) : null
        },
        L4J: {
          criteria: AcmgCriteriaCNVLoss.Loss4J,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss4J) : null
        },
        L4K: {
          criteria: AcmgCriteriaCNVLoss.Loss4K,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss4K) : null
        },
        L4L: {
          criteria: AcmgCriteriaCNVLoss.Loss4L,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss4L) : null
        },
        L4M: {
          criteria: AcmgCriteriaCNVLoss.Loss4M,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss4M) : null
        },
        L4N: {
          criteria: AcmgCriteriaCNVLoss.Loss4N,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss4N) : null
        },
        L4O: {
          criteria: AcmgCriteriaCNVLoss.Loss4O,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss4O) : null
        },
        L5A: {
          criteria: AcmgCriteriaCNVLoss.Loss5A,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss5A) : null
        },
        L5B: {
          criteria: AcmgCriteriaCNVLoss.Loss5B,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss5B) : null
        },
        L5C: {
          criteria: AcmgCriteriaCNVLoss.Loss5C,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss5C) : null
        },
        L5D: {
          criteria: AcmgCriteriaCNVLoss.Loss5D,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss5D) : null
        },
        L5E: {
          criteria: AcmgCriteriaCNVLoss.Loss5E,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss5E) : null
        },
        L5F: {
          criteria: AcmgCriteriaCNVLoss.Loss5F,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss5F) : null
        },
        L5G: {
          criteria: AcmgCriteriaCNVLoss.Loss5G,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss5G) : null
        },
        L5H: {
          criteria: AcmgCriteriaCNVLoss.Loss5H,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVLoss.Loss5H) : null
        }
      }
    } else if (cnvType === 'DUP') {
      return {
        G1A: {
          criteria: AcmgCriteriaCNVGain.Gain1A,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain1A) : null
        },
        G1B: {
          criteria: AcmgCriteriaCNVGain.Gain1B,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain1B) : null
        },
        G2A: {
          criteria: AcmgCriteriaCNVGain.Gain2A,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain2A) : null
        },
        G2B: {
          criteria: AcmgCriteriaCNVGain.Gain2B,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain2B) : null
        },
        G2C: {
          criteria: AcmgCriteriaCNVGain.Gain2C,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain2C) : null
        },
        G2D: {
          criteria: AcmgCriteriaCNVGain.Gain2D,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain2D) : null
        },
        G2E: {
          criteria: AcmgCriteriaCNVGain.Gain2E,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain2E) : null
        },
        G2F: {
          criteria: AcmgCriteriaCNVGain.Gain2F,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain2F) : null
        },
        G2G: {
          criteria: AcmgCriteriaCNVGain.Gain2G,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain2G) : null
        },
        G2H: {
          criteria: AcmgCriteriaCNVGain.Gain2H,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain2H) : null
        },
        G2I: {
          criteria: AcmgCriteriaCNVGain.Gain2I,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain2I) : null
        },
        G2J: {
          criteria: AcmgCriteriaCNVGain.Gain2J,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain2J) : null
        },
        G2K: {
          criteria: AcmgCriteriaCNVGain.Gain2K,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain2K) : null
        },
        G2L: {
          criteria: AcmgCriteriaCNVGain.Gain2L,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain2L) : null
        },
        G3A: {
          criteria: AcmgCriteriaCNVGain.Gain3A,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain3A) : null
        },
        G3B: {
          criteria: AcmgCriteriaCNVGain.Gain3B,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain3B) : null
        },
        G3C: {
          criteria: AcmgCriteriaCNVGain.Gain3C,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain3C) : null
        },
        G4A: {
          criteria: AcmgCriteriaCNVGain.Gain4A,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain4A) : null
        },
        G4B: {
          criteria: AcmgCriteriaCNVGain.Gain4B,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain4B) : null
        },
        G4C: {
          criteria: AcmgCriteriaCNVGain.Gain4C,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain4C) : null
        },
        G4D: {
          criteria: AcmgCriteriaCNVGain.Gain4D,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain4D) : null
        },
        G4E: {
          criteria: AcmgCriteriaCNVGain.Gain4E,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain4E) : null
        },
        G4F: {
          criteria: AcmgCriteriaCNVGain.Gain4F,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain4F) : null
        },
        G4G: {
          criteria: AcmgCriteriaCNVGain.Gain4G,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain4G) : null
        },
        G4H: {
          criteria: AcmgCriteriaCNVGain.Gain4H,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain4H) : null
        },
        G4I: {
          criteria: AcmgCriteriaCNVGain.Gain4I,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain4I) : null
        },
        G4J: {
          criteria: AcmgCriteriaCNVGain.Gain4J,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain4J) : null
        },
        G4K: {
          criteria: AcmgCriteriaCNVGain.Gain4K,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain4K) : null
        },
        G4L: {
          criteria: AcmgCriteriaCNVGain.Gain4L,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain4L) : null
        },
        G4M: {
          criteria: AcmgCriteriaCNVGain.Gain4M,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain4M) : null
        },
        G4N: {
          criteria: AcmgCriteriaCNVGain.Gain4N,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain4N) : null
        },
        G4O: {
          criteria: AcmgCriteriaCNVGain.Gain4O,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain4O) : null
        },
        G5A: {
          criteria: AcmgCriteriaCNVGain.Gain5A,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain5A) : null
        },
        G5B: {
          criteria: AcmgCriteriaCNVGain.Gain5B,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain5B) : null
        },
        G5C: {
          criteria: AcmgCriteriaCNVGain.Gain5C,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain5C) : null
        },
        G5D: {
          criteria: AcmgCriteriaCNVGain.Gain5D,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain5D) : null
        },
        G5E: {
          criteria: AcmgCriteriaCNVGain.Gain5E,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain5E) : null
        },
        G5F: {
          criteria: AcmgCriteriaCNVGain.Gain5F,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain5F) : null
        },
        G5G: {
          criteria: AcmgCriteriaCNVGain.Gain5G,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain5G) : null
        },
        G5H: {
          criteria: AcmgCriteriaCNVGain.Gain5H,
          presence: Presence.Unknown,
          score: isDefault ? this.getDefaultScore(AcmgCriteriaCNVGain.Gain5H) : null
        }
      }
    } else {
      throw new Error('Invalid CNV type')
    }
  }

  /** Get default score for given `AcmgCriteriaCNVLoss` or `AcmgCriteriaCNVGain`. */
  getDefaultScore(criteria: AcmgCriteriaCNVLoss | AcmgCriteriaCNVGain): number | null {
    const criteriaDef = ACMG_CRITERIA_CNV_DEFS.get(criteria)
    if (!criteriaDef) {
      throw new Error(`Criteria ${criteria} not found`)
    }
    return criteriaDef.defaultScore
  }

  /** Gets the effective `CriteriaCNVState` for an `AcmgCriteriaCNVLoss` or `AcmgCriteriaCNVGain`.*/
  getCriteriaCNVState(criteria: AcmgCriteriaCNVLoss | AcmgCriteriaCNVGain): CriteriaCNVState {
    let presence = Presence.Unknown
    let score = null

    for (const StateSourceCNV of ALL_STATE_SOURCES) {
      if (!this.CriteriaCNVStates[StateSourceCNV]) {
        continue
      }

      const CriteriaCNVState = this.CriteriaCNVStates[StateSourceCNV][criteria]
      if (CriteriaCNVState) {
        if (CriteriaCNVState.criteria !== criteria) {
          throw new Error('criteria mismatch; should never happen')
        }

        if (CriteriaCNVState.presence !== Presence.Unknown) {
          presence = CriteriaCNVState.presence
        }
        if (CriteriaCNVState.score !== null) {
          score = CriteriaCNVState.score
        }
      }
    }

    return {
      criteria,
      presence,
      score
    }
  }

  /** Get the `CriteriaCNVState` for an explicit `StateSourceCNV`.
   *
   * This will be the original object, do not modify it.
   */
  getCriteriaCNVStateFromSource(
    criteria: AcmgCriteriaCNVLoss | AcmgCriteriaCNVGain,
    source: StateSourceCNV
  ): CriteriaCNVState {
    if (!this.CriteriaCNVStates[source] || !this.CriteriaCNVStates[source][criteria]) {
      throw new Error(`Criteria ${criteria} not found for source ${source}`)
    } else {
      const state = this.CriteriaCNVStates[source][criteria]
      if (!state) {
        throw new Error(`Criteria ${criteria} not found for source ${source}`)
      }
      return state as CriteriaCNVState
    }
  }

  /** Sets the `presence` of a `CriteriaState` for a given `StateSource` and `AcmgCriteria. */
  setPresence(
    source: StateSourceCNV,
    criteria: AcmgCriteriaCNVLoss | AcmgCriteriaCNVGain,
    presence: Presence
  ) {
    if (source === StateSourceCNV.Default) {
      throw new Error('Cannot set presence for default source')
    }
    const criteriaState = this.CriteriaCNVStates[source][criteria]
    if (
      this.CriteriaCNVStates[source] === undefined ||
      this.CriteriaCNVStates[source][criteria] === undefined ||
      !this.CriteriaCNVStates[source] ||
      !this.CriteriaCNVStates[source][criteria] ||
      criteriaState === undefined
    ) {
      throw new Error(`Criteria ${criteria} not found for source ${source}`)
    } else {
      criteriaState.presence = presence
    }
  }

  /** Sets the `Score` of a `CriteriaCNVState` for a given `StateSourceCNV` and `AcmgCriteriaCNV`. */
  setScore(
    source: StateSourceCNV,
    criteria: AcmgCriteriaCNVLoss | AcmgCriteriaCNVGain,
    score: number | null
  ) {
    if (source === StateSourceCNV.Default) {
      throw new Error('Cannot set presence for default source')
    }
    const criteriaState = this.CriteriaCNVStates[source][criteria]
    if (
      this.CriteriaCNVStates[source] === undefined ||
      this.CriteriaCNVStates[source][criteria] === undefined ||
      !this.CriteriaCNVStates[source] ||
      !this.CriteriaCNVStates[source][criteria] ||
      criteriaState === undefined
    ) {
      throw new Error(`Criteria ${criteria} not found for source ${source}`)
    } else {
      criteriaState.score = score
    }
  }

  /** Resets the presence and score of all criteria for a `StateSource.User` to a presence of `StateSource.AutoCNV`. */
  setUserToAutoCNV() {
    if (this.svType === 'DEL') {
      for (const criteria of ACMG_CRITERIA_CNV_LOSS) {
        const criteriaStateAutoCNV = this.getCriteriaCNVStateFromSource(
          criteria,
          StateSourceCNV.AutoCNV
        )
        this.setPresence(StateSourceCNV.User, criteria, criteriaStateAutoCNV.presence)
        this.setScore(StateSourceCNV.User, criteria, criteriaStateAutoCNV.score)
      }
    } else if (this.svType === 'DUP') {
      for (const criteria of ACMG_CRITERIA_CNV_GAIN) {
        const criteriaStateAutoCNV = this.getCriteriaCNVStateFromSource(
          criteria,
          StateSourceCNV.AutoCNV
        )
        this.setPresence(StateSourceCNV.User, criteria, criteriaStateAutoCNV.presence)
        this.setScore(StateSourceCNV.User, criteria, criteriaStateAutoCNV.score)
      }
    }
  }

  /** Returns the raw map of states, don't use to modify. */
  getStates() {
    return this.CriteriaCNVStates
  }

  /** Returns the ACMG class for current criteria state. */
  getAcmgClass(): [string, number] {
    let score = 0
    let acmgClass = 'Uncertain significance'

    if (this.svType === 'DEL') {
      for (const criteria of ACMG_CRITERIA_CNV_LOSS) {
        const CriteriaCNVState = this.getCriteriaCNVState(criteria)
        if (CriteriaCNVState.presence === Presence.Present) {
          score += CriteriaCNVState.score || 0
        }
      }

      const isPathogenic = score >= 0.99
      const isLikelyPathogenic = score >= 0.9 && score < 0.99
      const isUncertainSignificance = score > -0.89 && score < 0.9
      const isLikelyBenign = score <= -0.9 && score > -0.99
      const isBenign = score <= -0.99

      if (isPathogenic) {
        acmgClass = 'Pathogenic'
      } else if (isLikelyPathogenic) {
        acmgClass = 'Likely pathogenic'
      } else if (isBenign) {
        acmgClass = 'Benign'
      } else if (isLikelyBenign) {
        acmgClass = 'Likely benign'
      } else if (isUncertainSignificance) {
        acmgClass = 'Uncertain significance'
      }
    } else if (this.svType === 'DUP') {
      for (const criteria of ACMG_CRITERIA_CNV_GAIN) {
        const CriteriaCNVState = this.getCriteriaCNVState(criteria)
        if (CriteriaCNVState.presence === Presence.Present) {
          score += CriteriaCNVState.score || 0
        }
      }

      const isPathogenic = score >= 0.99
      const isLikelyPathogenic = score >= 0.9 && score < 0.99
      const isUncertainSignificance = score > -0.89 && score < 0.9
      const isLikelyBenign = score <= -0.9 && score > -0.99
      const isBenign = score <= -0.99

      if (isPathogenic) {
        acmgClass = 'Pathogenic'
      } else if (isLikelyPathogenic) {
        acmgClass = 'Likely pathogenic'
      } else if (isBenign) {
        acmgClass = 'Benign'
      } else if (isLikelyBenign) {
        acmgClass = 'Likely benign'
      } else if (isUncertainSignificance) {
        acmgClass = 'Uncertain significance'
      }
    }
    return [acmgClass, score]
  }
}

export {
  AcmgCriteriaCNVLoss,
  AcmgCriteriaCNVGain,
  ACMG_CRITERIA_CNV_DEFS,
  ACMG_CRITERIA_CNV_LOSS,
  ACMG_CRITERIA_CNV_GAIN,
  ALL_STATE_SOURCES,
  type CriteriaCNVDefinition,
  type CriteriaCNVState,
  type CriteriaToState,
  Presence,
  MultiSourceAcmgCriteriaCNVState,
  StateSourceCNV
}
