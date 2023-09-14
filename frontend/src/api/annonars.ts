import { chunks } from '@reactgular/chunks'
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
    let chrom = chromosome.replace('chr', '')
    if (genomeRelease !== 'grch37') {
      chrom = `chr${chrom}`
    }

    const url =
      `${this.apiBaseUrl}annos/variant?genome_release=${genomeRelease}&` +
      `chromosome=${chrom}&pos=${pos}&reference=${reference}&` +
      `alternative=${alternative}`

    const response = await fetch(url, {
      method: 'GET'
    })
    return await response.json()
  }

  /**
   * Retrieve clinvar-gene information via annonars REST API.
   *
   * @param hgncIds Array of HGNC IDs to use, e.g., `["HGNC:26467"]`.
   * @param chunkSize How many IDs to send in one request.
   * @returns Promise with an array of gene information objects.
   */
  async retrieveGeneClinvarInfos(
    hgncIds: Array<string>,
    chunkSize?: number,
  ): Promise<Array<any>> {
    const hgncIdChunks = chunks(hgncIds, chunkSize ?? this.defaultChunkSize)

    const promises = hgncIdChunks.map((chunk) => {
      const url = `${this.baseUrl}/genes/clinvar?hgnc_id=${chunk.join(',')}`

      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
      if (this.csrfToken) {
        headers['X-CSRFToken'] = this.csrfToken
      }

      return fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers,
      })
    })

    const responses = await Promise.all(promises)
    const results = await Promise.all(
      responses.map((response) => response.json()),
    )

    const result = []
    results.forEach((chunk) => {
      for (const value of Object.values(chunk.genes)) {
        result.push(value)
      }
    })
    return result
  }

  async fetchGenes(query: string): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}genes/search?${query}`, {
      method: 'GET'
    })
    return await response.json()
  }
}
