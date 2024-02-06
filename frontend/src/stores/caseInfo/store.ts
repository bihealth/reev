/**
 * Store for case information.
 */
import { StoreState } from '@bihealth/reev-frontend-lib/stores/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { CaseInfoClient } from '@/api/caseInfo/api'
import { CaseInfo, StorageMode, isCaseInfo$Api, isFailureInfo } from '@/api/caseInfo/types'
import { MITT } from '@/lib/utils'
import { useCadaPrioStore } from '@/stores/cadaPrio'
import { Events as UserStoreEvents, useUserStore } from '@/stores/user'

import { DEFAULT_CASE_INFO, LOCAL_STORAGE_PREFIX } from './constants'

export const useCaseInfoStore = defineStore('caseInfo', () => {
  /** Current storage mode, set on initialization. */
  const storageMode = ref<StorageMode>(StorageMode.Local)
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** Currently stored case information. */
  const caseInfo = ref<CaseInfo>(structuredClone(DEFAULT_CASE_INFO))

  /** Clear all data from store. */
  const clearData = () => {
    caseInfo.value = structuredClone(DEFAULT_CASE_INFO)
  }

  /** Refresh the `cadaPrioStore` when the current case's terms change. */
  const refreshCadaPrioStore = async () => {
    const cadaPrioStore = useCadaPrioStore()
    await cadaPrioStore.loadData(
      caseInfo.value.hpoTerms.map((item) => item.termId),
      { skipClear: true }
    )
  }

  /**
   * Setup the event handlers.
   *
   * Currently, we only listen to the login/logout events.
   */
  const setupEventHandlers = () => {
    MITT.on(UserStoreEvents.Login, async () => {
      await initialize(true)
    })
    MITT.on(UserStoreEvents.Logout, async () => {
      await initialize(true)
    })
  }

  /**
   * Initialize the case store.
   *
   * @param force whether to force initialization
   */
  const initialize = async (force: boolean = false) => {
    if (storeState.value === StoreState.Active && !force) {
      return // do not initialize twice
    }

    // Ensure initialization of the dependent stores (only user store).
    const userStore = useUserStore()
    await userStore.initialize()

    // Adjust the storage mode dependent on the login state and setup event handlers.
    storageMode.value = userStore.currentUser ? StorageMode.Server : StorageMode.Local
    setupEventHandlers()

    // Load case from storage.
    await loadCase()
  }

  /**
   * Internal function to load the current case.
   *
   * This function is private to the store.
   */
  const loadCase = async () => {
    if (storageMode.value === StorageMode.Local) {
      storeState.value = StoreState.Loading
      const storeData = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}.caseInfo`)
      if (!storeData) {
        clearData()
      } else {
        caseInfo.value = JSON.parse(storeData) as CaseInfo
      }
      storeState.value = StoreState.Active
    } else {
      storeState.value = StoreState.Loading
      try {
        const client = new CaseInfoClient()
        const result = await client.fetchCaseInfo()
        if (!isCaseInfo$Api(result)) {
          throw new Error(`Response is not a valid case info: ${result.message}`)
        }
        caseInfo.value = CaseInfo.fromJson(result)

        // refresh CADA prio store after loading case
        await refreshCadaPrioStore()

        storeState.value = StoreState.Active
      } catch (e) {
        clearData()
        storeState.value = StoreState.Active
      }
    }
  }

  /**
   * Update the case information to server or local storage.
   *
   * @param caseData the case data to apply to the store
   */
  const updateCase = async (caseData: CaseInfo) => {
    if (storageMode.value === StorageMode.Local) {
      storeState.value = StoreState.Loading
      caseInfo.value = caseData
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}.caseInfo`, JSON.stringify(caseData))
      storeState.value = StoreState.Active
    } else {
      storeState.value = StoreState.Loading
      try {
        const client = new CaseInfoClient()
        const result: any = await client.fetchCaseInfo()
        if (result.detail === 'Unauthorized') {
          storeState.value = StoreState.Error
          return
        } else if (result.detail === 'Case Information not found') {
          await client.createCaseInfo(caseData)
        } else {
          const updatedCase = await client.updateCaseInfo(caseData)
          if (!isCaseInfo$Api(updatedCase)) {
            throw new Error(`Response is not a valid case info: ${result.message}`)
          }
          caseInfo.value = CaseInfo.fromJson(updatedCase)
        }

        // refresh CADA prio store after loading case
        await refreshCadaPrioStore()

        storeState.value = StoreState.Active
      } catch (e) {
        storeState.value = StoreState.Error
      }
    }
  }

  /** Delete the case in the server or local storage. */
  const deleteCase = async () => {
    if (storageMode.value === StorageMode.Local) {
      storeState.value = StoreState.Loading
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}.caseInfo`)
      clearData()
      storeState.value = StoreState.Active
    } else {
      storeState.value = StoreState.Loading
      try {
        const client = new CaseInfoClient()
        const result = await client.deleteCaseInfo()
        if (isFailureInfo(result) && result.message === 'Unauthorized') {
          storeState.value = StoreState.Error
          return
        }
        clearData()

        // refresh CADA prio store after clearing the case
        await refreshCadaPrioStore()

        storeState.value = StoreState.Active
      } catch (e) {
        storeState.value = StoreState.Error
      }
    }
  }

  return {
    storageMode,
    storeState,
    caseInfo,
    initialize,
    clearData,
    updateCase,
    deleteCase
  }
})
