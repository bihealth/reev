/** Store for gene details.
 *
 * This includes the data retrieved from the APIs.
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

import { StoreState } from '@/stores/misc'
import { AnnonarsClient } from '@/api/annonars'

export const useGenesListStore = defineStore('genesList', () => {
  // The current store state
  const storeState = ref<StoreState>(StoreState.Initial)

  // The current gene query
  const query = ref<string | null>(null)

  // The retrieved gene data
  const genesList = ref<any | null>(null)

  function clearData() {
    storeState.value = StoreState.Initial
    query.value = null
    genesList.value = null
  }

  const loadData = async (geneSymbolQuery: Object) => {
    // Form string from object
    const geneQuery: string = Object.entries(geneSymbolQuery)
      .map(([key, val]) => `${key}=${val}`)
      .join('&')
    // Do not re-load data if the gene symbol is the same
    if (geneQuery === query.value) {
      return
    }

    // Clear against artifact
    clearData()

    // Load data via API
    storeState.value = StoreState.Loading
    try {
      const client = new AnnonarsClient()
      const data = await client.fetchGenes(geneQuery)
      genesList.value = data['genes']

      query.value = geneQuery
      storeState.value = StoreState.Active
    } catch (e) {
      console.error('There was an error while searching for genes.', e)
      storeState.value = StoreState.Error
    }
  }

  return {
    storeState,
    query,
    genesList,
    loadData,
    clearData
  }
})
