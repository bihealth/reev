import { API_V1_BASE_PREFIX } from '@/api/common'
import type { CaseInfo } from '@/stores/caseInfo'

import type { ApiResponse, FailureInfo } from './types'

/**
 * Access to the caseinfo part of the API.
 */
export class CaseInfoClient {
  private apiBaseUrl: string
  private csrfToken: string | null
  private currentUserId: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_V1_BASE_PREFIX
    this.csrfToken = csrfToken ?? null
    this.currentUserId = null
  }

  /**
   * Obtains the case information.
   *
   * @returns case information
   */
  async fetchCaseInfo(): Promise<ApiResponse> {
    const url = `${this.apiBaseUrl}caseinfo/get`
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
    if (response.status == 204) {
      return { message: 'Case info not found' } as FailureInfo
    }
    return await response.json()
  }

  /**
   * Creates the case information.
   *
   * @param caseInfo case information
   * @returns created case information
   */
  async createCaseInfo(caseInfo: CaseInfo): Promise<ApiResponse> {
    const postData = `{
      "pseudonym": "${caseInfo.pseudonym}",
      "diseases": ${JSON.stringify(caseInfo.diseases)},
      "hpo_terms": ${JSON.stringify(caseInfo.hpoTerms)},
      "inheritance": "${caseInfo.inheritance}",
      "affected_family_members": ${caseInfo.affectedFamilyMembers},
      "sex": "${caseInfo.sex}",
      "age_of_onset_month": ${caseInfo.ageOfOnsetMonths},
      "ethincity": "${caseInfo.ethnicity}",
      "zygosity": "${caseInfo.zygosity}",
      "family_segregation": "${caseInfo.familySegregation}"
    }`
    const response = await fetch(`${this.apiBaseUrl}caseinfo/create`, {
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
   * Updates the case information.
   *
   * @param caseInfo case information
   * @returns updated case information
   */
  async updateCaseInfo(caseInfo: CaseInfo): Promise<ApiResponse> {
    const postData = `{
      "pseudonym": "${caseInfo.pseudonym}",
      "diseases": ${JSON.stringify(caseInfo.diseases)},
      "hpo_terms": ${JSON.stringify(caseInfo.hpoTerms)},
      "inheritance": "${caseInfo.inheritance}",
      "affected_family_members": ${caseInfo.affectedFamilyMembers},
      "sex": "${caseInfo.sex}",
      "age_of_onset_month": ${caseInfo.ageOfOnsetMonths},
      "ethincity": "${caseInfo.ethnicity}",
      "zygosity": "${caseInfo.zygosity}",
      "family_segregation": ${caseInfo.familySegregation}
    }`
    const response = await fetch(`${this.apiBaseUrl}caseinfo/update`, {
      method: 'PATCH',
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
   * Deletes the case information.
   *
   * @returns deleted case information
   */
  async deleteCaseInfo(): Promise<ApiResponse> {
    const response = await fetch(`${this.apiBaseUrl}caseinfo/delete`, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    return await response.json()
  }
}
