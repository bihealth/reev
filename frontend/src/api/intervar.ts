import { API_INTERNAL_BASE_PREFIX } from '@/api/common'
import type { Seqvar } from '@/lib/genomicVars'
import type { AcmgRatingBackend } from '@/stores/seqvarAcmgRating'

const API_BASE_URL = `${API_INTERNAL_BASE_PREFIX}`

export class InterVarClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    this.csrfToken = csrfToken ?? null
  }

  /**
   * Fetch ACMG rating from InterVar via proxy.
   */
  async fetchAcmgRating(seqvar: Seqvar): Promise<AcmgRatingBackend> {
    const { genomeBuild, chrom, pos, del, ins } = seqvar
    const release = genomeBuild === 'grch37' ? 'hg19' : 'hg38'
    const url =
      `${API_BASE_URL}remote/acmg/?release=${release}&chromosome=${chrom}` +
      `&position=${pos}&reference=${del}&alternative=${ins}`
    const response = await fetch(url, { method: 'GET' })

    if (!response.ok) {
      throw new Error(`Failed to fetch ACMG rating for ${seqvar.userRepr}`)
    }

    return await response.json()
  }
}
