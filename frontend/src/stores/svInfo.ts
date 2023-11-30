/**
 * Store for variant details.
 *
 * This includes the data retrieved from the APIs.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { AnnonarsClient } from '@/api/annonars'
import { MehariClient } from '@/api/mehari'
import { infoFromSvQuery } from '@/lib/utils'
import { StoreState } from '@/stores/misc'

/** `SvRecord` is a type alias for easier future interface definition. */
export type SvRecord = any | null
/** `ClinvarSvRecord` is a type alias for easier future interface definition. */
export type ClinvarSvRecord = any | null
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

  /** The ClinVar SV records. */
  const clinvarSvRecords = ref<ClinvarSvRecord[]>([])

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
      const { svType, chromosome, start, end } = infoFromSvQuery(variantQuery)
      const annonarsClient = new AnnonarsClient()
      const mehariClient = new MehariClient()

      // Fetch SV record
      const svRecord = await mehariClient.retrieveStrucvarsCsq(
        genomeRelease,
        chromosome,
        start,
        end,
        svType
      )
      currentSvRecord.value = {
        svType: svType,
        chromosome: chromosome,
        start: start,
        end: end,
        release: genomeRelease,
        result: svRecord.result
      }
      // Fetch ClinVar SV records
      const { records: responseRecords } = await annonarsClient.fetchClinvarStrucvars(
        genomeRelease,
        chromosome,
        start,
        end
      )
      clinvarSvRecords.value = responseRecords ?? []

      // Fetch gene infos
      const hgncIds = []
      for (const txEffect of svRecord.result) {
        if (txEffect.hgnc_id) {
          hgncIds.push(txEffect.hgnc_id)
        }
      }
      if (hgncIds.length) {
        genesInfos.value = await annonarsClient.fetchGeneInfos(hgncIds)
      }

      // Sort by gene symbol
      genesInfos.value.sort((a, b) => (a?.hgnc?.agr ?? 'ZZZ').localeCompare(b?.hgnc?.agr ?? 'ZZZ'))

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
    clinvarSvRecords,
    clearData,
    loadData
  }
})
