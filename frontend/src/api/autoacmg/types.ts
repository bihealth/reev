export interface SeqVarClassificationResult {
  classification: string
  score: number
  pathogenic: boolean
  likelyPathogenic: boolean
  likelyBenign: boolean
  benign: boolean
}
