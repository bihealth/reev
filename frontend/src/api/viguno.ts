import { API_INTERNAL_BASE_PREFIX_VIGUNO } from '@/api/common'

const API_BASE_URL = `${API_INTERNAL_BASE_PREFIX_VIGUNO}/`

export class VigunoClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    this.csrfToken = csrfToken ?? null
  }

  async queryOmimById(id: string): Promise<any> {
    const url = `${this.apiBaseUrl}hpo/omims?omim_id=${id}`
    const response = await fetch(url, {
      method: 'GET'
    })
    return await response.json()
  }

  async queryOmimByName(query: string, matchType: string = 'contains'): Promise<any> {
    const url = `${this.apiBaseUrl}hpo/omims?name=${query}&match=${matchType}`
    const response = await fetch(url, {
      method: 'GET'
    })
    return await response.json()
  }

  async resolveHpoTermById(id: string): Promise<any> {
    const url = `${this.apiBaseUrl}hpo/terms?term_id=${id}`
    const response = await fetch(url, {
      method: 'GET'
    })
    return await response.json()
  }

  async resolveHpoTermByName(query: string, matchType: string = 'contains'): Promise<any> {
    const url = `${this.apiBaseUrl}hpo/terms?name=${query}&match=${matchType}`
    const response = await fetch(url, {
      method: 'GET'
    })
    return await response.json()
  }
}
