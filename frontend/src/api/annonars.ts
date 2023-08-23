import { API_BASE_PREFIX } from '@/api/common'

const API_BASE_URL = `${API_BASE_PREFIX}/`

export class AnnonarsClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    this.csrfToken = csrfToken ?? null
  }

  async fetchGeneInfo(hgncId: string): Promise<any> {
    console.log(`${this.apiBaseUrl}genes/info?hgnc-id=${hgncId}`)
    const response = await fetch(`${this.apiBaseUrl}genes/info?hgnc-id=${hgncId}`, {
      method: 'GET'
    })
    return await response.json()
  }
}
