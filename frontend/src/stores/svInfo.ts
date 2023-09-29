/**
 * Store for variant details.
 *
 * This includes the data retrieved from the APIs.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { AnnonarsClient } from '@/api/annonars'
import { infoFromSvQuery } from '@/lib/utils'
import { StoreState } from '@/stores/misc'

/** `SvRecord` is a type alias for easier future interface definition. */
export type SvRecord = any | null
/** `GeneInfo` is a type alias for easier future interface definition. */
type GeneInfo = any | null

export const useSvInfoStore = defineStore('svInfo', () => {
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The search query for the SV. */
  const svTerm = ref<string | null>(null)

  /** The current SV record. */
  const currentSvRecord = ref<SvRecord>(null)

  /** Infos on the variants of the record. */
  const genesInfos = ref<GeneInfo[]>([])

  function clearData() {
    storeState.value = StoreState.Initial
    svTerm.value = null
    currentSvRecord.value = null
    genesInfos.value = []
  }

  const loadData = async (variantQuery: string, genomeRelease: string) => {
    // Prevent fetching twice.
    if (variantQuery === svTerm.value) {
      return
    }

    // Clear old store contents
    clearData()

    // Load data via API
    storeState.value = StoreState.Loading
    try {
      const { sv_type, chromosome, start, end } = infoFromSvQuery(variantQuery)
      // Fetch new details
      const annonarsClient = new AnnonarsClient()
      const hgncIds = []
      hgncIds.push('HGNC:1100')
      hgncIds.push('HGNC:1101')
      hgncIds.push('HGNC:1102')
      // for (const txEffect of svRecord.payload.tx_effects) {
      //   if (txEffect.gene.hgnc_id) {
      //     hgncIds.push(txEffect.gene.hgnc_id)
      //   }
      // }
      if (hgncIds.length) {
        genesInfos.value = await annonarsClient.fetchGeneInfos(hgncIds)
      }

      currentSvRecord.value = {
        sv_type: sv_type,
        chromosome: chromosome,
        start: start,
        end: end,
        release: genomeRelease
      }
      storeState.value = StoreState.Active
      svTerm.value = variantQuery
    } catch (e) {
      console.error('There was an error loading the SV data.', e)
      storeState.value = StoreState.Error
    }
  }

  return {
    storeState,
    svTerm,
    currentSvRecord,
    genesInfos,
    clearData,
    loadData
  }
})
