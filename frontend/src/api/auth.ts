import { API_V1_BASE_PREFIX } from '@/api/common'

/** Access to the authentication-related part of the API.
 */
export class AuthClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_V1_BASE_PREFIX
    this.csrfToken = csrfToken ?? null
  }

  /**
   * Perform login and return whether the login was successful.
   *
   * @param username The username/email to login with.
   * @param password The password to login with.
   * @returns Whether the login was successful.
   */
  async login(username: string, password: string): Promise<boolean> {
    const response = await fetch(`${this.apiBaseUrl}auth/cookie/login`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: `username=${encodeURIComponent(username)}&` + `password=${encodeURIComponent(password)}`
    })
    return response.status === 204
  }

  async logout(): Promise<string> {
    const response = await fetch(`${this.apiBaseUrl}auth/cookie/logout`, {
      method: 'POST'
    })
    return await response.text()
  }
}
