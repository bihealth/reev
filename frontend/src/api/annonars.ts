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

  async fetchGeneClinvarInfo(hgncId: string): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}genes/clinvar?hgnc_id=${hgncId}`, {
      method: 'GET'
    })
    return await response.json()
  }

  async fetchGenes(query: string): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}genes/search?${query}`, {
      method: 'GET'
    })
    return await response.json()
  }

  /**
   * Fetch gene informations via annonars REST API.
   *
   * @param hgncIds Array of HGNC IDs to use, e.g., `["HGNC:26467"]`.
   * @param chunkSize How many IDs to send in one request.
   * @returns Promise with an array of gene information objects.
   */
  async fetchGeneInfos(hgncIds: Array<string>, chunkSize?: number): Promise<Array<any>> {
    const hgncIdChunks = chunks(hgncIds, chunkSize ?? 10)

    const promises = hgncIdChunks.map((chunk: any) => {
      const url = `${this.apiBaseUrl}genes/info?hgnc_id=${chunk.join(',')}`

      return fetch(url, {
        method: 'GET'
      })
    })

    const responses = await Promise.all(promises)
    const results = await Promise.all(responses.map((response: any) => response.json()))

    const result: any = []
    results.forEach((chunk: any) => {
      for (const value of Object.values(chunk.genes)) {
        result.push(value)
      }
    })
    return result
  }
}
