import { API_V1_BASE_PREFIX } from '@/api/common'
import type { UserData } from '@/stores/user'

export class UnauthenticatedError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'UnauthenticatedError'
  }
}

/** The values from `UserData` that can be updated, all optional */
export interface PartialUserData {
  email?: string
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
   * @returns `UserData` if authenticated
   * @throws `UnauthenticatedError` if not authenticated
   */
  async fetchCurrentUserProfile(): Promise<UserData> {
    const response = await fetch(`${this.apiBaseUrl}users/me`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
    if (response.status !== 200) {
      throw new UnauthenticatedError("There was an error fetching the current user's profile.")
    } else {
      return await response.json()
    }
  }

  /**
   * Updates the current user's profile.
   *
   * @param userData the values to use for the update
   * @returns `UserData` if authenticated
   */
  async updateUserProfile(userData: PartialUserData): Promise<UserData> {
    const response = await fetch(`${this.apiBaseUrl}users/me`, {
      method: 'PATCH',
      mode: 'cors',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    if (response.status !== 200) {
      throw new UnauthenticatedError("There was an error updating the current user's profile.")
    } else {
      return await response.json()
    }
  }
}
