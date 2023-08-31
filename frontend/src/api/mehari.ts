import { API_BASE_PREFIX_MEHARI } from '@/api/common'

const API_BASE_URL = `${API_BASE_PREFIX_MEHARI}/`

export class MehariClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    this.csrfToken = csrfToken ?? null
  }

  async retrieveTxCsq(
    genomeRelease: string,
    chromosome: string,
    pos: number,
    reference: string,
    alternative: string,
    hgnc_id?: string
  ): Promise<any> {
    const hgncSuffix = hgnc_id ? `&hgnc-id=${hgnc_id}` : ''
    const url =
      `${this.apiBaseUrl}tx/csq?genome-release=${genomeRelease}&` +
      `chromosome=${chromosome}&position=${pos}&reference=${reference}&` +
      `alternative=${alternative}${hgncSuffix}`

    const response = await fetch(url, {
      method: 'GET'
    })
    return await response.json()
  }
}
