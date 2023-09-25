/** The predefined ACMG criteria. */
enum AcmgCriteria {
  Loss1A = '1A',
  Loss1B = '1B',
  Loss2A = '2A',
  Loss2B = '2B',
  Loss2C1 = '2C-1',
  Loss2C2 = '2C-2',
  Loss2D1 = '2D-1',
  Loss2D2 = '2D-2',
  Loss2D3 = '2D-3',
  Loss2D4 = '2D-4',
  Loss2E = '2E',
  Loss2F = '2F',
  Loss2G = '2G',
  Loss2H = '2H',
  Loss3A = '3A',
  Loss3B = '3B',
  Loss3C = '3C',
  Loss4A = '4A',
  Loss4B = '4B',
  Loss4C = '4C',
  Loss4D = '4D',
  Loss4E = '4E',
  Loss4F = '4F',
  Loss4G = '4G',
  Loss4H = '4H',
  Loss4I = '4I',
  Loss4J = '4J',
  Loss4K = '4K',
  Loss4L = '4L',
  Loss4M = '4M',
  Loss4N = '4N',
  Loss4O = '4O',
  Loss5A = '5A',
  Loss5B = '5B',
  Loss5C = '5C',
  Loss5D = '5D',
  Loss5E = '5E',
  Loss5F = '5F',
  Loss5G = '5G',
  Loss5H = '5H',
  Gain1A = '1A',
  Gain1B = '1B',
  Gain2A = '2A',
  Gain2B = '2B',
  Gain2C = '2C',
  Gain2D = '2D',
  Gain2E = '2E',
  Gain2F = '2F',
  Gain2G = '2G',
  Gain2H = '2H',
  Gain2I = '2I',
  Gain2J = '2J',
  Gain2K = '2K',
  Gain2L = '2L',
  Gain3A = '3A',
  Gain3B = '3B',
  Gain3C = '3C',
  Gain4A = '4A',
  Gain4B = '4B',
  Gain4C = '4C',
  Gain4D = '4D',
  Gain4E = '4E',
  Gain4F = '4F',
  Gain4G = '4G',
  Gain4H = '4H',
  Gain4I = '4I',
  Gain4J = '4J',
  Gain4K = '4K',
  Gain4L = '4L',
  Gain4M = '4M',
  Gain4N = '4N',
  Gain4O = '4O',
  Gain5A = '5A',
  Gain5B = '5B',
  Gain5C = '5C',
  Gain5D = '5D',
  Gain5E = '5E',
  Gain5F = '5F',
  Gain5G = '5G',
  Gain5H = '5H',
}

/** Array of all ACMG criteria. */
const ALL_ACMG_CRITERIA = [
  AcmgCriteria.Loss1A,
  AcmgCriteria.Loss1B,
  AcmgCriteria.Loss2A,
  AcmgCriteria.Loss2B,
  AcmgCriteria.Loss2C1,
  AcmgCriteria.Loss2C2,
  AcmgCriteria.Loss2D1,
  AcmgCriteria.Loss2D2,
  AcmgCriteria.Loss2D3,
  AcmgCriteria.Loss2D4,
  AcmgCriteria.Loss2E,
  AcmgCriteria.Loss2F,
  AcmgCriteria.Loss2G,
  AcmgCriteria.Loss2H,
  AcmgCriteria.Loss3A,
  AcmgCriteria.Loss3B,
  AcmgCriteria.Loss3C,
  AcmgCriteria.Loss4A,
  AcmgCriteria.Loss4B,
  AcmgCriteria.Loss4C,
  AcmgCriteria.Loss4D,
  AcmgCriteria.Loss4E,
  AcmgCriteria.Loss4F,
  AcmgCriteria.Loss4G,
  AcmgCriteria.Loss4H,
  AcmgCriteria.Loss4I,
  AcmgCriteria.Loss4J,
  AcmgCriteria.Loss4K,
  AcmgCriteria.Loss4L,
  AcmgCriteria.Loss4M,
  AcmgCriteria.Loss4N,
  AcmgCriteria.Loss4O,
  AcmgCriteria.Loss5A,
  AcmgCriteria.Loss5B,
  AcmgCriteria.Loss5C,
  AcmgCriteria.Loss5D,
  AcmgCriteria.Loss5E,
  AcmgCriteria.Loss5F,
  AcmgCriteria.Loss5G,
  AcmgCriteria.Loss5H,
  AcmgCriteria.Gain1A,
  AcmgCriteria.Gain1B,
  AcmgCriteria.Gain2A,
  AcmgCriteria.Gain2B,
  AcmgCriteria.Gain2D,
  AcmgCriteria.Gain2E,
  AcmgCriteria.Gain2F,
  AcmgCriteria.Gain2G,
  AcmgCriteria.Gain2H,
  AcmgCriteria.Gain2I,
  AcmgCriteria.Gain2J,
  AcmgCriteria.Gain2K,
  AcmgCriteria.Gain2L,
  AcmgCriteria.Gain3A,
  AcmgCriteria.Gain3B,
  AcmgCriteria.Gain3C,
  AcmgCriteria.Gain4A,
  AcmgCriteria.Gain4B,
  AcmgCriteria.Gain4C,
  AcmgCriteria.Gain4D,
  AcmgCriteria.Gain4E,
  AcmgCriteria.Gain4F,
  AcmgCriteria.Gain4G,
  AcmgCriteria.Gain4H,
  AcmgCriteria.Gain4I,
  AcmgCriteria.Gain4J,
  AcmgCriteria.Gain4K,
  AcmgCriteria.Gain4L,
  AcmgCriteria.Gain4M,
  AcmgCriteria.Gain4N,
  AcmgCriteria.Gain4O,
  AcmgCriteria.Gain5A,
  AcmgCriteria.Gain5B,
  AcmgCriteria.Gain5C,
  AcmgCriteria.Gain5D,
  AcmgCriteria.Gain5E,
  AcmgCriteria.Gain5F,
  AcmgCriteria.Gain5G,
  AcmgCriteria.Gain5H
]

/** Detailed definition of one ACMG criteria such as PVS1. */
interface CriteriaDefinition {
  criteria: AcmgCriteria
  defaultScore: Number | null,
  maxScore: Number,
  label: string
  hint: string
  description: string
}

/** Predefined ACMG criteria. */
const ACMG_CRITERIA_DEFS: Map<AcmgCriteria, CriteriaDefinition> = new Map(
  [
    {
      criteria: AcmgCriteria.Loss1A,
      defaultScore: 0,
      maxScore: 0,
      label: '1A',
      hint: 'Copy number loss content',
      description: `Contains protein-coding or other known functionally important elements.`
    },
    {
      criteria: AcmgCriteria.Loss1B,
      defaultScore: -0.6,
      maxScore: -0.6,
      label: '1B',
      hint: '',
      description: `Does NOT contain protein-coding or any known functionally important elements.`
    },
    {
      criteria: AcmgCriteria.Loss2A,
      defaultScore: 1,
      maxScore: 1,
      label: '2A',
      hint: 'Overlap with ESTABLISHED HI genes or genomic regions and consideration of reason for referral',
      description: `Complete overlap of an established HI gene or genomic region.`
    },
    {
      criteria: AcmgCriteria.Loss2B,
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
      criteria: AcmgCriteria.Loss2C1,
      defaultScore: 0.9,
      maxScore: 1,
      label: '2C-1',
      hint: 'range: 0.45 - 1.0',
      description: `Partial overlap with the 5' end of an established HI gene (3' end of the gene not
        involved) and coding sequence is involved.`
    },
    {
      criteria: AcmgCriteria.Loss2C2,
      defaultScore: 0,
      maxScore: 0.45,
      label: '2C-2',
      hint: 'range: 0.45 - 1.0',
      description: `Partial overlap with the 5' end of an established HI gene (3' end of the gene not
        involved) and only the 5' UTR is involved.`
    },
    {
      criteria: AcmgCriteria.Loss2D1,
      defaultScore: 0,
      maxScore: 0,
      label: '2D-1',
      hint: 'Continue evaluation',
      description: `Partial overlap with the 3' end of an established HI gene (5' end of the gene not
        involved) and only 3' untransalted region is involved.`
    },
    {
      criteria: AcmgCriteria.Loss2D2,
      defaultScore: 0.9,
      maxScore: 0.9,
      label: '2D-2',
      hint: 'range: 0.45 - 0.9',
      description: `Partial overlap with the 3' end of an established HI gene (5' end of the gene not
        involved) and only the last exon is involved. Other established pathogenic variants have
        been reported in this exon.`
    },
    {
      criteria: AcmgCriteria.Loss2D3,
      defaultScore: 0.3,
      maxScore: 0.45,
      label: '2D-3',
      hint: 'range: 0.3 - 0.45',
      description: `Partial overlap with the 3' end of an established HI gene (5' end of the gene not
        involved) and only the last exon is involved. No other established pathogenic variants have
        been reported in this exon.`
    },
    {
      criteria: AcmgCriteria.Loss2D4,
      defaultScore: 0.9,
      maxScore: 1,
      label: '2D-4',
      hint: 'range: 0.45 - 1.0',
      description: `Partial overlap with the 3' end of an established HI gene (5' end of the gene not
        involved) and it includes other exons in addition to the last exon. Nonsense-mediated
        decay is expected to occur.`
    },
    {
      criteria: AcmgCriteria.Loss2E,
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
      criteria: AcmgCriteria.Loss2F,
      defaultScore: -1,
      maxScore: -1,
      label: '2F',
      hint: 'Overlap with ESTABLISHED benign genes or genomic regions',
      description: `Completely contained within an established benign CNV region.`
    },
    {
      criteria: AcmgCriteria.Loss2G,
      defaultScore: 0,
      maxScore: 0,
      label: '2G',
      hint: 'Continue evaluation',
      description: `Overlaps an established benign CNV, but includes additional genomic material.`
    },
    {
      criteria: AcmgCriteria.Loss2H,
      defaultScore: 0.15,
      maxScore: 0.15,
      label: '2H',
      hint: 'Haploinsufficiency predictors',
      description: `Two or more HI predictors suggest that AT LEAST ONE gene in the interval is HI.`
    },
    {
      criteria: AcmgCriteria.Loss3A,
      defaultScore: 0,
      maxScore: 0,
      label: '3A',
      hint: 'Number of protein-coding RefSeq genes wholly or partially included in the copy-number loss',
      description: `0-24 genes.`
    },
    {
      criteria: AcmgCriteria.Loss3B,
      defaultScore: 0.45,
      maxScore: 0.45,
      label: '3B',
      hint: '',
      description: `25-34 genes.`
    },
    {
      criteria: AcmgCriteria.Loss3C,
      defaultScore: 0.9,
      maxScore: 0.9,
      label: '3C',
      hint: '',
      description: `35+ genes.`
    },
    {
      criteria: AcmgCriteria.Loss4A,
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
      criteria: AcmgCriteria.Loss4B,
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
      criteria: AcmgCriteria.Loss4C,
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
      criteria: AcmgCriteria.Loss4D,
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
      criteria: AcmgCriteria.Loss4E,
      defaultScore: 0.10,
      maxScore: 0.3,
      label: '4E',
      hint: 'Individual case evidence — unknown inheritance (range: 0 to 0.15)',
      description: `Reported proband has a highly specific phenotype consistent with the gene/genomic
      region, but the inheritance of the variant is unknown.`
    },
    {
      criteria: AcmgCriteria.Loss4F,
      defaultScore: 0.15,
      maxScore: 0.45,
      label: '4F',
      hint: 'Individual case evidence — segregation among similarly affected family members',
      description: `3-4 observed segregations.`
    },
    {
      criteria: AcmgCriteria.Loss4G,
      defaultScore: 0.3,
      maxScore: 0.3,
      label: '4G',
      hint: '',
      description: `5-6 observed segregations.`
    },
    {
      criteria: AcmgCriteria.Loss4H,
      defaultScore: 0.45,
      maxScore: 0.45,
      label: '4H',
      hint: '',
      description: `7+ observed segregations.`
    },
    {
      criteria: AcmgCriteria.Loss4I,
      defaultScore: -0.45,
      maxScore: -0.9,
      label: '4I',
      hint: `Individual case evidence — nonsegregations -0.45 points per family (range: 0 to -0.45)`,
      description: `Variant is NOT found in another individual in the proband's family AFFECTED with a
      consistent, specific, well-defined phenotype (no known phenocopies).`
    },
    {
      criteria: AcmgCriteria.Loss4J,
      defaultScore: -0.3,
      maxScore: -0.9,
      label: '4J',
      hint: `-0.30 points per family (range: 0 to -0.30)`,
      description: `Variant IS found in another individual in the proband's family UNAFFECTED with the
      specific, well-defined phenotype observed in the proband.`
    },
    {
      criteria: AcmgCriteria.Loss4K,
      defaultScore: -0.15,
      maxScore: -0.3,
      label: '4K',
      hint: `-0.15 points per family (range: 0 to -0.15)`,
      description: `Variant IS found in another individual in the proband's family UNAFFECTED with the
      nonspecific phenotype observed in the proband`
    },
    {
      criteria: AcmgCriteria.Loss4L,
      defaultScore: 0.45,
      maxScore: 0.45,
      label: '4L',
      hint: 'Case-control and population evidence. 0.45 per study (range: 0 to 0.45 per study)',
      description: `Statistically significant increase amongst observations in cases (with a consistent,
        specific, well-defined phenotype) compared with controls.`
    },
    {
      criteria: AcmgCriteria.Loss4M,
      defaultScore: 0.3,
      maxScore: 0.45,
      label: '4M',
      hint: '0.30 per study (range: 0 to 0.30 per study',
      description: `Statistically significant increase amongst observations in cases (without a
        consistent, nonspecific phenotype OR unknown phenotype) compared with
        controls.`
    },
    {
      criteria: AcmgCriteria.Loss4N,
      defaultScore: -0.9,
      maxScore: -0.9,
      label: '4N',
      hint: '-0.90 (per study) (range: 0 to -0.90 per study',
      description: `No statistically significant difference between observations in cases and controls.`
    },
    {
      criteria: AcmgCriteria.Loss4O,
      defaultScore: -1,
      maxScore: -1,
      label: '4O',
      hint: '(range: 0 to -1)',
      description: `Overlap with common population variation.`
    },
    {
      criteria: AcmgCriteria.Loss5A,
      defaultScore: 0,
      maxScore: 0.45,
      label: '5A',
      hint: `Observed copy-number loss is de novo. Use de novo scoring categories from section 4 
      (4A-4D) to determine score`,
      description: `Use appropriate category from de novo scoring section in section 4.`
    },
    {
      criteria: AcmgCriteria.Loss5B,
      defaultScore: -0.3,
      maxScore: -0.45,
      label: '5B',
      hint: `Observed copy-number loss is inherited. (range: 0 to -0.45)`,
      description: `Patient with specific, well-defined phenotype and no family history. CNV is
      inherited from an apparently unaffected parent.`
    },
    {
      criteria: AcmgCriteria.Loss5C,
      defaultScore: -0.15,
      maxScore: -0.3,
      label: '5C',
      hint: `(range: 0 to -0.30)`,
      description: ` Patient with nonspecific phenotype and no family history. CNV is inherited from an
      apparently unaffected parent.`
    },
    {
      criteria: AcmgCriteria.Loss5D,
      defaultScore: 0,
      maxScore: 0.45,
      label: '5D',
      hint: `Use segregation scoring categories from section 4 (4F-4H) to determine score`,
      description: `CNV segregates with a consistent phenotype observed in the patient's family.`
    },
    {
      criteria: AcmgCriteria.Loss5E,
      defaultScore: 0,
      maxScore: -0.45,
      label: '5E',
      hint: `Observed copy-number loss — nonsegregations. Use nonsegregation scoring categories
      from section 4 (4I-4K) to determine score`,
      description: `Use appropriate category from nonsegregation section in section 4.`
    },
    {
      criteria: AcmgCriteria.Loss5F,
      defaultScore: 0,
      maxScore: 0,
      label: '5F',
      hint: `Other`,
      description: `Inheritance information is unavailable or uninformative.`
    },
    {
      criteria: AcmgCriteria.Loss5G,
      defaultScore: 0.1,
      maxScore: 0.15,
      label: '5G',
      hint: '(range: 0 to 0.15)',
      description: `Inheritance information is unavailable or uninformative. The patient phenotype is
      nonspecific, but is consistent with what has been described in similar cases.`
    },
    {
      criteria: AcmgCriteria.Loss5H,
      defaultScore: 0.3,
      maxScore: 0.3,
      label: '5H',
      hint: '(range: 0 to 0.30)',
      description: `Inheritance information is unavailable or uninformative. The patient phenotype is
      highly specific and consistent with what has been described in similar cases.`
    },
    {
      criteria: AcmgCriteria.Gain1A,
      defaultScore: 0,
      maxScore: 0,
      label: '1A',
      hint: `Copy number gain content (Continue evaluation)`,
      description: `Contains protein-coding or other known functionally important elements.`
    },
    {
      criteria: AcmgCriteria.Gain1B,
      defaultScore: -0.6,
      maxScore: -0.6,
      label: '1B',
      hint: '',
      description: `Does NOT contain protein-coding or any known functionally important elements.`
    },
    {
      criteria: AcmgCriteria.Gain2A,
      defaultScore: 1,
      maxScore: 1,
      label: '2A',
      hint: `Overlap with ESTABLISHED TS genes or genomic regions`,
      description: `Complete overlap; the TS gene or minimal critical region is fully contained within the
      observed copy-number gain.`
    },
    {
      criteria: AcmgCriteria.Gain2B,
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
      criteria: AcmgCriteria.Gain2C,
      defaultScore: -1,
      maxScore: -1,
      label: '2C',
      hint: `Overlap with ESTABLISHED benign copy-number gain genes or genomic regions`,
      description: `Identical in gene content to the established benign copy-number gain.`
    },
    {
      criteria: AcmgCriteria.Gain2D,
      defaultScore: -1,
      maxScore: -1,
      label: '2D',
      hint: '',
      description: `Smaller than established benign copy-number gain, breakpoint(s) does not interrupt
      protein-coding genes.`
    },
    {
      criteria: AcmgCriteria.Gain2E,
      defaultScore: 0,
      maxScore: 0,
      label: '2E',
      hint: 'Continue evaluation',
      description: ` Smaller than established benign copy-number gain, breakpoint(s) potentially interrupts
      protein-coding gene.`
    },
    {
      criteria: AcmgCriteria.Gain2F,
      defaultScore: -1,
      maxScore: -1,
      label: '2F',
      hint: '(range: 0 to -1)',
      description: `Larger than known benign copy-number gain, does not include additional proteincoding genes.`
    },
    {
      criteria: AcmgCriteria.Gain2G,
      defaultScore: 0,
      maxScore: 0,
      label: '2G',
      hint: 'Continue evaluation',
      description: ` Overlaps a benign copy-number gain but includes additional genomic material.`
    },
    {
      criteria: AcmgCriteria.Gain2H,
      defaultScore: 0,
      maxScore: 0,
      label: '2H',
      hint: `Overlap with ESTABLISHED HI gene(s). Continue evaluation`,
      description: `HI gene fully contained within observed copy-number gain.`
    },
    {
      criteria: AcmgCriteria.Gain2I,
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
      criteria: AcmgCriteria.Gain2J,
      defaultScore: 0,
      maxScore: 0,
      label: '2J',
      hint: 'Continue evaluation',
      description: `One breakpoint is within an established HI gene, patient's phenotype is either inconsistent
      with what is expected for LOF of that gene OR unknown`
    },
    {
      criteria: AcmgCriteria.Gain2K,
      defaultScore: 0.45,
      maxScore: 0.45,
      label: '2K',
      hint: '',
      description: `One breakpoint is within an established HI gene, patient's phenotype is highly specific and
      consistent with what is expected for LOF of that gene.`
    },
    {
      criteria: AcmgCriteria.Gain2L,
      defaultScore: 0,
      maxScore: 0,
      label: '2L',
      hint: 'Breakpoints within other gene(s). Continue evaluation',
      description: ` One or both breakpoints are within gene(s) of no established clinical significance.`
    },
    {
      criteria: AcmgCriteria.Gain3A,
      defaultScore: 0,
      maxScore: 0,
      label: '3A',
      hint: `Number of protein-coding RefSeq genes wholly or partially included in the copy-number gain`,
      description: `0-34 genes.`
    },
    {
      criteria: AcmgCriteria.Gain3B,
      defaultScore: 0.45,
      maxScore: 0.45,
      label: '3B',
      hint: '',
      description: `35-49 genes.`
    },
    {
      criteria: AcmgCriteria.Gain3C,
      defaultScore: 0.9,
      maxScore: 0.9,
      label: '3C',
      hint: '',
      description: `50+ genes.`
    },
    {
      criteria: AcmgCriteria.Gain4A,
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
      criteria: AcmgCriteria.Gain4B,
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
      criteria: AcmgCriteria.Gain4C,
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
      criteria: AcmgCriteria.Gain4D,
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
      criteria: AcmgCriteria.Gain4E,
      defaultScore: 0.1,
      maxScore: 0.3,
      label: '4A',
      hint: `Individual case evidence — unknown inheritance. 0.10 points each (range: 0 to 0.15)`,
      description: `Reported proband has a highly specific phenotype consistent with the gene/genomic
      region, but the inheritance of the variant is unknown.`
    },
    {
      criteria: AcmgCriteria.Gain4F,
      defaultScore: 0.15,
      maxScore: 0.45,
      label: '4F',
      hint: `Individual case evidence — segregation among similarly affected family members`,
      description: `3-4 observed segregations.`
    },
    {
      criteria: AcmgCriteria.Gain4G,
      defaultScore: 0.3,
      maxScore: 0.3,
      label: '4G',
      hint: '',
      description: `5-6 observed segregations.`
    },
    {
      criteria: AcmgCriteria.Gain4H,
      defaultScore: 0.45,
      maxScore: 0.45,
      label: '4H',
      hint: '',
      description: `7+ observed segregations.`
    },
    {
      criteria: AcmgCriteria.Gain4I,
      defaultScore: -0.45,
      maxScore: -0.9,
      label: '4I',
      hint: `Individual case evidence — nonsegregations. -0.45 points per family (range: 0 to -0.45)`,
      description: `Variant is NOT found in another individual in the proband's family AFFECTED with a
      consistent, specific, well-defined phenotype (no known phenocopies).`
    },
    {
      criteria: AcmgCriteria.Gain4J,
      defaultScore: -0.3,
      maxScore: -0.9,
      label: '4J',
      hint: `-0.30 points per family (range: 0 to -0.30)`,
      description: ` Variant IS found in another individual in the proband's family UNAFFECTED with the
      specific, well-defined phenotype observed in the proband.`
    },
    {
      criteria: AcmgCriteria.Gain4K,
      defaultScore: -0.15,
      maxScore: -0.3,
      label: '4K',
      hint: `-0.15 points per family (range: 0 to -0.15)`,
      description: `Variant IS found in another individual in the proband's family UNAFFECTED with the
      nonspecific phenotype observed in the proband.`
    },
    {
      criteria: AcmgCriteria.Gain4L,
      defaultScore: 0.45,
      maxScore: 0.45,
      label: '4L',
      hint: `Case-control and population evidence. 0.45 per study (range: 0 to 0.45 per study)`,
      description: `Statistically significant increase among observations in cases (with a consistent, specific,
        well-defined phenotype) compared with controls.`
    },
    {
      criteria: AcmgCriteria.Gain4M,
      defaultScore: 0.3,
      maxScore: 0.45,
      label: '4M',
      hint: `0.30 per study (range: 0 to 0.30 per study)`,
      description: `Statistically significant increase among observations in cases (with a consistent,
        nonspecific phenotype or unknown phenotype) compared with controls.`
    },
    {
      criteria: AcmgCriteria.Gain4N,
      defaultScore: -0.9,
      maxScore: -0.9,
      label: '4N',
      hint: `-0.90 (per study) (range: 0 to -0.90 per study)`,
      description: `No statistically significant difference between observations in cases and controls.`
    },
    {
      criteria: AcmgCriteria.Gain4O,
      defaultScore: -1,
      maxScore: -1,
      label: '4O',
      hint: `(range: 0 to -1)`,
      description: `Overlap with common population variation.`
    },
    {
      criteria: AcmgCriteria.Gain5A,
      defaultScore: 0,
      maxScore: 0.45,
      label: '5A',
      hint: `Observed copy-number gain is de novo. Use de novo scoring categories from section 4 (4A-4D) to determine score`,
      description: `Use appropriate category from de novo scoring section in section 4.`
    },
    {
      criteria: AcmgCriteria.Gain5B,
      defaultScore: -0.3,
      maxScore: -0.45,
      label: '5B',
      hint: `Observed copy-number gain is inherited. (range: 0 to -0.45)`,
      description: `Patient with a specific, well-defined phenotype and no family history. Copy-number
      gain is inherited from an apparently unaffected parent.`
    },
    {
      criteria: AcmgCriteria.Gain5C,
      defaultScore: -0.15,
      maxScore: -0.3,
      label: '5C',
      hint: `(range: 0 to -0.30)`,
      description: `Patient with nonspecific phenotype and no family history. Copy-number gain is
      inherited from an apparently unaffected parent.`
    },
    {
      criteria: AcmgCriteria.Gain5D,
      defaultScore: 0,
      maxScore: 0.45,
      label: '5D',
      hint: `Use segregation scoring categories from in
      section 4 (4F-4H) to determine score`,
      description: `CNV segregates with consistent phenotype observed in the patient's family.`
    },
    {
      criteria: AcmgCriteria.Gain5E,
      defaultScore: 0,
      maxScore: -0.45,
      label: '5E',
      hint: `Observed copy-number gain — nonsegregations. Use nonsegregation scoring categories from
      section 4 (4I-4K) to determine score`,
      description: `Use appropriate category from nonsegregation section in section 4.`
    },
    {
      criteria: AcmgCriteria.Gain5F,
      defaultScore: 0,
      maxScore: 0,
      label: '5F',
      hint: ``,
      description: `Inheritance information is unavailable or uninformative.`
    },
    {
      criteria: AcmgCriteria.Gain5G,
      defaultScore: 0.1,
      maxScore: 0.15,
      label: '5G',
      hint: `(range: 0 to 0.15)`,
      description: `Inheritance information is unavailable or uninformative. The patient phenotype is
      nonspecific, but is consistent with what has been described in similar cases.`
    },
    {
      criteria: AcmgCriteria.Gain5H,
      defaultScore: 0.3,
      maxScore: 0.3,
      label: '5H',
      hint: `(range: 0 to 0.30)`,
      description: `. Inheritance information is unavailable or uninformative. The patient phenotype is highly
      specific and consistent with what has been described in similar cases.`
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
  evidenceLevel: Number
}

/** Define where a given selection state comes from. */
enum StateSource {
  Default = 'Default',
  User = 'User'
}

/** All state sources from lowest to highest priority. */
const ALL_STATE_SOURCES = [StateSource.Default, StateSource.User]

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
      User: this.createCriteriaStateMap(StateSource.User)
    }
  }

  /** Creates a map of criteria states for a given source. */
  protected createCriteriaStateMap(source: StateSource): CriteriaToState {
    const isDefault = source === StateSource.Default
    return {
      '1A': {
        criteria: AcmgCriteria.Loss1A,
        presence: Presence.Unknown,
        defaultScore: isDefault ? 0 : null
      },
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

  /** Returns the ACMG class for current criteria state. */
  getAcmgClass(): [string, boolean] {
    const pvs = this.getActiveEvidenceCounts(AcmgEvidenceLevel.PathogenicVeryStrong)
    const ps = this.getActiveEvidenceCounts(AcmgEvidenceLevel.PathogenicStrong)
    const pm = this.getActiveEvidenceCounts(AcmgEvidenceLevel.PathogenicModerate)
    const pp = this.getActiveEvidenceCounts(AcmgEvidenceLevel.PathogenicSupporting)
    const ba = this.getActiveEvidenceCounts(AcmgEvidenceLevel.BenignStandalone)
    const bs = this.getActiveEvidenceCounts(AcmgEvidenceLevel.BenignStrong)
    const bp = this.getActiveEvidenceCounts(AcmgEvidenceLevel.BenignSupporting)
    const isPathogenic =
      (pvs === 1 && (ps >= 1 || pm >= 2 || (pm === 1 && pp === 1) || pp >= 2)) ||
      ps >= 2 ||
      (ps === 1 && (pm >= 3 || (pm === 2 && pp >= 2) || (pm === 1 && pp >= 4)))
    const isLikelyPathogenic =
      (pvs === 1 && pm === 1) ||
      (ps === 1 && pm >= 1 && pm <= 2) ||
      (ps === 1 && pp >= 2) ||
      pm >= 3 ||
      (pm === 2 && pp >= 2) ||
      (pm === 1 && pp >= 4)
    const isBenign = ba > 0 || bs >= 2
    const isLikelyBenign = (bs === 1 && bp === 1) || bp >= 2
    const isConflicting = (isPathogenic || isLikelyPathogenic) && (isBenign || isLikelyBenign)

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
    } else {
      return ['Uncertain significance', isConflicting]
    }
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
