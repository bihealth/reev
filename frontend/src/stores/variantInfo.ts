/** Store for variant details.
 *
 * This includes the data retrieved from the APIs.
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

import { AnnonarsClient } from '@/api/annonars'
import { MehariClient } from '@/api/mehari'
import { infoFromQuery } from '@/api/utils'

export enum StoreState {
  Initial = 'initial',
  Loading = 'loading',
  Active = 'active',
  Error = 'error'
}

export const useVariantInfoStore = defineStore('variantInfo', () => {
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The search query of the variant. */
  const variantTerm = ref<string | null>(null)

  /** The small variant that the previous record has been retrieved for. */
  const smallVariant = ref<any | null>(null)

  /** Variant-related information from annonars. */
  const varAnnos = ref<any | null>(null)

  /** Information about related gene. */
  const geneInfo = ref<any | null>(null)

  /** Transcript consequence information from mehari. */
  const txCsq = ref<any | null>(null)

  function clearData() {
    storeState.value = StoreState.Initial
    variantTerm.value = null
    varAnnos.value = null
    txCsq.value = null
    geneInfo.value = null
  }

  const loadData = async (variantQuery: string, genomeRelease: string) => {
    // Do not re-load data if the variant symbol is the same
    if (variantQuery === variantTerm.value) {
      return
    }

    // Clear against artifact
    clearData()

    // Load data via API
    storeState.value = StoreState.Loading
    try {
      const { chromosome, pos, reference, alternative } = infoFromQuery(variantQuery)

      const annonarsClient = new AnnonarsClient()
      const mehariClient = new MehariClient()

      const variantData = await annonarsClient.fetchVariantInfo(
        genomeRelease,
        chromosome,
        pos,
        reference,
        alternative
      )
      varAnnos.value = variantData.result
      smallVariant.value = variantData.query

      const txCsqData = await mehariClient.retrieveTxCsq(
        genomeRelease,
        chromosome,
        pos,
        reference,
        alternative
      )
      txCsq.value = txCsqData.result
      
      console.log(txCsqData)
      const hgncId = txCsqData.result[0]['gene-id']
      console.log(hgncId)
      const geneData = await annonarsClient.fetchGeneInfo(hgncId)
      geneInfo.value = geneData['genes'][hgncId]

      variantTerm.value = variantQuery
      storeState.value = StoreState.Active
    } catch (e) {
      console.error('There was an error loading the variant data.', e)
      storeState.value = StoreState.Error
    }
  }

  return {
    storeState,
    variantTerm,
    smallVariant,
    varAnnos,
    geneInfo,
    txCsq,
    loadData,
    clearData
  }
})
