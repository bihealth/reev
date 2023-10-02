/**
 * Store for variant details.
 *
 * This includes the data retrieved from the APIs.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { AnnonarsClient } from '@/api/annonars'
import { MehariClient } from '@/api/mehari'
import { infoFromQuery } from '@/lib/utils'
import { StoreState } from '@/stores/misc'

/** Alias definition of SmallVariant type. */
export type SmallVariant = {
  release: string
  chromosome: string
  start: string
  end: string
  reference: string
  alternative: string
  hgnc_id?: string
}

export const useVariantInfoStore = defineStore('variantInfo', () => {
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The search query of the variant. */
  const variantTerm = ref<string | null>(null)

  /** The small variant that the previous record has been retrieved for. */
  const smallVariant = ref<SmallVariant | null>(null)

  /** Variant-related information from annonars. */
  const varAnnos = ref<any | null>(null)

  /** ClinVar gene-related information from annoars. */
  const geneClinvar = ref<any | null>(null)

  /** Information about related gene. */
  const geneInfo = ref<any | null>(null)

  /** Transcript consequence information from mehari. */
  const txCsq = ref<any | null>(null)

  function clearData() {
    storeState.value = StoreState.Initial
    variantTerm.value = null
    smallVariant.value = null
    varAnnos.value = null
    txCsq.value = null
    geneInfo.value = null
    geneClinvar.value = null
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
      if (
        variantData.result.cadd === null &&
        variantData.result.dbnsfp === null &&
        variantData.result.dbscsnv === null
      ) {
        throw new Error('No variant data found.')
      } else {
        varAnnos.value = variantData.result
      }

      const txCsqData = await mehariClient.retrieveTxCsq(
        genomeRelease,
        chromosome,
        pos,
        reference,
        alternative
      )
      if (txCsqData.result.length === 0) {
        throw new Error('No transcript consequence data found.')
      } else {
        txCsq.value = txCsqData.result
      }

      const hgncId: string = txCsqData.result[0]['gene_id']
      const geneData = await annonarsClient.fetchGeneInfo(hgncId)
      if (geneData?.genes === null) {
        throw new Error('No gene data found.')
      }
      geneInfo.value = geneData['genes'][hgncId]

      const geneClinvarData = await annonarsClient.fetchGeneClinvarInfo(hgncId)
      if (geneClinvarData?.result === null) {
        throw new Error('No gene clinvar data found.')
      }
      geneClinvar.value = geneClinvarData['genes'][hgncId]

      variantTerm.value = variantQuery
      smallVariant.value = {
        release: genomeRelease,
        chromosome: chromosome,
        start: pos,
        end: (Number(pos) + reference.length - 1).toString(),
        reference: reference,
        alternative: alternative,
        hgnc_id: hgncId
      }
      storeState.value = StoreState.Active
    } catch (e) {
      console.error('There was an error loading the variant data.', e)
      clearData()
      storeState.value = StoreState.Error
    }
  }

  return {
    storeState,
    variantTerm,
    smallVariant,
    varAnnos,
    geneClinvar,
    geneInfo,
    txCsq,
    loadData,
    clearData
  }
})
