/**
 * This module contains the client API code for handling ClinVar submissions.
 */
import { API_V1_BASE_PREFIX } from '@/api/common'

/** Interface for reading submitting orgs. */
export interface SubmittingOrgRead {
  /** The internal UUID. */
  id: string
  /** A user-facing label. */
  label: string
  /** Timestamp of creation. */
  created: string
  /** Timestamp of last update. */
  updated: string
}

/** Interface for one page of submitting orgs. */
export interface SubmittingOrgPage {
  /** The payload. */
  items: SubmittingOrgRead[]
  /** Total number of items. */
  total: number | null
  /** Cursor for current page. */
  current_page: string | null
  /** Cursor for previous page. */
  previous_page: string | null
  /** Cursor for next page. */
  next_page: string | null
}

/** Interface for updating/creating submitting orgs. */
export interface SubmittingOrgWrite {
  /** The internal UUID (unset when creating). */
  id?: string
  /** A user-facing label. */
  label: string
  /** Timestamp of creation. */
  created: string
  /** Timestamp of last update. */
  updated: string
}

export class ClinvarsubClient {
  private apiBaseUrl: string
  private csrfToken: string | null

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_V1_BASE_PREFIX
    this.csrfToken = csrfToken ?? null
  }

  /**
   * Fetch one page of submitting organizations.
   *
   * @param cursor The optional cursor to use for fetching.
   * @param pageSize The page size to use for enumerating.
   * @returns One page of submitting organizations.
   */
  async fetchSubmittingOrgs(cursor?: string, pageSize: number = 50): Promise<SubmittingOrgPage> {
    const response = await fetch(`${this.apiBaseUrl}clinvarsub/submittingorgs?size=${pageSize}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    return await response.json()
  }

  /**
   * Delete a submitting organization.
   */
  async deleteSubmittingOrg(id: string): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}clinvarsub/submittingorgs/${id}`, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(`Failed to delete submitting org ${id}`)
    }
  }
}
