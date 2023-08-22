<script setup lang="ts">
/**
 * Display of Home default page.
 *
 * Implements the search bar for variants and genes.
 */

import { searchGene } from '@/api/search'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGeneInfoStore } from '@/stores/geneInfo'

import Header from '@/components/HeaderDefault.vue'
import SearchBar from '@/components/SearchBar.vue'

const router = useRouter()
const geneInfoStore = useGeneInfoStore()

const searchTerm = ref('')
const genomeRelease = ref('grch37')

const examples = [
  'BRCA1',
  'EGFR',
  'HGNC:1100',
  'ENTREZ:1956',
  'UNIPROT:B7ZA85',
  'CHROM:POS:REF:ALT'
]

const useExample = (example: string) => {
  searchTerm.value = example
}

interface RouteLocationFragment {
  name: string
  params?: any
}

type RouteLoctionBuilder = () => RouteLocationFragment

// We iterate the regexps in the `Map` and will use the route from the
// first match.
const searchRegexp: [RegExp, RouteLoctionBuilder][] = [
  [
    /^.*$/,
    (): RouteLocationFragment => ({
      name: 'gene',
      params: {
        searchTerm: searchTerm.value
      }
    })
  ]
]

const performSearch = async () => {
  for (const [regexp, getRoute] of searchRegexp) {
    if (regexp.test(searchTerm.value)) {
      const routeLocation = getRoute()
      console.log(`term {searchTerm.value} matched {regexp}, route is`, routeLocation)
      router.push(routeLocation)
      return
    }
  }
  console.error('no route found for {searchTerm.value}')
}
</script>

<template>
  <Header />
  <v-container class="home-view">
    <SearchBar
      v-model:search-term="searchTerm"
      v-model:genome-release="genomeRelease"
      @click-search="performSearch"
    />

    <v-row>
      <v-col cols="12" md="6">
        <h2>Example Queries</h2>
      </v-col>
      <v-col cols="12">
        <div class="examples">
          <div
            class="example"
            v-for="example in examples"
            :key="example"
            @click="useExample(example)"
          >
            {{ example }}
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.home-view {
  padding: 20px;
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.gene-input,
.genome-select {
  margin-right: 10px;
}

.search-button {
  margin-top: 16px;
}

.examples {
  display: flex;
  flex-direction: column;
}

.example {
  margin-top: 10px;
  cursor: pointer;
}
</style>
