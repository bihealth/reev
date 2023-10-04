import { API_INTERNAL_BASE_PREFIX_DOTTY } from '@/api/common'

const API_BASE_URL = `${API_INTERNAL_BASE_PREFIX_DOTTY}/`

/** SPDI representation as returned by dotty. */
export interface Spdi {
  /** Assembly version. */
  assembly: 'GRCh37' | 'GRCh38'
  /** Contig. */
  contig: string
  /** Position. */
  pos: number
  /** Deleted sequence. */
  reference_deleted: string
  /** Inserted sequence. */
  alternate_inserted: string
}

/** Response of a dotto query */
export interface DottyResponse {
  /** SPDI returned by dotty. */
  spdi: Spdi
}

export class DottyClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    this.csrfToken = csrfToken ?? null
  }

  async toSpdi(q: String, assembly: 'GRCh37' | 'GRCh38' = 'GRCh38'): Promise<DottyResponse | null> {
    const url = `${API_INTERNAL_BASE_PREFIX_DOTTY}/api/v1/to-spdi?q=${q}&assembly=${assembly}`
    const response = await fetch(url, {
      method: 'GET'
    })
    if (response.status == 200) {
      return await response.json()
    } else {
      return null
    }
  }
}
