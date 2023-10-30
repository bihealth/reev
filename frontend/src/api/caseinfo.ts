import { API_V1_BASE_PREFIX } from '@/api/common'

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
  async fetchCaseInfo(): Promise<any> {
    const url = `${this.apiBaseUrl}caseinfo/get`
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
    return await response.json()
  }

  /**
   * Updates the case information.
   *
   * @param caseInfo case information
   * @returns updated case information
   */
  async updateCaseInfo(caseInfo: any): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}caseinfo/update`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': this.csrfToken ?? ''
      },
      body: JSON.stringify(caseInfo)
    })
    return await response.json()
  }

  /**
   * Clears the case information.
   *
   * @returns cleared case information
   */
  async clearCaseInfo(): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}caseinfo/clear`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'X-CSRFToken': this.csrfToken ?? ''
      }
    })
    return await response.json()
  }
}
