/**
 * Store for variant details.
 *
 * This includes the data retrieved from the APIs.
 */
import equal from 'fast-deep-equal'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { AnnonarsClient } from '@/api/annonars'
import { MehariClient } from '@/api/mehari'
import { type Strucvar } from '@/lib/genomicVars'
import { StoreState } from '@/stores/misc'

/** `ClinvarSvRecord` is a type alias for easier future interface definition. */
export type ClinvarSvRecord = any | null
/** `GeneInfo` is a type alias for easier future interface definition. */
export type GeneInfo = any | null
/** `Consequence` is a type alias for future interface definition. */
export type Consequence = any | null

export const useSvInfoStore = defineStore('strucvarInfo', () => {
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The current SV record. */
  const strucvar = ref<Strucvar | undefined>(undefined)

  /** The consequences of the `currentStrucvar` */
  const csq = ref<Consequence[] | undefined>(undefined)

  /** Infos on the variants of the record. */
  const genesInfos = ref<GeneInfo[] | undefined>(undefined)

  /** The ClinVar SV records. */
  const clinvarSvRecords = ref<ClinvarSvRecord[] | undefined>(undefined)

  function clearData() {
    storeState.value = StoreState.Initial
    csq.value = undefined
    strucvar.value = undefined
    genesInfos.value = undefined
  }

  /**
   * Load data from the server.
   *
   * @param strucvar$ The structural variant to use for the query.
   * @param forceReload Whether to force-reload in case the variant is the same.
   */
  const loadData = async (strucvar$: Strucvar, forceReload: boolean = false) => {
    // Protect against loading multiple times.
    if (
      !forceReload &&
      storeState.value !== StoreState.Initial &&
      equal(strucvar$, strucvar.value)
    ) {
      return
    }

    // Clear old store contents
    clearData()

    // Load data via API
    storeState.value = StoreState.Loading
    const { svType, genomeBuild, chrom, start, stop } = strucvar$
    const annonarsClient = new AnnonarsClient()
    const mehariClient = new MehariClient()
    try {
      // Fetch SV record
      const mehariResult = await mehariClient.retrieveStrucvarsCsq(
        genomeBuild,
        chrom,
        start,
        stop,
        svType
      )
      // Fetch ClinVar SV records
      const { records: responseRecords } = await annonarsClient.fetchClinvarStrucvars(
        genomeBuild,
        chrom,
        start,
        stop
      )
      clinvarSvRecords.value = responseRecords ?? []

      // Fetch gene infos
      const hgncIds = []
      for (const txEffect of mehariResult.result) {
        if (txEffect.hgnc_id) {
          hgncIds.push(txEffect.hgnc_id)
        }
      }
      if (hgncIds.length) {
        genesInfos.value = await annonarsClient.fetchGeneInfos(hgncIds)
      } else {
        genesInfos.value = []
      }

      // Sort by gene symbol
      genesInfos.value.sort((a, b) => (a?.hgnc?.agr ?? 'ZZZ').localeCompare(b?.hgnc?.agr ?? 'ZZZ'))

      csq.value = mehariResult.result
      strucvar.value = strucvar$
      storeState.value = StoreState.Active
    } catch (e) {
      console.error('There was an error loading the SV data.', e)
      storeState.value = StoreState.Error
    }
  }

  return {
    storeState,
    strucvar,
    csq,
    genesInfos,
    clinvarSvRecords,
    clearData,
    loadData
  }
})
