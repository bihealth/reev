const API_BASE_URL =
  import.meta.env.MODE == 'development' ? '//localhost:8080/proxy/annonars' : '/proxy/annonars'

export class AnnonarsClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    this.csrfToken = csrfToken ?? null
  }

  async fetchGeneInfo(hgncId: string): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}/genes/info?hgnc-id=${hgncId}`, {
      method: 'GET'
    })
    return await response.json()
  }
}
