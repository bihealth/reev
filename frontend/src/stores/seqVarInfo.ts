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
import { type Seqvar } from '@/lib/genomicVars'
import { StoreState } from '@/stores/misc'

export const useSeqVarInfoStore = defineStore('seqVarInfo', () => {
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The Seqvar that the previous record has been retrieved for. */
  const seqvar = ref<Seqvar | undefined>(undefined)

  /** Variant-related information from annonars. */
  const varAnnos = ref<any | null>(null)

  /** ClinVar gene-related information from annoars. */
  const geneClinvar = ref<any | null>(null)

  /** Information about related gene. */
  const geneInfo = ref<any | null>(null)

  /** Transcript consequence information from mehari. */
  const txCsq = ref<any | null>(null)

  /** Promise for initialization of the store. */
  const loadDataRes = ref<Promise<any> | null>(null)

  /** Clear all data in the store. */
  const clearData = () => {
    storeState.value = StoreState.Initial
    seqvar.value = undefined
    varAnnos.value = null
    txCsq.value = null
    geneInfo.value = null
    geneClinvar.value = null
  }

  /**
   * Load data from the server.
   *
   * @param seqvar$ The sequence variant to use for the query.
   * @param forceReload Whether to force-reload in case the variant is the same.
   * @returns
   */
  const loadData = async (seqvar$: Seqvar, forceReload: boolean = false) => {
    // Protect against loading multiple times.
    if (!forceReload && storeState.value !== StoreState.Initial && equal(seqvar$, seqvar.value)) {
      return loadDataRes.value
    }

    // Clear against artifact
    clearData()

    // Load data via API
    storeState.value = StoreState.Loading
    const annonarsClient = new AnnonarsClient()
    const mehariClient = new MehariClient()
    let hgncId = ''

    const { genomeBuild, chrom, pos, del, ins } = seqvar$

    // Retrieve variant information from annonars and mehari.
    loadDataRes.value = Promise.all([
      annonarsClient.fetchVariantInfo(genomeBuild, chrom, pos, del, ins).then((data) => {
        varAnnos.value = data.result
      }),
      mehariClient.retrieveSeqvarsCsq(genomeBuild, chrom, pos, del, ins).then((data) => {
        txCsq.value = data.result ?? []
      })
    ])
      .then((): Promise<any> => {
        if (txCsq.value.length !== 0) {
          hgncId = txCsq.value[0].gene_id
          return Promise.all([
            annonarsClient.fetchGeneInfo(hgncId).then((data) => {
              geneInfo.value = data.genes[hgncId]
            }),
            annonarsClient.fetchGeneClinvarInfo(hgncId).then((data) => {
              geneClinvar.value = data.genes[hgncId]
            })
          ])
        } else {
          return Promise.resolve()
        }
      })
      .then(() => {
        seqvar.value = seqvar$
        storeState.value = StoreState.Active
      })
      .catch((err) => {
        console.error('There was an error loading the variant data.', err)
        clearData()
        storeState.value = StoreState.Error
      })

    return loadDataRes.value
  }

  return {
    loadDataRes,
    storeState,
    seqvar,
    varAnnos,
    geneClinvar,
    geneInfo,
    txCsq,
    loadData,
    clearData
  }
})
