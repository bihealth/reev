/**
 * Store for gene details.
 *
 * This includes the data retrieved from the APIs.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { AnnonarsClient } from '@/api/annonars'
import { DottyClient } from '@/api/dotty'
import { type HpoTerm, VigunoClient } from '@/api/viguno'
import { StoreState } from '@/stores/misc'

export const usegeneInfoStore = defineStore('geneInfo', () => {
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The current gene query. */
  const hgncId = ref<string | null>(null)

  /** The retrieved gene data. */
  const geneInfo = ref<any | null>(null)

  /** The HPO terms retrieved from viguno. */
  const hpoTerms = ref<HpoTerm[]>([])

  /** ClinVar gene-related information from annoars. */
  const geneClinvar = ref<any | null>(null)

  /** Transcript information from dotty. */
  const transcripts = ref<any | null>(null)

  function clearData() {
    storeState.value = StoreState.Initial
    hgncId.value = null
    geneInfo.value = null
    geneClinvar.value = null
    transcripts.value = null
  }

  const loadData = async (hgncIdQuery: string, genomeRelease: string) => {
    // Do not re-load data if the gene symbol is the same
    if (hgncIdQuery === hgncId.value) {
      return
    }

    // Clear against artifact
    clearData()

    // Load data via API
    storeState.value = StoreState.Loading
    try {
      const annonarsClient = new AnnonarsClient()
      const data = await annonarsClient.fetchGeneInfo(hgncIdQuery)
      if (data?.genes === null) {
        throw new Error('No gene data found.')
      }
      geneInfo.value = data['genes'][hgncIdQuery]

      const geneClinvarData = await annonarsClient.fetchGeneClinvarInfo(hgncIdQuery)
      if (geneClinvarData?.genes === null) {
        throw new Error('No gene clinvar data found.')
      }
      geneClinvar.value = geneClinvarData['genes'][hgncIdQuery]

      const dottyClient = new DottyClient()
      const transcriptsData = await dottyClient.fetchTranscripts(
        hgncIdQuery,
        genomeRelease === 'grch37' ? 'GRCh37' : 'GRCh38'
      )
      transcripts.value = transcriptsData

      const vigunoClient = new VigunoClient()
      const hpoTermsData = await vigunoClient.fetchHpoTermsForHgncId(hgncIdQuery)
      if (hpoTermsData === null) {
        throw new Error('Problem querying HPO terms data.')
      }
      hpoTerms.value = hpoTermsData

      hgncId.value = hgncIdQuery
      storeState.value = StoreState.Active
    } catch (e) {
      console.error('There was an error loading the gene data.', e)
      clearData()
      storeState.value = StoreState.Error
    }
  }

  return {
    storeState,
    hgncId,
    geneInfo,
    geneClinvar,
    hpoTerms,
    transcripts,
    loadData,
    clearData
  }
})
