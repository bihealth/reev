import { API_INTERNAL_BASE_PREFIX_MEHARI } from '@/api/common'
import type { LinearStrucvar, Seqvar } from '@/lib/genomicVars'

const API_BASE_URL = `${API_INTERNAL_BASE_PREFIX_MEHARI}/`

export class MehariClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    this.csrfToken = csrfToken ?? null
  }

  async retrieveSeqvarsCsq(seqvar: Seqvar, hgnc_id?: string): Promise<any> {
    const { genomeBuild, chrom, pos, del, ins } = seqvar
    const hgncSuffix = hgnc_id ? `&hgnc_id=${hgnc_id}` : ''
    const url =
      `${this.apiBaseUrl}seqvars/csq?genome_release=${genomeBuild}&` +
      `chromosome=${chrom}&position=${pos}&reference=${del}&` +
      `alternative=${ins}${hgncSuffix}`

    const response = await fetch(url, {
      method: 'GET'
    })
    return await response.json()
  }

  async retrieveStrucvarsCsq(strucvar: LinearStrucvar): Promise<any> {
    const { genomeBuild, chrom, start, stop, svType } = strucvar
    const url =
      `${this.apiBaseUrl}strucvars/csq?genome_release=${genomeBuild}&` +
      `chromosome=${chrom}&start=${start}&stop=${stop}&sv_type=${svType}`
    const response = await fetch(url, {
      method: 'GET'
    })
    return await response.json()
  }
}
