/** The predefined ACMG criteria for CNVs. */
enum AcmgCriteriaCNV {
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
  Loss5H = 'L5H',
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

/** Array of all ACMG criteria for CNVs. */
const ALL_ACMG_CRITERIA_CNV = [
  AcmgCriteriaCNV.Loss1A,
  AcmgCriteriaCNV.Loss1B,
  AcmgCriteriaCNV.Loss2A,
  AcmgCriteriaCNV.Loss2B,
  AcmgCriteriaCNV.Loss2C1,
  AcmgCriteriaCNV.Loss2C2,
  AcmgCriteriaCNV.Loss2D1,
  AcmgCriteriaCNV.Loss2D2,
  AcmgCriteriaCNV.Loss2D3,
  AcmgCriteriaCNV.Loss2D4,
  AcmgCriteriaCNV.Loss2E,
  AcmgCriteriaCNV.Loss2F,
  AcmgCriteriaCNV.Loss2G,
  AcmgCriteriaCNV.Loss2H,
  AcmgCriteriaCNV.Loss3A,
  AcmgCriteriaCNV.Loss3B,
  AcmgCriteriaCNV.Loss3C,
  AcmgCriteriaCNV.Loss4A,
  AcmgCriteriaCNV.Loss4B,
  AcmgCriteriaCNV.Loss4C,
  AcmgCriteriaCNV.Loss4D,
  AcmgCriteriaCNV.Loss4E,
  AcmgCriteriaCNV.Loss4F,
  AcmgCriteriaCNV.Loss4G,
  AcmgCriteriaCNV.Loss4H,
  AcmgCriteriaCNV.Loss4I,
  AcmgCriteriaCNV.Loss4J,
  AcmgCriteriaCNV.Loss4K,
  AcmgCriteriaCNV.Loss4L,
  AcmgCriteriaCNV.Loss4M,
  AcmgCriteriaCNV.Loss4N,
  AcmgCriteriaCNV.Loss4O,
  AcmgCriteriaCNV.Loss5A,
  AcmgCriteriaCNV.Loss5B,
  AcmgCriteriaCNV.Loss5C,
  AcmgCriteriaCNV.Loss5D,
  AcmgCriteriaCNV.Loss5E,
  AcmgCriteriaCNV.Loss5F,
  AcmgCriteriaCNV.Loss5G,
  AcmgCriteriaCNV.Loss5H,
  AcmgCriteriaCNV.Gain1A,
  AcmgCriteriaCNV.Gain1B,
  AcmgCriteriaCNV.Gain2A,
  AcmgCriteriaCNV.Gain2B,
  AcmgCriteriaCNV.Gain2D,
  AcmgCriteriaCNV.Gain2E,
  AcmgCriteriaCNV.Gain2F,
  AcmgCriteriaCNV.Gain2G,
  AcmgCriteriaCNV.Gain2H,
  AcmgCriteriaCNV.Gain2I,
  AcmgCriteriaCNV.Gain2J,
  AcmgCriteriaCNV.Gain2K,
  AcmgCriteriaCNV.Gain2L,
  AcmgCriteriaCNV.Gain3A,
  AcmgCriteriaCNV.Gain3B,
  AcmgCriteriaCNV.Gain3C,
  AcmgCriteriaCNV.Gain4A,
  AcmgCriteriaCNV.Gain4B,
  AcmgCriteriaCNV.Gain4C,
  AcmgCriteriaCNV.Gain4D,
  AcmgCriteriaCNV.Gain4E,
  AcmgCriteriaCNV.Gain4F,
  AcmgCriteriaCNV.Gain4G,
  AcmgCriteriaCNV.Gain4H,
  AcmgCriteriaCNV.Gain4I,
  AcmgCriteriaCNV.Gain4J,
  AcmgCriteriaCNV.Gain4K,
  AcmgCriteriaCNV.Gain4L,
  AcmgCriteriaCNV.Gain4M,
  AcmgCriteriaCNV.Gain4N,
  AcmgCriteriaCNV.Gain4O,
  AcmgCriteriaCNV.Gain5A,
  AcmgCriteriaCNV.Gain5B,
  AcmgCriteriaCNV.Gain5C,
  AcmgCriteriaCNV.Gain5D,
  AcmgCriteriaCNV.Gain5E,
  AcmgCriteriaCNV.Gain5F,
  AcmgCriteriaCNV.Gain5G,
  AcmgCriteriaCNV.Gain5H
]

/** Detailed definition of one ACMG criteria. */
interface CriteriaCNVDefinition {
  criteria: AcmgCriteriaCNV
  defaultScore: Number | null
  maxScore: Number
  label: string
  hint: string
  description: string
}

/** Predefined ACMG criteria for CNVs. */
const ACMG_CRITERIA_CNV_DEFS: Map<AcmgCriteriaCNV, CriteriaCNVDefinition> = new Map(
  [
    {
      criteria: AcmgCriteriaCNV.Loss1A,
      defaultScore: 0,
      maxScore: 0,
      label: '1A',
      hint: 'Copy number loss content',
      description: `Contains protein-coding or other known functionally important elements.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss1B,
      defaultScore: -0.6,
      maxScore: -0.6,
      label: '1B',
      hint: '',
      description: `Does NOT contain protein-coding or any known functionally important elements.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss2A,
      defaultScore: 1,
      maxScore: 1,
      label: '2A',
      hint: 'Overlap with ESTABLISHED HI genes or genomic regions and consideration of reason for referral',
      description: `Complete overlap of an established HI gene or genomic region.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss2B,
      defaultScore: 0,
      maxScore: 0,
      label: '2B',
      hint: 'Continue evaluation',
      description: `Partial overlap of an established HI genomic region
      • The observed CNV does NOT contain the known causative gene or critical region for this
      established HI genomic region OR
      • Unclear if known causative gene or critical region is affected OR
      • No specific causative gene or critical region has been established for this HI
      genomic region.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss2C1,
      defaultScore: 0.9,
      maxScore: 1,
      label: '2C-1',
      hint: 'range: 0.45 - 1.0',
      description: `Partial overlap with the 5' end of an established HI gene (3' end of the gene not
        involved) and coding sequence is involved.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss2C2,
      defaultScore: 0,
      maxScore: 0.45,
      label: '2C-2',
      hint: 'range: 0.45 - 1.0',
      description: `Partial overlap with the 5' end of an established HI gene (3' end of the gene not
        involved) and only the 5' UTR is involved.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss2D1,
      defaultScore: 0,
      maxScore: 0,
      label: '2D-1',
      hint: 'Continue evaluation',
      description: `Partial overlap with the 3' end of an established HI gene (5' end of the gene not
        involved) and only 3' untransalted region is involved.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss2D2,
      defaultScore: 0.9,
      maxScore: 0.9,
      label: '2D-2',
      hint: 'range: 0.45 - 0.9',
      description: `Partial overlap with the 3' end of an established HI gene (5' end of the gene not
        involved) and only the last exon is involved. Other established pathogenic variants have
        been reported in this exon.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss2D3,
      defaultScore: 0.3,
      maxScore: 0.45,
      label: '2D-3',
      hint: 'range: 0.3 - 0.45',
      description: `Partial overlap with the 3' end of an established HI gene (5' end of the gene not
        involved) and only the last exon is involved. No other established pathogenic variants have
        been reported in this exon.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss2D4,
      defaultScore: 0.9,
      maxScore: 1,
      label: '2D-4',
      hint: 'range: 0.45 - 1.0',
      description: `Partial overlap with the 3' end of an established HI gene (5' end of the gene not
        involved) and it includes other exons in addition to the last exon. Nonsense-mediated
        decay is expected to occur.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss2E,
      defaultScore: 0,
      maxScore: 0.9,
      label: '2D-3',
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
        evaluation.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss2F,
      defaultScore: -1,
      maxScore: -1,
      label: '2F',
      hint: 'Overlap with ESTABLISHED benign genes or genomic regions',
      description: `Completely contained within an established benign CNV region.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss2G,
      defaultScore: 0,
      maxScore: 0,
      label: '2G',
      hint: 'Continue evaluation',
      description: `Overlaps an established benign CNV, but includes additional genomic material.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss2H,
      defaultScore: 0.15,
      maxScore: 0.15,
      label: '2H',
      hint: 'Haploinsufficiency predictors',
      description: `Two or more HI predictors suggest that AT LEAST ONE gene in the interval is HI.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss3A,
      defaultScore: 0,
      maxScore: 0,
      label: '3A',
      hint: 'Number of protein-coding RefSeq genes wholly or partially included in the copy-number loss',
      description: `0-24 genes.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss3B,
      defaultScore: 0.45,
      maxScore: 0.45,
      label: '3B',
      hint: '',
      description: `25-34 genes.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss3C,
      defaultScore: 0.9,
      maxScore: 0.9,
      label: '3C',
      hint: '',
      description: `35+ genes.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss4A,
      defaultScore: 0.3,
      maxScore: 0.9,
      label: '4A',
      hint: `Confirmed de novo: 0.45 points each Assumed de novo: 0.30 points each (range: 0.15 to 0.45)`,
      description: `Reported proband (from literature, public databases, or internal lab data) has either:
      • A complete deletion of or a LOF variant within gene encompassed by the observed
      copy-number loss OR
      • An overlapping copy-number loss similar in genomic content to the observed copynumber loss AND 
      the reported phenotype is highly specific and relatively unique to the gene or
      genomic region,`
    },
    {
      criteria: AcmgCriteriaCNV.Loss4B,
      defaultScore: 0.3,
      maxScore: 0.9,
      label: '4B',
      hint: `Confirmed de novo: 0.30 points each Assumed de novo: 0.15 point each (range: 0 to 0.45)`,
      description: `Reported proband (from literature, public databases, or internal lab data) has either:
      • A complete deletion of or a LOF variant within gene encompassed by the observed
      copy-number loss OR
      • An overlapping copy-number loss similar in genomic content to the observed copynumber loss AND 
      the reported phenotype is consistent with the gene/genomic region, is highly
      specific, but not necessarily unique to the gene/genomic region.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss4C,
      defaultScore: 0.15,
      maxScore: 0.9,
      label: '4C',
      hint: `Confirmed de novo: 0.15 point each Assumed de novo: 0.10 point each (range: 0 to 0.30)`,
      description: `Reported proband (from literature, public databases, or internal lab data) has either:
      • A complete deletion of or a LOF variant within gene encompassed by the observed
      copy-number loss OR
      • An overlapping copy-number loss similar in genomic content to the observed copynumber loss AND 
      the reported phenotype is consistent with the gene/genomic region, but not highly
      specific and/or with high genetic heterogeneity.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss4D,
      defaultScore: 0,
      maxScore: -0.3,
      label: '4D',
      hint: 'Individual case evidence — inconsistent phenotype (range: 0 to -0.3)',
      description: `Reported proband (from literature, public databases, or internal lab data) has either:
      • A complete deletion of or a LOF variant within gene encompassed by the observed
      copy-number loss OR
      • An overlapping copy-number loss similar in genomic content to the observed copynumber loss AND 
      the reported phenotype is NOT consistent with what is expected for the gene/
      genomic region or not consistent in general.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss4E,
      defaultScore: 0.1,
      maxScore: 0.3,
      label: '4E',
      hint: 'Individual case evidence — unknown inheritance (range: 0 to 0.15)',
      description: `Reported proband has a highly specific phenotype consistent with the gene/genomic
      region, but the inheritance of the variant is unknown.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss4F,
      defaultScore: 0.15,
      maxScore: 0.45,
      label: '4F',
      hint: 'Individual case evidence — segregation among similarly affected family members',
      description: `3-4 observed segregations.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss4G,
      defaultScore: 0.3,
      maxScore: 0.3,
      label: '4G',
      hint: '',
      description: `5-6 observed segregations.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss4H,
      defaultScore: 0.45,
      maxScore: 0.45,
      label: '4H',
      hint: '',
      description: `7+ observed segregations.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss4I,
      defaultScore: -0.45,
      maxScore: -0.9,
      label: '4I',
      hint: `Individual case evidence — nonsegregations -0.45 points per family (range: 0 to -0.45)`,
      description: `Variant is NOT found in another individual in the proband's family AFFECTED with a
      consistent, specific, well-defined phenotype (no known phenocopies).`
    },
    {
      criteria: AcmgCriteriaCNV.Loss4J,
      defaultScore: -0.3,
      maxScore: -0.9,
      label: '4J',
      hint: `-0.30 points per family (range: 0 to -0.30)`,
      description: `Variant IS found in another individual in the proband's family UNAFFECTED with the
      specific, well-defined phenotype observed in the proband.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss4K,
      defaultScore: -0.15,
      maxScore: -0.3,
      label: '4K',
      hint: `-0.15 points per family (range: 0 to -0.15)`,
      description: `Variant IS found in another individual in the proband's family UNAFFECTED with the
      nonspecific phenotype observed in the proband`
    },
    {
      criteria: AcmgCriteriaCNV.Loss4L,
      defaultScore: 0.45,
      maxScore: 0.45,
      label: '4L',
      hint: 'Case-control and population evidence. 0.45 per study (range: 0 to 0.45 per study)',
      description: `Statistically significant increase amongst observations in cases (with a consistent,
        specific, well-defined phenotype) compared with controls.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss4M,
      defaultScore: 0.3,
      maxScore: 0.45,
      label: '4M',
      hint: '0.30 per study (range: 0 to 0.30 per study',
      description: `Statistically significant increase amongst observations in cases (without a
        consistent, nonspecific phenotype OR unknown phenotype) compared with
        controls.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss4N,
      defaultScore: -0.9,
      maxScore: -0.9,
      label: '4N',
      hint: '-0.90 (per study) (range: 0 to -0.90 per study',
      description: `No statistically significant difference between observations in cases and controls.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss4O,
      defaultScore: -1,
      maxScore: -1,
      label: '4O',
      hint: '(range: 0 to -1)',
      description: `Overlap with common population variation.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss5A,
      defaultScore: 0,
      maxScore: 0.45,
      label: '5A',
      hint: `Observed copy-number loss is de novo. Use de novo scoring categories from section 4 
      (4A-4D) to determine score`,
      description: `Use appropriate category from de novo scoring section in section 4.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss5B,
      defaultScore: -0.3,
      maxScore: -0.45,
      label: '5B',
      hint: `Observed copy-number loss is inherited. (range: 0 to -0.45)`,
      description: `Patient with specific, well-defined phenotype and no family history. CNV is
      inherited from an apparently unaffected parent.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss5C,
      defaultScore: -0.15,
      maxScore: -0.3,
      label: '5C',
      hint: `(range: 0 to -0.30)`,
      description: ` Patient with nonspecific phenotype and no family history. CNV is inherited from an
      apparently unaffected parent.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss5D,
      defaultScore: 0,
      maxScore: 0.45,
      label: '5D',
      hint: `Use segregation scoring categories from section 4 (4F-4H) to determine score`,
      description: `CNV segregates with a consistent phenotype observed in the patient's family.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss5E,
      defaultScore: 0,
      maxScore: -0.45,
      label: '5E',
      hint: `Observed copy-number loss — nonsegregations. Use nonsegregation scoring categories
      from section 4 (4I-4K) to determine score`,
      description: `Use appropriate category from nonsegregation section in section 4.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss5F,
      defaultScore: 0,
      maxScore: 0,
      label: '5F',
      hint: `Other`,
      description: `Inheritance information is unavailable or uninformative.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss5G,
      defaultScore: 0.1,
      maxScore: 0.15,
      label: '5G',
      hint: '(range: 0 to 0.15)',
      description: `Inheritance information is unavailable or uninformative. The patient phenotype is
      nonspecific, but is consistent with what has been described in similar cases.`
    },
    {
      criteria: AcmgCriteriaCNV.Loss5H,
      defaultScore: 0.3,
      maxScore: 0.3,
      label: '5H',
      hint: '(range: 0 to 0.30)',
      description: `Inheritance information is unavailable or uninformative. The patient phenotype is
      highly specific and consistent with what has been described in similar cases.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain1A,
      defaultScore: 0,
      maxScore: 0,
      label: '1A',
      hint: `Copy number gain content (Continue evaluation)`,
      description: `Contains protein-coding or other known functionally important elements.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain1B,
      defaultScore: -0.6,
      maxScore: -0.6,
      label: '1B',
      hint: '',
      description: `Does NOT contain protein-coding or any known functionally important elements.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain2A,
      defaultScore: 1,
      maxScore: 1,
      label: '2A',
      hint: `Overlap with ESTABLISHED TS genes or genomic regions`,
      description: `Complete overlap; the TS gene or minimal critical region is fully contained within the
      observed copy-number gain.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain2B,
      defaultScore: 0,
      maxScore: 0,
      label: '2B',
      hint: `Continue evaluation`,
      description: `Partial overlap of an established TS region
      • The observed CNV does NOT contain the known causative gene or critical region for this
      established TS genomic region OR
      • Unclear if the known causative gene or critical region is affected OR
      • No specific causative gene or critical region has been established for this TS genomic region.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain2C,
      defaultScore: -1,
      maxScore: -1,
      label: '2C',
      hint: `Overlap with ESTABLISHED benign copy-number gain genes or genomic regions`,
      description: `Identical in gene content to the established benign copy-number gain.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain2D,
      defaultScore: -1,
      maxScore: -1,
      label: '2D',
      hint: '',
      description: `Smaller than established benign copy-number gain, breakpoint(s) does not interrupt
      protein-coding genes.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain2E,
      defaultScore: 0,
      maxScore: 0,
      label: '2E',
      hint: 'Continue evaluation',
      description: ` Smaller than established benign copy-number gain, breakpoint(s) potentially interrupts
      protein-coding gene.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain2F,
      defaultScore: -1,
      maxScore: -1,
      label: '2F',
      hint: '(range: 0 to -1)',
      description: `Larger than known benign copy-number gain, does not include additional proteincoding genes.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain2G,
      defaultScore: 0,
      maxScore: 0,
      label: '2G',
      hint: 'Continue evaluation',
      description: ` Overlaps a benign copy-number gain but includes additional genomic material.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain2H,
      defaultScore: 0,
      maxScore: 0,
      label: '2H',
      hint: `Overlap with ESTABLISHED HI gene(s). Continue evaluation`,
      description: `HI gene fully contained within observed copy-number gain.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain2I,
      defaultScore: 0,
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
        = 0 (Continue evaluation).`
    },
    {
      criteria: AcmgCriteriaCNV.Gain2J,
      defaultScore: 0,
      maxScore: 0,
      label: '2J',
      hint: 'Continue evaluation',
      description: `One breakpoint is within an established HI gene, patient's phenotype is either inconsistent
      with what is expected for LOF of that gene OR unknown`
    },
    {
      criteria: AcmgCriteriaCNV.Gain2K,
      defaultScore: 0.45,
      maxScore: 0.45,
      label: '2K',
      hint: '',
      description: `One breakpoint is within an established HI gene, patient's phenotype is highly specific and
      consistent with what is expected for LOF of that gene.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain2L,
      defaultScore: 0,
      maxScore: 0,
      label: '2L',
      hint: 'Breakpoints within other gene(s). Continue evaluation',
      description: ` One or both breakpoints are within gene(s) of no established clinical significance.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain3A,
      defaultScore: 0,
      maxScore: 0,
      label: '3A',
      hint: `Number of protein-coding RefSeq genes wholly or partially included in the copy-number gain`,
      description: `0-34 genes.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain3B,
      defaultScore: 0.45,
      maxScore: 0.45,
      label: '3B',
      hint: '',
      description: `35-49 genes.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain3C,
      defaultScore: 0.9,
      maxScore: 0.9,
      label: '3C',
      hint: '',
      description: `50+ genes.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain4A,
      defaultScore: 0.3,
      maxScore: 0.9,
      label: '4A',
      hint: `Confirmed de novo: 0.45 points each
      Assumed de novo: 0.30 points each (range:
      0.15 to 0.45)`,
      description: `Reported proband (from literature, public databases, or internal lab data) has either:
      • complete duplication of one or more genes within the observed copy-number gain OR
      • an overlapping copy-number gain similar in genomic content to the observed copy-number
      gain AND the reported phenotype is highly specific and relatively unique to the gene or genomic
      region.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain4B,
      defaultScore: 0.15,
      maxScore: 0.9,
      label: '4B',
      hint: `Confirmed de novo: 0.30 points each
      Assumed de novo: 0.15 point each (range: 0
      to 0.45)`,
      description: `Reported proband (from literature, public databases, or internal lab data) has either:
      • complete duplication of one or more genes within the observed copy-number gain OR
      • an overlapping copy-number gain similar in genomic content to the observed copy-number
      gain AND the reported phenotype is consistent with the gene/genomic region, is highly specific,
      but is not necessarily unique to the gene/genomic region.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain4C,
      defaultScore: 0.15,
      maxScore: 0.9,
      label: '4C',
      hint: `Confirmed de novo: 0.15 point each
      Assumed de novo: 0.10 point each (range: 0
      to 0.30)`,
      description: `Reported proband (from literature, public databases, or internal lab data) has either:
      • complete duplication of one or more genes within the observed copy-number gain OR
      • an overlapping copy-number gain similar in genomic content to the observed copy-number
      gain AND the reported phenotype is consistent with the gene/genomic region, but not highly
      specific and/or with high genetic heterogeneity.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain4D,
      defaultScore: 0,
      maxScore: -0.3,
      label: '4D',
      hint: `Individual case evidence — inconsistent phenotype. 0 points each (range: 0 to -0.30)`,
      description: `Reported proband (from literature, public databases, or internal lab data) has either:
      • complete duplication of one or more genes within the observed copy-number gain OR
      • an overlapping copy-number gain similar in genomic content to the observed copy-number
      gain AND the reported phenotype is NOT consistent with the gene/genomic region or not
      consistent in general.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain4E,
      defaultScore: 0.1,
      maxScore: 0.3,
      label: '4A',
      hint: `Individual case evidence — unknown inheritance. 0.10 points each (range: 0 to 0.15)`,
      description: `Reported proband has a highly specific phenotype consistent with the gene/genomic
      region, but the inheritance of the variant is unknown.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain4F,
      defaultScore: 0.15,
      maxScore: 0.45,
      label: '4F',
      hint: `Individual case evidence — segregation among similarly affected family members`,
      description: `3-4 observed segregations.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain4G,
      defaultScore: 0.3,
      maxScore: 0.3,
      label: '4G',
      hint: '',
      description: `5-6 observed segregations.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain4H,
      defaultScore: 0.45,
      maxScore: 0.45,
      label: '4H',
      hint: '',
      description: `7+ observed segregations.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain4I,
      defaultScore: -0.45,
      maxScore: -0.9,
      label: '4I',
      hint: `Individual case evidence — nonsegregations. -0.45 points per family (range: 0 to -0.45)`,
      description: `Variant is NOT found in another individual in the proband's family AFFECTED with a
      consistent, specific, well-defined phenotype (no known phenocopies).`
    },
    {
      criteria: AcmgCriteriaCNV.Gain4J,
      defaultScore: -0.3,
      maxScore: -0.9,
      label: '4J',
      hint: `-0.30 points per family (range: 0 to -0.30)`,
      description: ` Variant IS found in another individual in the proband's family UNAFFECTED with the
      specific, well-defined phenotype observed in the proband.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain4K,
      defaultScore: -0.15,
      maxScore: -0.3,
      label: '4K',
      hint: `-0.15 points per family (range: 0 to -0.15)`,
      description: `Variant IS found in another individual in the proband's family UNAFFECTED with the
      nonspecific phenotype observed in the proband.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain4L,
      defaultScore: 0.45,
      maxScore: 0.45,
      label: '4L',
      hint: `Case-control and population evidence. 0.45 per study (range: 0 to 0.45 per study)`,
      description: `Statistically significant increase among observations in cases (with a consistent, specific,
        well-defined phenotype) compared with controls.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain4M,
      defaultScore: 0.3,
      maxScore: 0.45,
      label: '4M',
      hint: `0.30 per study (range: 0 to 0.30 per study)`,
      description: `Statistically significant increase among observations in cases (with a consistent,
        nonspecific phenotype or unknown phenotype) compared with controls.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain4N,
      defaultScore: -0.9,
      maxScore: -0.9,
      label: '4N',
      hint: `-0.90 (per study) (range: 0 to -0.90 per study)`,
      description: `No statistically significant difference between observations in cases and controls.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain4O,
      defaultScore: -1,
      maxScore: -1,
      label: '4O',
      hint: `(range: 0 to -1)`,
      description: `Overlap with common population variation.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain5A,
      defaultScore: 0,
      maxScore: 0.45,
      label: '5A',
      hint: `Observed copy-number gain is de novo. Use de novo scoring categories from section 4 (4A-4D) to determine score`,
      description: `Use appropriate category from de novo scoring section in section 4.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain5B,
      defaultScore: -0.3,
      maxScore: -0.45,
      label: '5B',
      hint: `Observed copy-number gain is inherited. (range: 0 to -0.45)`,
      description: `Patient with a specific, well-defined phenotype and no family history. Copy-number
      gain is inherited from an apparently unaffected parent.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain5C,
      defaultScore: -0.15,
      maxScore: -0.3,
      label: '5C',
      hint: `(range: 0 to -0.30)`,
      description: `Patient with nonspecific phenotype and no family history. Copy-number gain is
      inherited from an apparently unaffected parent.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain5D,
      defaultScore: 0,
      maxScore: 0.45,
      label: '5D',
      hint: `Use segregation scoring categories from in
      section 4 (4F-4H) to determine score`,
      description: `CNV segregates with consistent phenotype observed in the patient's family.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain5E,
      defaultScore: 0,
      maxScore: -0.45,
      label: '5E',
      hint: `Observed copy-number gain — nonsegregations. Use nonsegregation scoring categories from
      section 4 (4I-4K) to determine score`,
      description: `Use appropriate category from nonsegregation section in section 4.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain5F,
      defaultScore: 0,
      maxScore: 0,
      label: '5F',
      hint: ``,
      description: `Inheritance information is unavailable or uninformative.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain5G,
      defaultScore: 0.1,
      maxScore: 0.15,
      label: '5G',
      hint: `(range: 0 to 0.15)`,
      description: `Inheritance information is unavailable or uninformative. The patient phenotype is
      nonspecific, but is consistent with what has been described in similar cases.`
    },
    {
      criteria: AcmgCriteriaCNV.Gain5H,
      defaultScore: 0.3,
      maxScore: 0.3,
      label: '5H',
      hint: `(range: 0 to 0.30)`,
      description: `. Inheritance information is unavailable or uninformative. The patient phenotype is highly
      specific and consistent with what has been described in similar cases.`
    }
  ].map((def: CriteriaCNVDefinition) => [def.criteria, def])
)

/** The state of a criteria.
 *
 * Could stem from the default definition (e.g., from the ACMG guidelines paper),
 * user input, or automated prediction tools.
 */
interface CriteriaCNVState {
  /** Criteria referred to. */
  criteria: AcmgCriteriaCNV
  /** The evidence score
   *
   * This is used by prediction tools to override the default and by the user
   * to override both default and prediction tools.
   */
  defaultScore: number | null
}

/** Define where a given selection state comes from. */
enum StateSourceCNV {
  Default = 'Default',
  User = 'User'
}

/** All state sources from lowest to highest priority. */
const ALL_STATE_SOURCES = [StateSourceCNV.Default, StateSourceCNV.User]

/** Mapping from `AcmgCriteriaCNV` to `CriteriaCNVState`. */
type CriteriaToState = { [key in AcmgCriteriaCNV]: CriteriaCNVState }

/** Mapping from `StateSourceCNV` to `CriteriaCNVState` */
type SourceToCriteriaToState = { [key in StateSourceCNV]: CriteriaToState }

/**
 * Contains the ACMG selection states from different sources and handles the
 * logic of merging / overrides.
 */
class MultiSourceAcmgCriteriaCNVState {
  CriteriaCNVStates: SourceToCriteriaToState

  constructor() {
    this.CriteriaCNVStates = {
      Default: this.createCriteriaCNVStateMap(StateSourceCNV.Default),
      User: this.createCriteriaCNVStateMap(StateSourceCNV.User)
    }
  }

  /** Creates a map of criteria states for a given source. */
  protected createCriteriaCNVStateMap(source: StateSourceCNV): CriteriaToState {
    const isDefault = source === StateSourceCNV.Default
    return {
      L1A: {
        criteria: AcmgCriteriaCNV.Loss1A,
        defaultScore: isDefault ? 0 : null
      },
      L1B: {
        criteria: AcmgCriteriaCNV.Loss1B,
        defaultScore: isDefault ? -0.6 : null
      },
      L2A: {
        criteria: AcmgCriteriaCNV.Loss2A,
        defaultScore: isDefault ? 1 : null
      },
      L2B: {
        criteria: AcmgCriteriaCNV.Loss2B,
        defaultScore: isDefault ? 0 : null
      },
      'L2C-1': {
        criteria: AcmgCriteriaCNV.Loss2C1,
        defaultScore: isDefault ? 0.9 : null
      },
      'L2C-2': {
        criteria: AcmgCriteriaCNV.Loss2C2,
        defaultScore: isDefault ? 0 : null
      },
      'L2D-1': {
        criteria: AcmgCriteriaCNV.Loss2D1,
        defaultScore: isDefault ? 0 : null
      },
      'L2D-2': {
        criteria: AcmgCriteriaCNV.Loss2D2,
        defaultScore: isDefault ? 0.9 : null
      },
      'L2D-3': {
        criteria: AcmgCriteriaCNV.Loss2D3,
        defaultScore: isDefault ? 0.3 : null
      },
      'L2D-4': {
        criteria: AcmgCriteriaCNV.Loss2D4,
        defaultScore: isDefault ? 0.9 : null
      },
      L2E: {
        criteria: AcmgCriteriaCNV.Loss2E,
        defaultScore: isDefault ? 0.9 : null
      },
      L2F: {
        criteria: AcmgCriteriaCNV.Loss2F,
        defaultScore: isDefault ? -1 : null
      },
      L2G: {
        criteria: AcmgCriteriaCNV.Loss2G,
        defaultScore: isDefault ? 0 : null
      },
      L2H: {
        criteria: AcmgCriteriaCNV.Loss2H,
        defaultScore: isDefault ? 0.15 : null
      },
      L3A: {
        criteria: AcmgCriteriaCNV.Loss3A,
        defaultScore: isDefault ? 0 : null
      },
      L3B: {
        criteria: AcmgCriteriaCNV.Loss3B,
        defaultScore: isDefault ? 0.45 : null
      },
      L3C: {
        criteria: AcmgCriteriaCNV.Loss3C,
        defaultScore: isDefault ? 0.9 : null
      },
      L4A: {
        criteria: AcmgCriteriaCNV.Loss4A,
        defaultScore: isDefault ? 0.3 : null
      },
      L4B: {
        criteria: AcmgCriteriaCNV.Loss4B,
        defaultScore: isDefault ? 0.3 : null
      },
      L4C: {
        criteria: AcmgCriteriaCNV.Loss4C,
        defaultScore: isDefault ? 0.15 : null
      },
      L4D: {
        criteria: AcmgCriteriaCNV.Loss4D,
        defaultScore: isDefault ? 0 : null
      },
      L4E: {
        criteria: AcmgCriteriaCNV.Loss4E,
        defaultScore: isDefault ? 0.1 : null
      },
      L4F: {
        criteria: AcmgCriteriaCNV.Loss4F,
        defaultScore: isDefault ? 0.15 : null
      },
      L4G: {
        criteria: AcmgCriteriaCNV.Loss4G,
        defaultScore: isDefault ? 0.3 : null
      },
      L4H: {
        criteria: AcmgCriteriaCNV.Loss4H,
        defaultScore: isDefault ? 0.45 : null
      },
      L4I: {
        criteria: AcmgCriteriaCNV.Loss4I,
        defaultScore: isDefault ? -0.45 : null
      },
      L4J: {
        criteria: AcmgCriteriaCNV.Loss4J,
        defaultScore: isDefault ? -0.3 : null
      },
      L4K: {
        criteria: AcmgCriteriaCNV.Loss4K,
        defaultScore: isDefault ? -0.15 : null
      },
      L4L: {
        criteria: AcmgCriteriaCNV.Loss4L,
        defaultScore: isDefault ? 0.45 : null
      },
      L4M: {
        criteria: AcmgCriteriaCNV.Loss4M,
        defaultScore: isDefault ? 0.3 : null
      },
      L4N: {
        criteria: AcmgCriteriaCNV.Loss4N,
        defaultScore: isDefault ? -0.9 : null
      },
      L4O: {
        criteria: AcmgCriteriaCNV.Loss4O,
        defaultScore: isDefault ? -1 : null
      },
      L5A: {
        criteria: AcmgCriteriaCNV.Loss5A,
        defaultScore: isDefault ? 0 : null
      },
      L5B: {
        criteria: AcmgCriteriaCNV.Loss5B,
        defaultScore: isDefault ? -0.3 : null
      },
      L5C: {
        criteria: AcmgCriteriaCNV.Loss5C,
        defaultScore: isDefault ? -0.15 : null
      },
      L5D: {
        criteria: AcmgCriteriaCNV.Loss5D,
        defaultScore: isDefault ? 0 : null
      },
      L5E: {
        criteria: AcmgCriteriaCNV.Loss5E,
        defaultScore: isDefault ? 0 : null
      },
      L5F: {
        criteria: AcmgCriteriaCNV.Loss5F,
        defaultScore: isDefault ? 0 : null
      },
      L5G: {
        criteria: AcmgCriteriaCNV.Loss5G,
        defaultScore: isDefault ? 0.1 : null
      },
      L5H: {
        criteria: AcmgCriteriaCNV.Loss5H,
        defaultScore: isDefault ? 0.3 : null
      },
      G1A: {
        criteria: AcmgCriteriaCNV.Gain1A,
        defaultScore: isDefault ? 0 : null
      },
      G1B: {
        criteria: AcmgCriteriaCNV.Gain1B,
        defaultScore: isDefault ? -0.6 : null
      },
      G2A: {
        criteria: AcmgCriteriaCNV.Gain2A,
        defaultScore: isDefault ? 1 : null
      },
      G2B: {
        criteria: AcmgCriteriaCNV.Gain2B,
        defaultScore: isDefault ? 0 : null
      },
      G2C: {
        criteria: AcmgCriteriaCNV.Gain2C,
        defaultScore: isDefault ? -1 : null
      },
      G2D: {
        criteria: AcmgCriteriaCNV.Gain2D,
        defaultScore: isDefault ? -1 : null
      },
      G2E: {
        criteria: AcmgCriteriaCNV.Gain2E,
        defaultScore: isDefault ? 0 : null
      },
      G2F: {
        criteria: AcmgCriteriaCNV.Gain2F,
        defaultScore: isDefault ? -1 : null
      },
      G2G: {
        criteria: AcmgCriteriaCNV.Gain2G,
        defaultScore: isDefault ? 0 : null
      },
      G2H: {
        criteria: AcmgCriteriaCNV.Gain2H,
        defaultScore: isDefault ? 0 : null
      },
      G2I: {
        criteria: AcmgCriteriaCNV.Gain2I,
        defaultScore: isDefault ? 0 : null
      },
      G2J: {
        criteria: AcmgCriteriaCNV.Gain2J,
        defaultScore: isDefault ? 0 : null
      },
      G2K: {
        criteria: AcmgCriteriaCNV.Gain2K,
        defaultScore: isDefault ? 0.45 : null
      },
      G2L: {
        criteria: AcmgCriteriaCNV.Gain2L,
        defaultScore: isDefault ? 0 : null
      },
      G3A: {
        criteria: AcmgCriteriaCNV.Gain3A,
        defaultScore: isDefault ? 0 : null
      },
      G3B: {
        criteria: AcmgCriteriaCNV.Gain3B,
        defaultScore: isDefault ? 0.45 : null
      },
      G3C: {
        criteria: AcmgCriteriaCNV.Gain3C,
        defaultScore: isDefault ? 0.9 : null
      },
      G4A: {
        criteria: AcmgCriteriaCNV.Gain4A,
        defaultScore: isDefault ? 0.3 : null
      },
      G4B: {
        criteria: AcmgCriteriaCNV.Gain4B,
        defaultScore: isDefault ? 0.15 : null
      },
      G4C: {
        criteria: AcmgCriteriaCNV.Gain4C,
        defaultScore: isDefault ? 0.15 : null
      },
      G4D: {
        criteria: AcmgCriteriaCNV.Gain4D,
        defaultScore: isDefault ? 0 : null
      },
      G4E: {
        criteria: AcmgCriteriaCNV.Gain4E,
        defaultScore: isDefault ? 0.1 : null
      },
      G4F: {
        criteria: AcmgCriteriaCNV.Gain4F,
        defaultScore: isDefault ? 0.15 : null
      },
      G4G: {
        criteria: AcmgCriteriaCNV.Gain4G,
        defaultScore: isDefault ? 0.3 : null
      },
      G4H: {
        criteria: AcmgCriteriaCNV.Gain4H,
        defaultScore: isDefault ? 0.45 : null
      },
      G4I: {
        criteria: AcmgCriteriaCNV.Gain4I,
        defaultScore: isDefault ? -0.45 : null
      },
      G4J: {
        criteria: AcmgCriteriaCNV.Gain4J,
        defaultScore: isDefault ? -0.3 : null
      },
      G4K: {
        criteria: AcmgCriteriaCNV.Gain4K,
        defaultScore: isDefault ? -0.15 : null
      },
      G4L: {
        criteria: AcmgCriteriaCNV.Gain4L,
        defaultScore: isDefault ? 0.45 : null
      },
      G4M: {
        criteria: AcmgCriteriaCNV.Gain4M,
        defaultScore: isDefault ? 0.3 : null
      },
      G4N: {
        criteria: AcmgCriteriaCNV.Gain4N,
        defaultScore: isDefault ? -0.9 : null
      },
      G4O: {
        criteria: AcmgCriteriaCNV.Gain4O,
        defaultScore: isDefault ? -1 : null
      },
      G5A: {
        criteria: AcmgCriteriaCNV.Gain5A,
        defaultScore: isDefault ? 0 : null
      },
      G5B: {
        criteria: AcmgCriteriaCNV.Gain5B,
        defaultScore: isDefault ? -0.3 : null
      },
      G5C: {
        criteria: AcmgCriteriaCNV.Gain5C,
        defaultScore: isDefault ? -0.15 : null
      },
      G5D: {
        criteria: AcmgCriteriaCNV.Gain5D,
        defaultScore: isDefault ? 0 : null
      },
      G5E: {
        criteria: AcmgCriteriaCNV.Gain5E,
        defaultScore: isDefault ? 0 : null
      },
      G5F: {
        criteria: AcmgCriteriaCNV.Gain5F,
        defaultScore: isDefault ? 0 : null
      },
      G5G: {
        criteria: AcmgCriteriaCNV.Gain5G,
        defaultScore: isDefault ? 0.1 : null
      },
      G5H: {
        criteria: AcmgCriteriaCNV.Gain5H,
        defaultScore: isDefault ? 0.3 : null
      }
    }
  }

  /** Gets the effective `CriteriaCNVState` for an `AcmgCriteriaCNV`.*/
  getCriteriaCNVState(criteria: AcmgCriteriaCNV): CriteriaCNVState {
    let defaultScore = null

    for (const StateSourceCNV of ALL_STATE_SOURCES) {
      if (!this.CriteriaCNVStates[StateSourceCNV]) {
        continue
      }

      const CriteriaCNVState = this.CriteriaCNVStates[StateSourceCNV][criteria]
      if (CriteriaCNVState) {
        if (CriteriaCNVState.criteria !== criteria) {
          throw new Error('criteria mismatch; should never happen')
        }

        if (CriteriaCNVState.defaultScore !== null) {
          defaultScore = CriteriaCNVState.defaultScore
        }
      }
    }

    return {
      criteria,
      defaultScore
    }
  }

  /** Get the `CriteriaCNVState` for an explicit `StateSourceCNV`.
   *
   * This will be the original object, do not modify it.
   */
  getCriteriaCNVStateFromSource(
    criteria: AcmgCriteriaCNV,
    source: StateSourceCNV
  ): CriteriaCNVState {
    if (!this.CriteriaCNVStates[source] || !this.CriteriaCNVStates[source][criteria]) {
      throw new Error(`Criteria ${criteria} not found for source ${source}`)
    } else {
      return this.CriteriaCNVStates[source][criteria]
    }
  }

  /** Sets the `Score` of a `CriteriaCNVState` for a given `StateSourceCNV` and `AcmgCriteriaCNV`. */
  setScore(source: StateSourceCNV, criteria: AcmgCriteriaCNV, defaultScore: number | null) {
    if (source === StateSourceCNV.Default) {
      throw new Error('Cannot set presence for default source')
    }

    if (
      !this.CriteriaCNVStates[source] ||
      !this.CriteriaCNVStates[source][criteria] ||
      !this.CriteriaCNVStates[source][criteria].defaultScore
    ) {
      throw new Error(`Criteria ${criteria} not found for source ${source}`)
    } else {
      this.CriteriaCNVStates[source][criteria].defaultScore = defaultScore
    }
  }

  /** Returns the raw map of states, don't use to modify. */
  getStates() {
    return this.CriteriaCNVStates
  }

  /** Returns the ACMG class for current criteria state. */
  getAcmgClass() {
    let score = 0

    for (const criteria of ALL_ACMG_CRITERIA_CNV) {
      const CriteriaCNVState = this.getCriteriaCNVState(criteria)
      score += CriteriaCNVState.defaultScore || 0
    }

    const isPathogenic = score >= 0.99
    const isLikelyPathogenic = score >= 0.9 && score < 0.99
    const isUncertainSignificance = score > -0.89 && score < 0.9
    const isLikelyBenign = score <= -0.9 && score > -0.99
    const isBenign = score <= -0.99
    const isConflicting = (isPathogenic || isLikelyPathogenic) && (isLikelyBenign || isBenign)

    if (isConflicting) {
      return ['Conflicting', isConflicting]
    } else if (isPathogenic) {
      return ['Pathogenic', isConflicting]
    } else if (isLikelyPathogenic) {
      return ['Likely pathogenic', isConflicting]
    } else if (isBenign) {
      return ['Benign', isConflicting]
    } else if (isLikelyBenign) {
      return ['Likely benign', isConflicting]
    } else if (isUncertainSignificance) {
      return ['Uncertain significance', isConflicting]
    }
  }
}

export {
  ACMG_CRITERIA_CNV_DEFS,
  ALL_ACMG_CRITERIA_CNV,
  ALL_STATE_SOURCES,
  type CriteriaCNVDefinition,
  type CriteriaCNVState,
  type CriteriaToState,
  MultiSourceAcmgCriteriaCNVState,
  StateSourceCNV
}
