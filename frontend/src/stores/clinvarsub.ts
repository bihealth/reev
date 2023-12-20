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
  type SubmissionThreadRead,
  type SubmittingOrgRead
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
   */
  const loadSubmissionThreads = async (primaryVariantDesc$: string | null | undefined) => {
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
    loadSubmissionThreads
  }
})
