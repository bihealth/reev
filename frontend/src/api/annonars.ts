import { API_BASE_PREFIX_ANNONARS } from '@/api/common'

const API_BASE_URL = `${API_BASE_PREFIX_ANNONARS}/`

export class AnnonarsClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    this.csrfToken = csrfToken ?? null
  }

  async fetchGeneInfo(hgncId: string): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}genes/info?hgnc_id=${hgncId}`, {
      method: 'GET'
    })
    return await response.json()
  }

  async fetchVariantInfo(
    genomeRelease: string,
    chromosome: string,
    pos: number,
    reference: string,
    alternative: string
  ): Promise<any> {
    const url =
      `${this.apiBaseUrl}annos/variant?genome_release=${genomeRelease}&` +
      `chromosome=${chromosome}&pos=${pos}&reference=${reference}&` +
      `alternative=${alternative}`

    const response = await fetch(url, {
      method: 'GET'
    })
    return await response.json()
  }
}
