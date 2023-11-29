/** Enumeration with dosage. */
export enum Dosage {
  CLINGEN_DOSAGE_SCORE_UNKNOWN = 'CLINGEN_DOSAGE_SCORE_UNKNOWN',
  CLINGEN_DOSAGE_SCORE_SUFFICIENT_EVIDENCE_AVAILABLE = 'CLINGEN_DOSAGE_SCORE_SUFFICIENT_EVIDENCE_AVAILABLE',
  CLINGEN_DOSAGE_SCORE_SOME_EVIDENCE_AVAILABLE = 'CLINGEN_DOSAGE_SCORE_SOME_EVIDENCE_AVAILABLE',
  CLINGEN_DOSAGE_SCORE_LITTLE_EVIDENCE = 'CLINGEN_DOSAGE_SCORE_LITTLE_EVIDENCE',
  CLINGEN_DOSAGE_SCORE_NO_EVIDENCE_AVAILABLE = 'CLINGEN_DOSAGE_SCORE_NO_EVIDENCE_AVAILABLE',
  CLINGEN_DOSAGE_SCORE_RECESSIVE = 'CLINGEN_DOSAGE_SCORE_RECESSIVE',
  CLINGEN_DOSAGE_SCORE_UNLIKELY = 'CLINGEN_DOSAGE_SCORE_UNLIKELY'
}

/** Scores for ClinGen dosage scores. */
export const CLINGEN_DOSAGE_SCORES: { [key: string]: number } = {
  CLINGEN_DOSAGE_SCORE_UNKNOWN: 0,
  CLINGEN_DOSAGE_SCORE_SUFFICIENT_EVIDENCE_AVAILABLE: 3,
  CLINGEN_DOSAGE_SCORE_SOME_EVIDENCE_AVAILABLE: 2,
  CLINGEN_DOSAGE_SCORE_LITTLE_EVIDENCE: 1,
  CLINGEN_DOSAGE_SCORE_NO_EVIDENCE_AVAILABLE: 0,
  CLINGEN_DOSAGE_SCORE_RECESSIVE: 30,
  CLINGEN_DOSAGE_SCORE_UNLIKELY: 40
}

/** Colors for ClinGen dosage scores. */
export const CLINGEN_DOSAGE_COLOR: { [key: string]: string } = {
  CLINGEN_DOSAGE_SCORE_UNKNOWN: 'transparent',
  CLINGEN_DOSAGE_SCORE_SUFFICIENT_EVIDENCE_AVAILABLE: 'red-darken-3',
  CLINGEN_DOSAGE_SCORE_SOME_EVIDENCE_AVAILABLE: 'orange-darken-2',
  CLINGEN_DOSAGE_SCORE_LITTLE_EVIDENCE: 'orange-darken-2',
  CLINGEN_DOSAGE_SCORE_NO_EVIDENCE_AVAILABLE: 'green-lighten-2',
  CLINGEN_DOSAGE_SCORE_RECESSIVE: 'orange-darken-2',
  CLINGEN_DOSAGE_SCORE_UNLIKELY: 'green-lighten-2'
}

/** Labels for ClinGen dosage scores. */
export const CLINGEN_DOSAGE_LABELS: { [key: string]: string } = {
  CLINGEN_DOSAGE_SCORE_UNKNOWN: 'unknown',
  CLINGEN_DOSAGE_SCORE_SUFFICIENT_EVIDENCE_AVAILABLE:
    'sufficient evidence for dosage pathogenicity',
  CLINGEN_DOSAGE_SCORE_SOME_EVIDENCE_AVAILABLE: 'some evidence for dosage pathogenicity',
  CLINGEN_DOSAGE_SCORE_LITTLE_EVIDENCE: 'little evidence for dosage pathogenicity',
  CLINGEN_DOSAGE_SCORE_NO_EVIDENCE_AVAILABLE: 'no evidence for dosage pathogenicity',
  CLINGEN_DOSAGE_SCORE_RECESSIVE: 'gene associated with autosomal recessive phenotype',
  CLINGEN_DOSAGE_SCORE_UNLIKELY: 'dosage sensitivity unlikely'
}

/** Short labels for ClinGen dosage scores. */
export const CLINGEN_DOSAGE_LABELS_SHORT: { [key: string]: string } = {
  CLINGEN_DOSAGE_SCORE_UNKNOWN: 'unknown',
  CLINGEN_DOSAGE_SCORE_SUFFICIENT_EVIDENCE_AVAILABLE: 'sufficient evidence',
  CLINGEN_DOSAGE_SCORE_SOME_EVIDENCE_AVAILABLE: 'some evidence',
  CLINGEN_DOSAGE_SCORE_LITTLE_EVIDENCE: 'little evidence',
  CLINGEN_DOSAGE_SCORE_NO_EVIDENCE_AVAILABLE: 'no evidence',
  CLINGEN_DOSAGE_SCORE_RECESSIVE: 'gene autosomal recessive',
  CLINGEN_DOSAGE_SCORE_UNLIKELY: 'unlikely'
}
