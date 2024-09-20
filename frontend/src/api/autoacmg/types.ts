// Enums for prediction and strength
export enum AutoACMGPrediction {
  NotSet = 'not_set',
  Applicable = 'applicable',
  NotApplicable = 'not_applicable',
  NotAutomated = 'not_automated',
  Depricated = 'deprecated',
  Failed = 'failed'
}

export enum AutoACMGStrength {
  NotSet = 'not_set',
  PathogenicVeryStrong = 'pathogenic_very_strong',
  PathogenicStrong = 'pathogenic_strong',
  PathogenicModerate = 'pathogenic_moderate',
  PathogenicSupporting = 'pathogenic_supporting',
  BenignStandAlone = 'benign_stand_alone',
  BenignStrong = 'benign_strong',
  BenignSupporting = 'benign_supporting'
}

// Basic information about the sequence variant
export interface AutoACMGSeqVar {
  genome_release: string
  chrom: string
  pos: number
  delete: string
  insert: string
  user_repr?: string
}

// Define AutoACMGCADD interface
export interface AutoACMGCADD {
  phyloP100?: number
  gerp?: number
  spliceAI_acceptor_gain?: number
  spliceAI_acceptor_loss?: number
  spliceAI_donor_gain?: number
  spliceAI_donor_loss?: number
  ada?: number
  rf?: number
}

// Define AutoACMGDbnsfp interface
export interface AutoACMGDbnsfp {
  alpha_missense?: number
  metaRNN?: number
  bayesDel_noAF?: number
  revel?: number
  phyloP100?: number
  sift?: number
  polyphen2?: number
  mutationTaster?: number
  fathmm?: number
  provean?: number
  vest4?: number
  mutpred?: number
  primateAI?: number
}

// Define AutoACMGDbscsnv interface
export interface AutoACMGDbscsnv {
  ada?: number
  rf?: number
}

// Define AutoACMGConsequence interface
export interface AutoACMGConsequence {
  mehari: string[]
  cadd: string
  cadd_consequence: string
}

// Criteria for the ACMG classification
export interface AutoACMGCriteria {
  name: string
  prediction: AutoACMGPrediction
  strength: AutoACMGStrength
  summary: string
  description: string
}

// All ACMG criteria predictions grouped
export interface AutoACMGCriteriaPred {
  [key: string]: AutoACMGCriteria
}

// Genetic variant scores from various sources
export interface AutoACMGSeqVarScores {
  cadd: AutoACMGCADD
  dbnsfp: AutoACMGDbnsfp
  dbscsnv: AutoACMGDbscsnv
  misZ?: number
}

// Thresholds for decision making in ACMG criteria
export interface AutoACMGSeqVarThresholds {
  phyloP100: number
  gerp: number
  spliceAI_acceptor_gain: number
  spliceAI_acceptor_loss: number
  spliceAI_donor_gain: number
  spliceAI_donor_loss: number
  ada: number
  rf: number
  metaRNN_pathogenic: number
  bayesDel_noAF_pathogenic: number
  revel_pathogenic: number
  cadd_pathogenic: number
  metaRNN_benign: number
  bayesDel_noAF_benign: number
  revel_benign: number
  cadd_benign: number
  pp2bp1_pathogenic: number
  pp2bp1_benign: number
  pm1_pathogenic: number
  ba1_benign: number
  bs1_benign: number
  pm2_pathogenic: number
  an_min: number
  pp3bp4_strategy: string
  bp7_donor: number
  bp7_acceptor: number
}

// Complete data used for ACMG prediction for a variant
export interface AutoACMGSeqVarData {
  consequence: AutoACMGConsequence
  gene_symbol: string
  hgnc_id: string
  transcript_id: string
  transcript_tags: string[]
  tx_pos_utr: number
  cds_pos: number
  prot_pos: number
  prot_length: number
  pHGVS: string
  cds_start: number
  cds_end: number
  strand: string
  scores: AutoACMGSeqVarScores
  thresholds: AutoACMGSeqVarThresholds
}

// The main result object for the ACMG sequence variant prediction
export interface AutoACMGSeqVarResult {
  seqvar?: AutoACMGSeqVar
  data: AutoACMGSeqVarData
  criteria: AutoACMGCriteriaPred
}
