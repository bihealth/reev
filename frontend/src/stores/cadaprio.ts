/**
 * Store for genes ranking from cada-prio.
 *
 * This includes the data retrieved from the APIs.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { CadaPrioClient } from '@/api/cadaprio'
import { StoreState } from '@/stores/misc'

export interface GeneRank {
  rank: number
  score: number
  gene_symbol: string
  ncbi_gene_id: number
  hgnc_id: string
}

export const useCadaPrioStore = defineStore('cadaPrio', () => {
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The current gene Ranking. */
  const geneRanking = ref<GeneRank[] | null>(null)

  function clearData() {
    storeState.value = StoreState.Initial
    geneRanking.value = null
  }

  const loadData = async (hpoTerms: string[], geneSymbols?: string[]) => {
    // Clear against artifact
    clearData()

    // Load data via API
    storeState.value = StoreState.Loading
    try {
      const client = new CadaPrioClient()
      const data = await client.predictGeneImpact(hpoTerms, geneSymbols)
      if (data.lenght === 0) {
        geneRanking.value = null
      } else {
        geneRanking.value = data
      }
      storeState.value = StoreState.Active
    } catch (error) {
      console.error(error)
      storeState.value = StoreState.Error
    }
  }

  return {
    storeState,
    geneRanking,
    loadData
  }
})
