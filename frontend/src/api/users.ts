import { API_V1_BASE_PREFIX } from '@/api/common'

export class UnauthenticatedError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'UnauthenticatedError'
  }
}

/** Access to the users part of the API.
 */
export class UsersClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_V1_BASE_PREFIX
    this.csrfToken = csrfToken ?? null
  }

  /**
   * Obtains the currently logged in user's information.
   *
   * @returns `UserClient` if authenticated
   * @throws `UnauthenticatedError` if not authenticated
   */
  async fetchCurrentUserProfile(): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}users/me`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      //   },
      //   body: `username=${encodeURIComponent(username)}&` + `password=${encodeURIComponent(password)}`
    })
    if (response.status !== 200) {
      throw new UnauthenticatedError("There was an error fetching the current user's profile.")
    } else {
      return await response.json()
    }
  }
}
