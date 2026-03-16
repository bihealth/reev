/**
 * Store for HPO terms.
 */
import { HpoOmim, HpoTerm, VigunoClient } from '@bihealth/reev-frontend-lib/api/viguno'
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTermsStore = defineStore('terms', () => {
  /** The current state of the store. */
  const storeState = ref<StoreState>(StoreState.Initial)
  /** The current HPO terms. */
  const hpoTerms = ref<HpoTerm[]>([])
  /** The current Omim terms */
  const omimTerms = ref<HpoOmim[]>([])

  function clearData() {
    hpoTerms.value = []
  }

  /**
   * Fetches the HPO terms.
   */
  const fetchHpoTerms = async (query: string) => {
    storeState.value = StoreState.Loading
    const vigunoClient = new VigunoClient('/internal/proxy/viguno/api/v1')

    // Regular expression to match "HPO:1234567" or "1234567"
    const hpoIdPattern = /^(HP:)?\d{7}$/

    try {
      // Check if query matches the pattern for HPO ID
      if (hpoIdPattern.test(query)) {
        const response = await vigunoClient.resolveHpoTermById(query)
        hpoTerms.value = response.result as HpoTerm[]
      } else {
        const response = await vigunoClient.queryHpoTermsByName(query)
        hpoTerms.value = response.result.map((item: any) => item as HpoTerm)
      }
      storeState.value = StoreState.Active
    } catch (error) {
      // Handle error (you might want to set the store state to an error state)
      console.error('Error fetching HPO terms:', error)
      storeState.value = StoreState.Error
      // Optionally reset hpoTerms or handle it appropriately
      hpoTerms.value = []
    }
  }

  /**
   * Fetches the OMIM terms.
   */
  const fetchOmimTerms = async (query: string) => {
    storeState.value = StoreState.Loading
    const vigunoClient = new VigunoClient('/internal/proxy/viguno/api/v1')

    // Regular expression to match "OMIM:1234567" or "1234567"
    const omimIdPattern = /^(OMIM:)?\d{6}$/

    try {
      // Check if query matches the pattern for OMIM ID
      if (omimIdPattern.test(query)) {
        // Extract only the digits part if "OMIM:" is present
        const omimId = query.replace(/^OMIM:/, '')
        const response = await vigunoClient.resolveOmimTermById(omimId)
        omimTerms.value = response.result
      } else {
        const response = await vigunoClient.queryOmimTermsByName(query)
        omimTerms.value = response.result
      }
      storeState.value = StoreState.Active
    } catch (error) {
      // Handle error (you might want to set the store state to an error state)
      console.error('Error fetching OMIM terms:', error)
      storeState.value = StoreState.Error
      // Optionally reset hpoTerms or handle it appropriately
      hpoTerms.value = []
    }
  }

  return {
    storeState,
    hpoTerms,
    omimTerms,
    clearData,
    fetchHpoTerms,
    fetchOmimTerms
  }
})
