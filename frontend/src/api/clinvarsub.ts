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
  /** The token to set; optional */
  clinvar_api_token?: string
}

/** Interface for reading submission thread. */
export interface SubmissionThreadRead {
  /** The internal UUID (unset when creating). */
  id: string
  /** Submitting organisation to use for submission. */
  submittingorg_id: string
  /** Primary variant description. */
  primary_variant_desc: string
  /** Timestamp of creation. */
  created: string
  /** Timestamp of last update. */
  updated: string
  /** Effective SCV. */
  effective_scv: string | null
  /** Effective presence in ClinVar. */
  effective_presence: VariantPresence | null
  /** Desired presence in ClinVar. */
  desired_presence: VariantPresence | null
  /** Current thread status. */
  status: SubmissionThreadStatus
}

/** Interface for one page of submitting orgs. */
export interface SubmissionThreadPage {
  /** The payload. */
  items: SubmissionThreadRead[]
  /** Total number of items. */
  total: number | null
  /** Cursor for current page. */
  current_page: string | null
  /** Cursor for previous page. */
  previous_page: string | null
  /** Cursor for next page. */
  next_page: string | null
}

/** Enumeration for variant presence. */
export enum VariantPresence {
  /** The variant is present. */
  Present = 'present',
  /** The variant is absent. */
  Absent = 'absent'
}

/** Enumeration for submission thread status. */
export enum SubmissionThreadStatus {
  // Initial state while being edited by the user.
  Initial = 'initial',
  // Waiting in the queue to be picked up by the worker.
  Waiting = 'waiting',
  // At least one activity has been picked up by the worker and
  // there is at least one activity that is not complete yet.
  InProgress = 'in_progress',
  // The submission thread has been processed with final result of success.
  Success = 'success',
  // The submission thread has terminated with final result of failure.
  Error = 'error'
}

/** Interface for updating submission threads. */
export interface SubmissionThreadWrite {
  /** The internal UUID (unset when creating). */
  id?: string
  /** Effective SCV. */
  effective_scv?: string
  /** Effective presence in ClinVar. */
  effective_presence?: VariantPresence
  /** The submitting org (only when creating). */
  submitting_org_id?: string
  /** The variant description (only when creating). */
  primary_variant_desc?: string
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
  async fetchSubmittingOrgs(
    cursor?: string | undefined,
    pageSize: number = 50
  ): Promise<SubmittingOrgPage> {
    let query: string
    if (cursor) {
      query = `cursor=${cursor}&size=${pageSize}`
    } else {
      query = `size=${pageSize}`
    }
    const response = await fetch(`${this.apiBaseUrl}clinvarsub/submittingorgs?${query}`, {
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
   * Create a new submitting organization.
   *
   * @param submittingOrg The submitting organization to create.
   * @returns The created submitting organization.
   */
  async createSubmittingOrg(submittingOrg: SubmittingOrgWrite): Promise<SubmittingOrgRead> {
    const response = await fetch(`${this.apiBaseUrl}clinvarsub/submittingorgs`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submittingOrg)
    })
    return await response.json()
  }

  /**
   * Update a submitting organization.
   *
   * @param submittingOrg The submitting organization to update.
   * @returns The updated submitting organization.
   */
  async updateSubmittingOrg(submittingOrg: SubmittingOrgWrite): Promise<SubmittingOrgRead> {
    const response = await fetch(
      `${this.apiBaseUrl}clinvarsub/submittingorgs/${submittingOrg.id}`,
      {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submittingOrg)
      }
    )
    return await response.json()
  }

  /**
   * Delete a submitting organization.
   *
   * @param id The UUID of the submitting organization to delete.
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

  /**
   * Fetch submission threads for the given variant owned by the current user.
   *
   * @param primaryVariantDesc Primary description of variant to fetch for.
   * @param cursor The optional cursor to use for fetching.
   * @param pageSize The page size to use for enumerating.
   * @returns One page of submission threads.
   */
  async fetchSubmissionThreads(
    primaryVariantDesc: string,
    cursor?: string | undefined,
    pageSize: number = 50
  ): Promise<SubmissionThreadPage> {
    let query: string
    if (cursor) {
      query = `primary_variant_desc=${primaryVariantDesc}&cursor=${cursor}&size=${pageSize}`
    } else {
      query = `primary_variant_desc=${primaryVariantDesc}&size=${pageSize}`
    }
    const response = await fetch(`${this.apiBaseUrl}clinvarsub/submissionthreads?${query}`, {
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
}
