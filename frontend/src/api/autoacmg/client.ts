import { ConfigError } from "@bihealth/reev-frontend-lib/api/common"
import { urlConfig } from "@bihealth/reev-frontend-lib/lib"
import { Seqvar } from "@bihealth/reev-frontend-lib/lib/genomicVars"
// Add this import
import { SeqVarClassificationResult } from "./types"

export class AutoACMGClient {
  private apiBaseUrl: string

  /**
   * @param apiBaseUrl
   *            API base to the backend, excluding trailing `/`.
   *            The default is declared in '@/lib/urlConfig'.
   * @throws ConfigError if the API base URL is not configured.
   */
  constructor(apiBaseUrl?: string) {
    // Change this line
    if (apiBaseUrl !== undefined || urlConfig.baseUrlAutoAcmg !== undefined) {
      // @ts-ignore
      this.apiBaseUrl = apiBaseUrl ?? urlConfig.baseUrlAutoAcmg
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
  async classifyVariant(seqvar: Seqvar): Promise<any> {
    const seqvarName = seqvar.toString()
    console.log(seqvarName)

    const url =
      `${this.apiBaseUrl}/predict/seqvar?variant_name=${seqvarName}` +
      `&genome_release=${seqvar.genomeBuild}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    console.log(data)
    return data
  }
}
