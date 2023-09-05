/** Store for gene details.
 *
 * This includes the data retrieved from the APIs.
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

import { StoreState } from '@/stores/misc'
import { AnnonarsClient } from '@/api/annonars'

export const useGenesListStore = defineStore('genesList', () => {
  /* The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /* The current search query. */
  const query = ref<string | null>(null)

  /* The retrieved data for search query. */
  const genesList = ref<any | null>(null)

  /* The redirect HGNC ID. Is used only if storeState is "Redirect".*/
  const redirectHgncId = ref<string | null>(null)

  function clearData() {
    storeState.value = StoreState.Initial
    query.value = null
    genesList.value = null
  }

  const checkResultsMatch = async () => {
    if (query.value === null) {
      return null
    }
    const queryArray = query.value.split('&')
    const searchTerm = queryArray[0].split('=')[1]

    for (const gene of genesList.value) {
      if (gene.data.hgnc_id === searchTerm) {
        return gene.data.hgnc_id
      }
      if (gene.data.symbol === searchTerm) {
        return gene.data.hgnc_id
      }
      if (gene.data.ensembl_gene_id === searchTerm) {
        return gene.data.hgnc_id
      }
      if (gene.data.ncbi_gene_id === searchTerm) {
        return gene.data.hgnc_id
      }
    }
    return null
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
      if (data.genes.length === 0) {
        throw new Error('No data returned from API.')
      }
      genesList.value = data['genes']

      query.value = geneQuery
      const hgncId = await checkResultsMatch()
      if (hgncId !== null) {
        storeState.value = StoreState.Redirect
        redirectHgncId.value = hgncId
      } else {
        storeState.value = StoreState.Active
      }
    } catch (e) {
      console.error('There was an error while searching for genes.', e)
      storeState.value = StoreState.Error
    }
  }

  return {
    storeState,
    query,
    genesList,
    redirectHgncId,
    loadData,
    clearData
  }
})
