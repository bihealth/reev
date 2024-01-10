import { API_V1_BASE_PREFIX } from '@/api/common'
import type { SeqvarImpl } from '@/lib/genomicVars'
import { type AcmgRatingBackend } from '@/stores/seqvarAcmgRating'

/**
 * Access to the seqvar part of the API.
 */
export class AcmgSeqVarClient {
  private apiBaseUrl: string
  private csrfToken: string | null
  private currentUserId: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_V1_BASE_PREFIX
    this.csrfToken = csrfToken ?? null
    this.currentUserId = null
  }

  /**
   * List all ACMG ratings for a user.
   *
   * @returns The list of ACMG ratings for the user.
   */
  async listAcmgRatings(): Promise<any> {
    const url = `${this.apiBaseUrl}acmgSeqvar/list`
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
    return await response.json()
  }

  /**
   * Obtains the ACMG rating for a variant.
   *
   * @param seqVar The variant to retrieve the ACMG rating for.
   * @returns The ACMG rating for the variant.
   */
  async fetchAcmgRating(seqVar: SeqvarImpl): Promise<any> {
    const url = `${this.apiBaseUrl}acmgSeqvar/get?seqvar=${seqVar.toName()}`
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
    return await response.json()
  }

  /**
   * Save the ACMG rating for a variant.
   */
  async saveAcmgRating(
    seqVar: SeqvarImpl,
    acmgRating: AcmgRatingBackend
  ): Promise<AcmgRatingBackend> {
    const postData = `{
      "seqvar_name": "${seqVar.toName()}",
      "acmg_rank": ${JSON.stringify(acmgRating)}
    }`
    const response = await fetch(`${this.apiBaseUrl}acmgSeqvar/create`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: postData
    })
    return await response.json()
  }

  /**
   * Update the ACMG rating for a variant.
   */
  async updateAcmgRating(
    seqVar: SeqvarImpl,
    acmgRating: AcmgRatingBackend
  ): Promise<AcmgRatingBackend> {
    const postData = `{
      "seqvar_name": "${seqVar.toName()}",
      "acmg_rank": ${JSON.stringify(acmgRating)}
    }`
    const response = await fetch(`${this.apiBaseUrl}acmgSeqvar/update`, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: postData
    })
    return await response.json()
  }

  /**
   * Delete the ACMG rating for a variant.
   */
  async deleteAcmgRating(seqVar: SeqvarImpl): Promise<AcmgRatingBackend> {
    const response = await fetch(`${this.apiBaseUrl}acmgSeqvar/delete?seqvar=${seqVar.toName()}`, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include'
    })
    return await response.json()
  }
}
