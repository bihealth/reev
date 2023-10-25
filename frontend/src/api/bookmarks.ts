import { API_V1_BASE_PREFIX } from '@/api/common'
import { UsersClient } from '@/api/users'

/**
 * Access to the bookmarks part of the API.
 */
export class BookmarksClient {
  private apiBaseUrl: string
  private csrfToken: string | null
  private currentUserId: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_V1_BASE_PREFIX
    this.csrfToken = csrfToken ?? null
    this.currentUserId = null
  }

  /**
   * Obtains the currently logged in user's information.
   */
  async fetchCurrentUser(): Promise<any> {
    const userClient = new UsersClient()
    const response = await userClient.fetchCurrentUserProfile()
    this.currentUserId = response.id
  }

  /**
   * Obtains the currently logged in user's bookmarks.
   *
   * @returns bookmarks list for the current user
   */
  async fetchBookmarks(): Promise<any> {
    // Obtain the current user's information
    await this.fetchCurrentUser()
    const url = `${this.apiBaseUrl}bookmarks/list?user_id=${this.currentUserId}`
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
    return await response.json()
  }

  /**
   * Obtains the currently logged in user's bookmark for the given object.
   *
   * @param obj_type object type, e.g., "seqvar"
   * @param obj_id object ID, e.g., "HGNC:1100"
   * @returns bookmark for the current user
   */
  async fetchBookmark(obj_type: string, obj_id: string): Promise<any> {
    // Obtain the current user's information
    await this.fetchCurrentUser()
    const url = `${this.apiBaseUrl}bookmarks/get?user_id=${this.currentUserId}&obj_type=${obj_type}&obj_id=${obj_id}`
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
    return await response.json()
  }

  /**
   * Creates a bookmark for the current user.
   *
   * @param obj_type object type, e.g., "seqvar"
   * @param obj_id object ID, e.g., "HGNC:1100"
   * @returns created bookmark
   */
  async createBookmark(obj_type: string, obj_id: string): Promise<any> {
    // Obtain the current user's information
    await this.fetchCurrentUser()
    if (this.currentUserId === null) {
      throw new Error('User ID is null.')
    }
    const response = await fetch(`${this.apiBaseUrl}bookmarks/create`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: `{"user": "${this.currentUserId}", "obj_type": "${obj_type}", "obj_id": "${obj_id}"}`
    })
    return await response.json()
  }

  /**
   * Deletes a bookmark for the current user.
   *
   * @param obj_type object type, e.g., "seqvar"
   * @param obj_id object ID, e.g., "HGNC:1100"
   * @returns deleted bookmark
   */
  async deleteBookmark(obj_type: string, obj_id: string): Promise<any> {
    // Obtain the current user's information
    await this.fetchCurrentUser()
    const url = `${this.apiBaseUrl}bookmarks/delete?user_id=${this.currentUserId}&obj_type=${obj_type}&obj_id=${obj_id}`
    const response = await fetch(url, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include'
    })
    return await response.json()
  }
}
