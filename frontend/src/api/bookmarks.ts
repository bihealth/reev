import { API_V1_BASE_PREFIX } from '@/api/common'

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
   * Obtains the currently logged in user's bookmarks.
   *
   * @returns bookmarks list for the current user
   */
  async fetchBookmarks(): Promise<any> {
    const url = `${this.apiBaseUrl}bookmarks/list`
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
    const url = `${this.apiBaseUrl}bookmarks/get?obj_type=${obj_type}&obj_id=${obj_id}`
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
    const response = await fetch(`${this.apiBaseUrl}bookmarks/create`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: `{"obj_type": "${obj_type}", "obj_id": "${obj_id}"}`
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
    const url = `${this.apiBaseUrl}bookmarks/delete?obj_type=${obj_type}&obj_id=${obj_id}`
    const response = await fetch(url, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include'
    })
    return await response.json()
  }
}
