<script setup lang="ts">
/**
 * Display of Home default page.
 *
 * Implements the search bar for variants and genes.
 */
import { defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

import { search } from '@/lib/utils'

// Components
const FooterDefault = defineAsyncComponent(() => import('@/components/FooterDefault.vue'))
const HeaderDefault = defineAsyncComponent(() => import('@/components/HeaderDefault.vue'))
const SearchBar = defineAsyncComponent(() => import('@/components/SearchBar.vue'))

const router = useRouter()

/** Genome release string values. */
type GenomeRelease = 'grch37' | 'grch38'

const searchTerm = ref<string>('')
const genomeRelease = ref<GenomeRelease>('grch37')
const showCaseInformation = ref(false)

interface Example {
  query: string
  label?: string
  genomeRelease: GenomeRelease
}

const examples: Example[] = [
  { query: 'BRCA1', label: 'gene symbols BRCA1, TP53, ...', genomeRelease: 'grch38' },
  { query: 'TP53', genomeRelease: 'grch38' },
  {
    query: 'EMP',
    label: 'partial gene symbol EMP, query for similar gene',
    genomeRelease: 'grch38'
  },
  {
    query: 'NM_007294.4(BRCA1):c.5123C>A',
    label: 'HGVS position on transcript',
    genomeRelease: 'grch38'
  },
  { query: 'NC_000017.10:g.41197728G>T', label: 'HGVS genomic variant', genomeRelease: 'grch37' },
  {
    query: 'chr17:41197708:T:G',
    label: 'SPDI (sequence, position, deleted, inserted) genomic variants',
    genomeRelease: 'grch37'
  },
  { query: 'chr17:41197751:G:T', genomeRelease: 'grch37' },
  {
    query: 'DEL:chr17:41176312:41277500',
    label: 'genomic specification of a deletion',
    genomeRelease: 'grch37'
  },
  { query: 'chrMT:8993:T:G', label: 'mitochondrial variants', genomeRelease: 'grch37' },
  { query: 'chrMT:15172:G:A', genomeRelease: 'grch38' }
]

const performExampleSearch = (example: Example) => {
  searchTerm.value = example.query
  genomeRelease.value = example.genomeRelease
  performSearch()
}

/**
 * Perform a search based on the current search term and genome release.
 *
 * If a route is found for the search term then redirect to that route.
 * Otherwise log an error.
 */
const performSearch = async () => {
  const routeLocation: any = await search(searchTerm.value, genomeRelease.value)
  if (routeLocation) {
    router.push(routeLocation)
  } else {
    console.error(`no route found for ${searchTerm.value}`)
  }
}
</script>

<template>
  <HeaderDefault v-model:case-information="showCaseInformation" />
  <v-container class="home-view">
    <SearchBar
      v-model:search-term="searchTerm"
      v-model:genome-release="genomeRelease"
      @click-search="performSearch"
    />

    <v-row>
      <v-col cols="12" md="4">
        <v-card id="examples">
          <v-card-title>Example Queries:</v-card-title>
          <v-card-text class="examples">
            <div v-for="example in examples" :key="example.label">
              <div v-if="example.label?.length" class="text-caption mt-3">
                {{ example.label }}
              </div>
              <v-btn class="example mt-1" @click="performExampleSearch(example)">
                {{ example.query }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <FooterDefault />
</template>

<style scoped>
#examples {
  margin-top: 30px;
  padding: 10px;
}

.examples {
  display: flex;
  flex-direction: column;
}

.example {
  width: 300px;
  cursor: pointer;
}
</style>
