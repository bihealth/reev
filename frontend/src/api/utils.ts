import { API_V1_BASE_PREFIX } from '@/api/common'

export interface SendTestEmailResponse {
  msg: string
}

export class UtilsClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_V1_BASE_PREFIX
    this.csrfToken = csrfToken ?? null
  }

  /**
   * Trigger test email to an email address.
   *
   * Note that this API is only available to superusers.
   *
   * @param email_to Email address to send test email to
   */
  async sendTestEmail(email_to: string): Promise<SendTestEmailResponse> {
    const response = await fetch(`${this.apiBaseUrl}utils/test-email/?email_to=${email_to}`, {
      method: 'POST'
    })
    return (await response.json()) as SendTestEmailResponse
  }
}
