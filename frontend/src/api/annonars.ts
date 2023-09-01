import { API_PROXY_BASE_PREFIX } from '@/api/common'

export class AnnonarsClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? `${API_PROXY_BASE_PREFIX}annonars`
    this.csrfToken = csrfToken ?? null
  }

  async fetchGeneInfo(hgncId: string): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}/genes/info?hgnc_id=${hgncId}`, {
      method: 'GET'
    })
    return await response.json()
  }
}
