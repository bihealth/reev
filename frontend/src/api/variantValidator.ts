import { API_INTERNAL_BASE_PREFIX } from '@/api/common'
import type { Seqvar } from '@/lib/genomicVars'

const API_BASE_URL = `${API_INTERNAL_BASE_PREFIX}`

export class VariantValidatorClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    this.csrfToken = csrfToken ?? null
  }

  /**
   * Call variant validator API via proxy.
   *
   * @param seqvar The `Seqvar` object to be validated.
   * @returns The response from the API.
   * @throws Error if the API call fails.
   */
  async fetchVvResults(seqvar: Seqvar): Promise<any> {
    const { genomeBuild, chrom, pos, del, ins } = seqvar
    const release = genomeBuild === 'grch37' ? 'hg19' : 'hg38'
    const url =
      `${API_BASE_URL}remote/variantvalidator/${release}/` +
      `${chrom}-${pos}-${del}-${ins}/mane?content-type=application%2Fjson`
    const response = await fetch(url, { method: 'GET' })

    if (!response.ok) {
      throw new Error(`Failed to fetch ACMG rating for ${seqvar.userRepr}`)
    }

    return await response.json()
  }
}
