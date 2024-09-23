import { ConfigError } from '@bihealth/reev-frontend-lib/api/common'
import { Seqvar } from '@bihealth/reev-frontend-lib/lib/genomicVars'

import { API_INTERNAL_BASE_PREFIX_AUTO_ACMG } from '../common'
import { AutoACMGSeqVarResult } from './types'

//: URL to the AutoACMG API
const API_BASE_URL = `${API_INTERNAL_BASE_PREFIX_AUTO_ACMG}/api/v1`

export class AutoACMGClient {
  private apiBaseUrl: string

  /**
   * @param apiBaseUrl
   *            API base to the backend, excluding trailing `/`.
   *            The default is declared in '@/lib/urlConfig'.
   * @throws ConfigError if the API base URL is not configured.
   */
  constructor(apiBaseUrl?: string) {
    if (apiBaseUrl !== undefined || API_BASE_URL !== undefined) {
      // @ts-ignore
      this.apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    } else {
      throw new ConfigError('Configuration error: API base URL not configured')
    }
  }

  /**
   * Classify sequence variant using AutoACMG.
   *
   * @param seqvar The variant to classify.
   * @returns The classification result.
   * @throws StatusCodeNotOk if the request fails.
   * @throws InvalidResponseContent if the response is not valid JSON.
   */
  async classifySequenceVariant(seqvar: Seqvar): Promise<AutoACMGSeqVarResult> {
    const seqvarName = `chr${seqvar.chrom}:${seqvar.pos}:${seqvar.del}:${seqvar.ins}`

    console.log('REQUESTING', this.apiBaseUrl)
    const url =
      `${this.apiBaseUrl}/predict/seqvar?variant_name=${seqvarName}` +
      `&genome_release=${seqvar.genomeBuild}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data['prediction']
  }
}
