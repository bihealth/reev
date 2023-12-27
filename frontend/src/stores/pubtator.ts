/**
 * Store wrapping the PubTator access.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { StoreState } from '@/stores/misc'

/** Interface for search result entry plus PubMed abstract. */
export interface SearchResult {
  /** The search result record. */
  searchResult: any
  /** The PubMed abstract. */
  abstract: any
}

/** Enumeration for annotation types */
export enum AnnotationType {
  /** Disease */
  Disease = 'Disease',
  /** Gene */
  Gene = 'Gene',
  /** Chemical */
  Chemical = 'Chemical',
  /** Species */
  Species = 'Species',
  /** Variant */
  Variant = 'Variant',
  /** CellLine */
  CellLine = 'CellLine'
}

/** Location of an annotation. */
export interface AnnotationLocation {
  /** The offset of the annotation. */
  offset: number
  /** The length of the annotation. */
  length: number
}

/** One annotation record. */
export interface Annotation {
  /** The type of annotation. */
  type: AnnotationType
  /** The name of the annotation. */
  name?: string
  /** The text of the annotation. */
  text?: string
  /** Locations of the annotation */
  locations: AnnotationLocation[]
}

export const usePubtatorStore = defineStore('pubtator', () => {
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The HGNC symbol currently loaded for. */
  const hgncSymbol = ref<string | undefined>(undefined)

  /** Array of the PMIDs in the order returned by PubTator. */
  const pmids = ref<string[]>([])

  /** Detailed result information. */
  const searchResults = ref<{ [key: string]: SearchResult }>({})

  /** Initialize the store for the given HGNC symbol. */
  const initialize = async (hgncSymbol$?: string, force: boolean = false) => {
    // Skip if already loaded
    if (!force && hgncSymbol$ === hgncSymbol.value) {
      return
    }

    // Clear against artifacts.
    clearData()

    storeState.value = StoreState.Loading

    // Bail out if no HGNC symbol is available.
    if (!hgncSymbol$) {
      storeState.value = StoreState.Active
      return
    }

    // First, search for related publications
    const searchRes = await fetch(
      `/internal/remote/pubtator3-api/search/?text=@GENE_${hgncSymbol$}`
    )
    if (!searchRes.ok) {
      storeState.value = StoreState.Error
      throw new Error(`Error running PubTator 3 search: ${searchRes.statusText}`)
    }
    const searchData = await searchRes.json()

    // Then, extract PMID list and retrieve biocjson for the PMIDs
    pmids.value = searchData!.results!.map((doc: any) => doc.pmid)
    const exportRes = await fetch(
      `/internal/remote/pubtator3-api/publications/export/biocjson` +
        `?pmids=${pmids.value.join(',')}`
    )
    if (!exportRes.ok) {
      storeState.value = StoreState.Error
      throw new Error(`Error running PubTator 3 export: ${exportRes.statusText}`)
    }
    const exportDataText = await exportRes.text()
    const exportDataLines = exportDataText.split(/\n/)

    // Zip search results and exports into searchResults
    for (const searchDataRecord of searchData.results) {
      searchResults.value[searchDataRecord.pmid] = {
        searchResult: searchDataRecord,
        abstract: undefined
      }
    }
    for (const exportDataLine of exportDataLines) {
      if (exportDataLine) {
        const exportDataRecord = JSON.parse(exportDataLine)
        searchResults.value[exportDataRecord.pmid].abstract = exportDataRecord
      }
    }

    // Finally, set the store state to active
    storeState.value = StoreState.Active
  }

  /** Clear the store. */
  const clearData = () => {
    storeState.value = StoreState.Initial
    hgncSymbol.value = undefined
    pmids.value = []
    searchResults.value = {}
  }

  /** The current gene Ranking. */
  return {
    storeState,
    hgncSymbol,
    pmids,
    searchResults,
    initialize,
    clearData
  }
})
