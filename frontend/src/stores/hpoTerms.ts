/**
 * Store for HPO terms.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { VigunoClient } from '@/api/viguno'
import { type OntologyTerm } from '@/stores/case'
import { StoreState } from '@/stores/misc'

export const useHpoTermsStore = defineStore('hpoTerms', () => {
  /** The current state of the store. */
  const storeState = ref<StoreState>(StoreState.Initial)
  /** The current HpoTerms. */
  const hpoTerms = ref<OntologyTerm[]>([])

  function clearData() {
    hpoTerms.value = []
  }

  /**
   * Fetches the HPO terms.
   */
  const fetchHpoTerms = async (query: string) => {
    storeState.value = StoreState.Loading
    const vigunoClient = new VigunoClient()
    const response = await vigunoClient.resolveHpoTermByName(query)
    hpoTerms.value = response.result.map((item: any) => {
      return item as OntologyTerm
    })
    storeState.value = StoreState.Active
  }

  return {
    storeState,
    hpoTerms,
    clearData,
    fetchHpoTerms
  }
})
