import { API_V1_BASE_PREFIX } from '@/api/common'

export interface OAuth2Provider {
  name: string
  label: string
  url: string
}

interface OAuth2LoginUrlResponse {
  authorization_url: string
}

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
    return response.status === 204 || response.status === 200
  }

  async logout(): Promise<string> {
    const response = await fetch(`${this.apiBaseUrl}auth/cookie/logout`, {
      method: 'POST'
    })
    return await response.text()
  }

  async fetchOAuth2Providers(): Promise<OAuth2Provider[]> {
    const response = await fetch(`${this.apiBaseUrl}auth/oauth2-providers`, {
      method: 'GET'
    })
    return await response.json()
  }

  async fetchOAuth2LoginUrl(provider: OAuth2Provider, redirectTo?: string | null): Promise<string> {
    let url = `${this.apiBaseUrl}auth/external/cookie/${provider.name}/authorize`
    if (redirectTo) {
      url += `?redirect_to=${encodeURIComponent(redirectTo)}`
    }
    const response = await fetch(url, { method: 'GET' })
    const response_json: OAuth2LoginUrlResponse = await response.json()
    return response_json.authorization_url
  }

  /**
   * Request verification token from the given email address.
   *
   * @param email
   */
  async requestVerifyToken(email: string): Promise<any> {
    return await fetch(`${this.apiBaseUrl}auth/request-verify-token`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
  }

  /**
   * Send a verification request with the given token.
   */
  async sendVerifyRequest(token: string): Promise<any> {
    return await fetch(`${this.apiBaseUrl}auth/verify`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    })
  }
}
