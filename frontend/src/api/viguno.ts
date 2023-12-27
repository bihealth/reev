import { API_INTERNAL_BASE_PREFIX_VIGUNO } from '@/api/common'

const API_BASE_URL = `${API_INTERNAL_BASE_PREFIX_VIGUNO}/`

/** HPO term as returned by the API */
export interface HpoTerm {
  /** Term ID with `HP:` prefix. */
  term_id: string
  /** Human-readable term name. */
  name: string
}

/** Gene as returned by the API. */
export interface Gene {
  gene_ncbi_id: number
  gene_symbol: string
  hgnc_id: string
  hpo_terms?: HpoTerm[]
}

export class VigunoClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    this.csrfToken = csrfToken ?? null
  }

  async resolveOmimTermById(id: string): Promise<any> {
    const url = `${this.apiBaseUrl}hpo/omims?omim_id=${id}`
    const response = await fetch(url, {
      method: 'GET'
    })

    if (!response.ok) {
      const errorBody = await response.json()
      throw new Error(errorBody.msg || response.statusText)
    }

    return await response.json()
  }

  async queryOmimTermsByName(query: string, matchType: string = 'contains'): Promise<any> {
    const url = `${this.apiBaseUrl}hpo/omims?name=${query}&match=${matchType}`
    const response = await fetch(url, {
      method: 'GET'
    })

    if (!response.ok) {
      const errorBody = await response.json()
      throw new Error(errorBody.msg || response.statusText)
    }

    return await response.json()
  }

  async resolveHpoTermById(id: string): Promise<any> {
    const url = `${this.apiBaseUrl}hpo/terms?term_id=${id}`
    const response = await fetch(url, {
      method: 'GET'
    })

    if (!response.ok) {
      const errorBody = await response.json()
      throw new Error(errorBody.msg || response.statusText)
    }

    return await response.json()
  }

  async queryHpoTermsByName(query: string): Promise<any> {
    const url = `${this.apiBaseUrl}hpo/terms?name=${query}`
    const response = await fetch(url, {
      method: 'GET'
    })

    if (!response.ok) {
      const errorBody = await response.json()
      throw new Error(errorBody.msg || response.statusText)
    }

    return await response.json()
  }

  /**
   * Retrieves HPO terms associated with a gene.
   *
   * @param hgncId
   * @returns List of HPO terms associated with the gene.
   */
  async fetchHpoTermsForHgncId(hgncId: string): Promise<HpoTerm[]> {
    const url = `${this.apiBaseUrl}hpo/genes?gene_id=${hgncId}&hpo_terms=true`
    const response = await fetch(url, {
      method: 'GET'
    })

    if (!response.ok) {
      const errorBody = await response.json()
      throw new Error(errorBody.msg || response.statusText)
    }

    const res = await response.json()
    if (!res.result?.length || res.result.length === 0) {
      return []
    }
    return (res.result[0].hpo_terms ?? []).map((term: HpoTerm) => ({
      term_id: term.term_id,
      name: term.name
    }))
  }
}
