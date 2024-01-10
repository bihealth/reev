import { chunks } from '@reactgular/chunks'

import { API_INTERNAL_BASE_PREFIX_ANNONARS } from '@/api/common'
import type { LinearStrucvar, Seqvar } from '@/lib/genomicVars'

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
   * @param seqvar The variant to retrieve the information for.
   */
  async fetchVariantInfo(seqvar: Seqvar): Promise<any> {
    const { genomeBuild, chrom, pos, del, ins } = seqvar
    let chromosome = chrom.replace('chr', '')
    if (genomeBuild !== 'grch37') {
      chromosome = `chr${chrom}`
    }

    const url =
      `${this.apiBaseUrl}annos/variant?genome_release=${genomeBuild}&` +
      `chromosome=${chromosome}&pos=${pos}&reference=${del}&` +
      `alternative=${ins}`

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
    const response = await fetch(`${this.apiBaseUrl}genes/search?q=${query}`, {
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
    strucvar: LinearStrucvar,
    pageSize: number = 1000,
    minOverlap: number = 0.1
  ): Promise<any> {
    const { genomeBuild, chrom, start, stop } = strucvar
    const url =
      `${this.apiBaseUrl}clinvar-sv/query?genomeRelease=${genomeBuild}&` +
      `chromosome=${chrom}&start=${start}&stop=${stop}&pageSize=${pageSize}&` +
      `minOverlap=${minOverlap}`

    const response = await fetch(url, {
      method: 'GET'
    })
    return await response.json()
  }
}
