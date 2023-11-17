import { API_INTERNAL_BASE_PREFIX_CADA_PRIO } from "./common"

const API_BASE_URL = `${API_INTERNAL_BASE_PREFIX_CADA_PRIO}/`

export class CadaPrioClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    this.csrfToken = csrfToken ?? null
  }

  async predictGeneImpact(
    hpoTerms: string[],
    geneSymbols?: string[]
  ): Promise<any> {
    const geneSuffix = geneSymbols ? `&gene_symbols=${geneSymbols.join(',')}` : ''
    const url =
      `${this.apiBaseUrl}api/v1/predict?hpo_terms=${hpoTerms.join(',')}${geneSuffix}`

    const response = await fetch(url, {
      method: 'GET'
    })
    return await response.json()
  }
}