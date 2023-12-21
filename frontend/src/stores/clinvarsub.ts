/**
 * Store for manipulating the clinvarsub for the `ClinvarsubCard`.
 *
 * Note that the submitting org editor from the profile page for loading the
 * data as that plays better with the `VDataTableServer`.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
  ClinvarsubClient,
  VariantPresence,
  type SubmissionThreadRead,
  type SubmissionThreadWrite,
  type SubmittingOrgRead,
  SubmissionThreadStatus,
  type SubmissionActivityWrite,
  SubmissionActivityStatus,
  SubmissionActivityKind,
  type SubmissionContainer
} from '@/api/clinvarsub'
import { StoreState } from '@/stores/misc'

export const useClinvarsubStore = defineStore('clinvarsub', () => {
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** Submitting orgs by UUID. */
  const submittingOrgs = ref<{ [key: string]: SubmittingOrgRead }>({})

  /** The primary variant description that the submission thread etc. are loaded for. */
  const primaryVariantDesc = ref<string | undefined>(undefined)

  /** The `SubmissionThreadRead` objects by UUID for the current primary variant description. */
  const submissionThreads = ref<{ [key: string]: SubmissionThreadRead }>({})

  /** Load all submitting orgs of the current user. */
  const loadSubmittingOrgs = async () => {
    submittingOrgs.value = {}

    const client = new ClinvarsubClient()
    storeState.value = StoreState.Loading
    try {
      let cursorNext: string | undefined = undefined
      do {
        const page = await client.fetchSubmittingOrgs()
        for (const org of page.items) {
          submittingOrgs.value[org.id] = org
        }
        cursorNext = page.next_page ?? undefined
      } while (cursorNext)
      storeState.value = StoreState.Active
    } catch (err) {
      storeState.value = StoreState.Error
    }
  }

  /**
   * Load all submission threads given the primary variant description.
   *
   * Clear by calling with `null`/`undefined`.
   *
   * Will not attempt to load the submision thread for the same primary variant
   * description unless `force` is set to `true`.
   *
   * Will set `storeState` to `StoreState.Error` in case of errors.
   *
   * @param primaryVariantDesc$ The primary variant description to load the submission threads for.
   * @param force Whether to force reloading the submission threads.
   */
  const loadSubmissionThreads = async (
    primaryVariantDesc$: string | null | undefined,
    force: boolean = false
  ) => {
    if (!force && primaryVariantDesc.value === primaryVariantDesc$) {
      return // already loaded
    }

    primaryVariantDesc.value = undefined
    submissionThreads.value = {}
    if (!primaryVariantDesc$) {
      return // cleared
    }

    const client = new ClinvarsubClient()
    storeState.value = StoreState.Loading
    try {
      let cursorNext: string | undefined = undefined
      do {
        const page = await client.fetchSubmissionThreads(primaryVariantDesc$)
        for (const thread of page.items) {
          submissionThreads.value[thread.id] = thread
        }
        cursorNext = page.next_page ?? undefined
      } while (cursorNext)
      primaryVariantDesc.value = primaryVariantDesc$
      storeState.value = StoreState.Active
    } catch (err) {
      storeState.value = StoreState.Error
    }
  }

  /**
   * Create a new submission thread for the current variant via the API.
   *
   * Will update the store state with the newly created submission thread.
   *
   * In case of errors creating, will throw an error but not set the store
   * state.  Will call `loadSubmissionThreads()` that may set the store state
   * to error.
   *
   * @param submittingOrgId The submitting org ID to create the submission thread for.
   * @param primaryVariantDesc$ The primary variant description to create the submission thread for.
   * @param effectiveScv The effective SCV to create the submission thread for.
   * @param effectivePresence The effective presence to create the submission thread for.
   * @param desiredPresence The desired presence to create the submission thread for.
   * @param payload The payload to create the submission thread for.
   * @throws {Error} In case of errors creating the submission thread.
   */
  const createSubmissionThread = async (
    submittingOrgId: string,
    primaryVariantDesc$: string,
    effectiveScv: string | undefined,
    effectivePresence: VariantPresence,
    desiredPresence: VariantPresence,
    payload: SubmissionContainer,
  ): Promise<SubmissionThreadRead> => {
    const client = new ClinvarsubClient()

    // Create submission thread with status 'initial'.
    const submissionThreadCreate: SubmissionThreadWrite = {
      submittingorg_id: submittingOrgId,
      primary_variant_desc: primaryVariantDesc$,
      effective_scv: effectiveScv,
      effective_presence: effectivePresence,
      desired_presence: desiredPresence,
      status: SubmissionThreadStatus.Initial,
    }
    let submissionThread = await client.createSubmissionThread(submissionThreadCreate)
    // Determine activity kind for activity, then create activity.
    let kind: SubmissionActivityKind
    if (desiredPresence === VariantPresence.Absent) {
      kind = SubmissionActivityKind.Delete
    } else if (desiredPresence === VariantPresence.Present) {
      if (effectiveScv === undefined) {
        kind = SubmissionActivityKind.Create
      } else {
        kind = SubmissionActivityKind.Update
      }
    } else {
      throw new Error(`unexpected kind: ${desiredPresence}/${effectiveScv}`)
    }
    const submissionActivityCreate: SubmissionActivityWrite = {
      submissionthread_id: submissionThread.id,
      kind,
      status: SubmissionActivityStatus.Initial,
      request_payload: payload,
    }
    let submissionActivity = await client.createSubmissionActivity(submissionActivityCreate)
    // Now that thread/activity are on the server, submit both to the worker by
    // marking them as `WAITING`.
    const submissionThreadUpdate: SubmissionThreadWrite = {
      ...submissionThread,
      status: SubmissionThreadStatus.Waiting,
    }
    submissionThread = await client.updateSubmissionThread(submissionThreadUpdate)
    const submissionActivityUpdate: SubmissionActivityWrite = {
      ...submissionActivity,
      status: SubmissionActivityStatus.Waiting,
    }
    submissionActivity = await client.updateSubmissionActivity(submissionActivityUpdate)

    // Finally, reload submission threads.
    loadSubmissionThreads(primaryVariantDesc$, true)

    return submissionThread
  }

  /**
   * Initialize the store.
   *
   * When forced, this will reload all data.
   */
  const initialize = async (force: boolean = false) => {
    // guard against initializing multiple times
    if (storeState.value !== StoreState.Initial && !force) {
      return
    }
    // clear against artifacts, mark store as currently loading
    clear()
    storeState.value = StoreState.Loading
    // load all submitting orgs
    await loadSubmittingOrgs()
    // initialization done; mark store as active
    storeState.value = StoreState.Active
  }

  /**
   * Clear all data in the store.
   */
  const clear = () => {
    storeState.value = StoreState.Initial
    submittingOrgs.value = {}
    primaryVariantDesc.value = undefined
    submissionThreads.value = {}
  }

  return {
    storeState,
    submittingOrgs,
    primaryVariantDesc,
    submissionThreads,
    clear,
    initialize,
    loadSubmittingOrgs,
    loadSubmissionThreads,
    createSubmissionThread
  }
})
