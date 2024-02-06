import { API_INTERNAL_BASE_PREFIX } from '@/api/common'

const API_BASE_URL = API_INTERNAL_BASE_PREFIX

export class MiscClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    this.csrfToken = csrfToken ?? null
  }

  async fetchVersion(): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}version`, {
      method: 'GET'
    })
    return await response.text()
  }
}
