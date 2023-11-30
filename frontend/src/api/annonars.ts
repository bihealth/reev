import { chunks } from '@reactgular/chunks'

import { API_INTERNAL_BASE_PREFIX_ANNONARS } from '@/api/common'

const API_BASE_URL = `${API_INTERNAL_BASE_PREFIX_ANNONARS}/`

export class AnnonarsClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    this.csrfToken = csrfToken ?? null
  }

  /**
   * Fetch gene information via annonars REST API.
   *
   * @param hgncId HGNC ID, e.g., `"HGNC:26467"`.
   */
  async fetchGeneInfo(hgncId: string): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}genes/info?hgnc_id=${hgncId}`, {
      method: 'GET'
    })
    return await response.json()
  }

  /**
   * Fetch variant information via annonars and mehari REST APIs.
   *
   * @param genomeRelease GRCh37 or GRCh38.
   * @param chromosome Chromosome, e.g., `"chr1"`.
   * @param pos Position of the variant.
   * @param reference Reference nucleotide, e.g., `"A"`.
   * @param alternative Alternative nucleotide, e.g., `"G"`.
   */
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

  /**
   * Fetch overlapping ClinVar strucvars via annonars REST API.
   */
  async fetchClinvarStrucvars(
    genomeRelease: string,
    chromosome: string,
    start: number,
    end: number,
    pageSize: number = 1000,
    minOverlap: number = 0.1
  ): Promise<any> {
    const url =
      `${this.apiBaseUrl}clinvar-sv/query?genomeRelease=${genomeRelease}&` +
      `chromosome=${chromosome}&start=${start}&stop=${end}&pageSize=${pageSize}&` +
      `minOverlap=${minOverlap}`

    const response = await fetch(url, {
      method: 'GET'
    })
    return await response.json()
  }
}
