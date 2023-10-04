import { API_INTERNAL_BASE_PREFIX_MEHARI } from '@/api/common'

const API_BASE_URL = `${API_INTERNAL_BASE_PREFIX_MEHARI}/`

export class MehariClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    this.csrfToken = csrfToken ?? null
  }

  async retrieveSeqvarsCsq(
    genomeRelease: string,
    chromosome: string,
    pos: number,
    reference: string,
    alternative: string,
    hgnc_id?: string
  ): Promise<any> {
    const hgncSuffix = hgnc_id ? `&hgnc_id=${hgnc_id}` : ''
    const url =
      `${this.apiBaseUrl}seqvars/csq?genome_release=${genomeRelease}&` +
      `chromosome=${chromosome}&position=${pos}&reference=${reference}&` +
      `alternative=${alternative}${hgncSuffix}`

    const response = await fetch(url, {
      method: 'GET'
    })
    return await response.json()
  }

  async retrieveStrucvarsCsq(
    genomeRelease: string,
    chromosome: string,
    start: number,
    stop: number,
    sv_type: string
  ): Promise<any> {
    const url =
      `${this.apiBaseUrl}strucvars/csq?genome_release=${genomeRelease}&` +
      `chromosome=${chromosome}&start=${start}&stop=${stop}&sv_type=${sv_type}`
    const response = await fetch(url, {
      method: 'GET'
    })
    return await response.json()
  }
}
