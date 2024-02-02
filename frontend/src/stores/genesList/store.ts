/**
 * Store for gene details.
 *
 * This includes the data retrieved from the APIs.
 */
import { AnnonarsClient, ScoreGeneNames } from '@bihealth/reev-frontend-lib/api/annonars'
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGenesListStore = defineStore('genesList', () => {
  /* The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /* The current search query. */
  const query = ref<string | undefined>(undefined)

  /* The retrieved data for search query. */
  const genesList = ref<ScoreGeneNames[] | undefined>(undefined)

  /* The redirect HGNC ID. Is used only if storeState is "Redirect".*/
  const redirectHgncId = ref<string | undefined>(undefined)

  function clearData() {
    storeState.value = StoreState.Initial
    query.value = undefined
    genesList.value = undefined
  }

  const checkResultsMatch = async () => {
    if (query.value === undefined || genesList.value === undefined) {
      return undefined
    }
    const queryArray = query.value.split('&')
    const searchTerm = queryArray[0].split('=')[1]
    for (const gene of genesList.value) {
      if (gene.data.hgncId === searchTerm) {
        return gene.data.hgncId
      }
      if (gene.data.symbol === searchTerm) {
        return gene.data.hgncId
      }
      if (gene.data.ensemblGeneId === searchTerm) {
        return gene.data.hgncId
      }
      if (gene.data.ncbiGeneId === searchTerm) {
        return gene.data.hgncId
      }
    }
    return undefined
  }

  const loadData = async (geneSymbolQuery: object) => {
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
      const response = await client.fetchGenes(geneQuery)
      if (response.genes.length === 0) {
        throw new Error('No data returned from API.')
      }
      genesList.value = response.genes

      query.value = geneQuery
      const hgncId = await checkResultsMatch()
      if (hgncId !== undefined) {
        storeState.value = StoreState.Redirect
        redirectHgncId.value = hgncId
      } else {
        storeState.value = StoreState.Active
      }
    } catch (e) {
      console.error('There was an error while searching for genes.', e)
      clearData()
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
