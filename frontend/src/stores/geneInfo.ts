/**
 * Store for gene details.
 *
 * This includes the data retrieved from the APIs.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { AnnonarsClient } from '@/api/annonars'
import { StoreState } from '@/stores/misc'

export const useGeneInfoStore = defineStore('geneInfo', () => {
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The current gene query. */
  const geneSymbol = ref<string | null>(null)

  /** The retrieved gene data. */
  const geneInfo = ref<any | null>(null)

  /** ClinVar gene-related information from annoars. */
  const geneClinvar = ref<any | null>(null)

  function clearData() {
    storeState.value = StoreState.Initial
    geneSymbol.value = null
    geneInfo.value = null
    geneClinvar.value = null
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
      if (data?.genes === null) {
        throw new Error('No gene data found.')
      }
      geneInfo.value = data['genes'][hgncId]

      const geneClinvarData = await client.fetchGeneClinvarInfo(hgncId)
      if (geneClinvarData?.genes === null) {
        throw new Error('No gene clinvar data found.')
      }
      geneClinvar.value = geneClinvarData['genes'][hgncId]

      geneSymbol.value = geneSymbolQuery
      storeState.value = StoreState.Active
    } catch (e) {
      console.error('There was an error loading the gene data.', e)
      clearData()
      storeState.value = StoreState.Error
    }
  }

  return {
    storeState,
    geneSymbol,
    geneInfo,
    geneClinvar,
    loadData,
    clearData
  }
})
