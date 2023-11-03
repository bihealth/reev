import { API_INTERNAL_BASE_PREFIX } from '@/api/common'

const API_BASE_URL = API_INTERNAL_BASE_PREFIX

export class SettingsClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_BASE_URL
    this.csrfToken = csrfToken ?? null
  }

  async fetchFrontendSettings(): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}frontend-settings`, {
      method: 'GET'
    })
    return await response.json()
  }
}
