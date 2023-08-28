/** Store for gene details.
 *
 * This includes the data retrieved from the APIs.
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

import { AnnonarsClient } from '@/api/annonars'

export enum StoreState {
  Initial = 'initial',
  Loading = 'loading',
  Active = 'active',
  Error = 'error'
}

export const useGeneInfoStore = defineStore('geneInfo', () => {
  // The current store state
  const storeState = ref<StoreState>(StoreState.Initial)

  // The current gene query
  const geneSymbol = ref<string | null>(null)

  // The retrieved gene data
  const geneInfo = ref<any | null>(null)

  // Load stored geneInfo from localStorage when the store initializes
  if (localStorage.getItem('geneInfo')) {
    geneInfo.value = JSON.parse(localStorage.getItem('geneInfo')!)
  }

  function clearData() {
    storeState.value = StoreState.Initial
    geneSymbol.value = null
    geneInfo.value = null
  }

  const loadData = async (geneSymbolQuery: string) => {
    // Do not re-load data if the gene symbol is the same
    if (geneSymbolQuery === geneSymbol.value) {
      return
    }

    // Clear against artifact
    clearData()

    // Load data via API
    storeState.value = StoreState.Loading
    try {
      const hgncId = geneSymbolQuery
      const client = new AnnonarsClient()
      const data = await client.fetchGeneInfo(hgncId)
      geneInfo.value = data['genes'][hgncId]

      geneSymbol.value = geneSymbolQuery
      storeState.value = StoreState.Active
    } catch (e) {
      console.error('There was an error loading the gene data.', e)
      storeState.value = StoreState.Error
    }
  }

  return {
    storeState,
    geneSymbol,
    geneInfo,
    loadData,
    clearData
  }
})
