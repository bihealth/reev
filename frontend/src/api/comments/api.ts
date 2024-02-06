import { API_V1_BASE_PREFIX } from '@/api/common'

import { CommentType } from './types'

/**
 * Access to the comments part of the API.
 */
export class CommentsClient {
  private apiBaseUrl: string
  private csrfToken: string | null
  private currentUserId: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_V1_BASE_PREFIX
    this.csrfToken = csrfToken ?? null
    this.currentUserId = null
  }

  /**
   * Obtains the currently logged in user's comments.
   *
   * @returns comments list for the current user
   */
  async fetchComments(objType: CommentType, objId: string): Promise<any> {
    const url = `${this.apiBaseUrl}comments/list/${objType}/${objId}`
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
    return await response.json()
  }

  /**
   * Obtains the currently logged in user's comment for the given object.
   *
   * @param obj_type object type, e.g., "seqvar"
   * @param obj_id object ID, e.g., "HGNC:1100"
   * @returns comment for the current user
   */
  async fetchComment(obj_type: string, obj_id: string): Promise<any> {
    const url = `${this.apiBaseUrl}comments/get?obj_type=${obj_type}&obj_id=${obj_id}`
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
    if (response.status === 204) {
      return null
    }
    return await response.json()
  }

  /**
   * Creates a comment for the current user.
   *
   * @param obj_type object type, e.g., "seqvar"
   * @param obj_id object ID, e.g., "HGNC:1100"
   * @returns created comment
   */
  async createComment(obj_type: string, obj_id: string): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}comments/create`, {
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
   * Deletes a comment for the current user.
   *
   * @param obj_type object type, e.g., "seqvar"
   * @param obj_id object ID, e.g., "HGNC:1100"
   * @returns deleted comment
   */
  async deleteComment(obj_type: string, obj_id: string): Promise<any> {
    const url = `${this.apiBaseUrl}comments/delete?obj_type=${obj_type}&obj_id=${obj_id}`
    const response = await fetch(url, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include'
    })
    return await response.json()
  }
}
