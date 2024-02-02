/**
 * Store for misc info such as the current version.
 */
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { MiscClient } from '@/api/misc'

export const useMiscStore = defineStore('misc', () => {
  /* The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /* The app version. */
  const appVersion = ref<string | null>(null)

  // Initialize store, load version info.
  const initialize = async () => {
    storeState.value = StoreState.Loading
    try {
      const client = new MiscClient()
      appVersion.value = await client.fetchVersion()

      storeState.value = StoreState.Active
    } catch (e) {
      console.error('There was an error loading the app version.', e)
      storeState.value = StoreState.Error
    }
  }

  return {
    storeState,
    appVersion,
    initialize
  }
})
