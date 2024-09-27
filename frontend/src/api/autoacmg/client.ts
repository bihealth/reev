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
   * Helper function for long-time requests
   *
   * @param url The url to request
   * @param retries Number of retries
   * @param delay The delay time
   * @returns The Promise response
   */
  async fetchWithRetry(url: string, retries: number = 10, delay: number = 5000): Promise<Response> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok && retries > 0) {
        console.log(`Retrying... ${retries} retries left`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        return this.fetchWithRetry(url, retries - 1, delay)
      }
      return response
    } catch (error) {
      if (retries > 0) {
        console.log(`Error occurred, retrying... ${retries} retries left`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        return this.fetchWithRetry(url, retries - 1, delay)
      }
      throw error
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

    const url =
      `${this.apiBaseUrl}/predict/seqvar?variant_name=${seqvarName}` +
      `&genome_release=${seqvar.genomeBuild}`

    try {
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
    } catch (error) {
      throw new Error('Failed to fetch auto-acmg.')
    }
  }
}
