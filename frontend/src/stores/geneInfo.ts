/**
 * Store for gene details.
 *
 * This includes the data retrieved from the APIs.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { AnnonarsClient } from '@/api/annonars'
import { DottyClient } from '@/api/dotty'
import { StoreState } from '@/stores/misc'

const TEMP_DATA = {
  transcripts: [
    {
      transcript_id: 'NM_007294',
      transcript_version: '3',
      gene_id: 'HGNC:1100',
      gene_name: 'BRCA1',
      contig: 'NC_000017.10',
      cds_start: 41197694,
      cds_end: 41276113,
      exons: [
        { start: 41196311, end: 41197819 },
        { start: 41199659, end: 41199720 },
        { start: 41201137, end: 41201211 },
        { start: 41203079, end: 41203134 },
        { start: 41209068, end: 41209152 },
        { start: 41215349, end: 41215390 },
        { start: 41215890, end: 41215968 },
        { start: 41219624, end: 41219712 },
        { start: 41222944, end: 41223255 },
        { start: 41226347, end: 41226538 },
        { start: 41228504, end: 41228631 },
        { start: 41234420, end: 41234592 },
        { start: 41242960, end: 41243049 },
        { start: 41243451, end: 41246877 },
        { start: 41247862, end: 41247939 },
        { start: 41249260, end: 41249306 },
        { start: 41251791, end: 41251897 },
        { start: 41256138, end: 41256278 },
        { start: 41256884, end: 41256973 },
        { start: 41258472, end: 41258550 },
        { start: 41267742, end: 41267796 },
        { start: 41276033, end: 41276132 },
        { start: 41277287, end: 41277500 }
      ]
    }
  ]
}
export const useGeneInfoStore = defineStore('geneInfo', () => {
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The current gene query. */
  const geneSymbol = ref<string | null>(null)

  /** The retrieved gene data. */
  const geneInfo = ref<any | null>(null)

  /** ClinVar gene-related information from annoars. */
  const geneClinvar = ref<any | null>(null)

  /** Transcript information from dotty. */
  const transcripts = ref<any | null>(null)

  function clearData() {
    storeState.value = StoreState.Initial
    geneSymbol.value = null
    geneInfo.value = null
    geneClinvar.value = null
    transcripts.value = null
  }

  const loadData = async (geneSymbolQuery: string) => {
    // Do not re-load data if the gene symbol is the same
    if (geneSymbolQuery === geneSymbol.value) {
      return
    }

    // Clear against artifact
    clearData()

    // Load data via API
    storeState.value = StoreState.Loading
    try {
      const hgncId = geneSymbolQuery
      const client = new AnnonarsClient()
      const data = await client.fetchGeneInfo(hgncId)
      if (data?.genes === null) {
        throw new Error('No gene data found.')
      }
      geneInfo.value = data['genes'][hgncId]

      const geneClinvarData = await client.fetchGeneClinvarInfo(hgncId)
      if (geneClinvarData?.genes === null) {
        throw new Error('No gene clinvar data found.')
      }
      geneClinvar.value = geneClinvarData['genes'][hgncId]

      // const dottyClient = new DottyClient()
      // const transcriptsData = await dottyClient.fetchTranscripts(data['genes'][hgncId]['hgnc']['refseq_accession'])

      // transcripts.value = transcriptsData.json()
      // TEMP:
      transcripts.value = JSON.parse(JSON.stringify(TEMP_DATA))

      geneSymbol.value = geneSymbolQuery
      storeState.value = StoreState.Active
    } catch (e) {
      console.error('There was an error loading the gene data.', e)
      clearData()
      storeState.value = StoreState.Error
    }
  }

  return {
    storeState,
    geneSymbol,
    geneInfo,
    geneClinvar,
    transcripts,
    loadData,
    clearData
  }
})
