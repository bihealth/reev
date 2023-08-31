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
  // The current store state
  const storeState = ref<StoreState>(StoreState.Initial)

  // The current variant query
  const smallVariant = ref<string | null>(null)

  // The retrieved variant data
  const variantInfo = ref<any | null>(null)

  // The retrieved tx csq data
  const txCsq = ref<any | null>(null)

  function clearData() {
    storeState.value = StoreState.Initial
    smallVariant.value = null
    variantInfo.value = null
  }

  const loadData = async (variantQuery: string, genomeRelease: string) => {
    // Do not re-load data if the variant symbol is the same
    if (variantQuery === smallVariant.value) {
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
      variantInfo.value = variantData

      const txCsqData = await mehariClient.retrieveTxCsq(
        genomeRelease,
        chromosome,
        pos,
        reference,
        alternative
      )
      txCsq.value = txCsqData

      smallVariant.value = variantQuery
      storeState.value = StoreState.Active
    } catch (e) {
      console.error('There was an error loading the variant data.', e)
      storeState.value = StoreState.Error
    }
  }

  return {
    storeState,
    smallVariant,
    variantInfo,
    loadData,
    clearData
  }
})
