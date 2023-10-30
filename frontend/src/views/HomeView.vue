<script setup lang="ts">
/**
 * Display of Home default page.
 *
 * Implements the search bar for variants and genes.
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FooterDefault from '@/components/FooterDefault.vue'
import HeaderDefault from '@/components/HeaderDefault.vue'
import SearchBar from '@/components/SearchBar.vue'
import { search } from '@/lib/utils'

const router = useRouter()

const searchTerm = ref('')
const genomeRelease = ref('grch37')
const showCaseInformation = ref(false)

interface Example {
  query: string
  label?: string
}

const examples: Example[] = [
  { query: 'BRCA1', label: 'gene symbols BRCA1, TP53, ...' },
  { query: 'TP53' },
  { query: 'EMP', label: 'partial gene symbol EMP, query for similar gene' },
  { query: 'NM_007294.4(BRCA1):c.5123C>A', label: 'HGVS position on transcript' },
  { query: 'NC_000017.10:g.41197728G>T', label: 'HGVS genomic variant' },
  {
    query: 'chr17:41197708:T:G',
    label: 'SPDI (sequence, position, deleted, inserted) genomic variants'
  },
  { query: 'chr17:41197751:G:T' },
  { query: 'DEL:chr17:41176312:41277500', label: 'genomic specification of a deletion' }
]

const performExampleSearch = (example: string) => {
  searchTerm.value = example
  genomeRelease.value = 'grch38'
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
              <div v-if="example.label?.length" class="text-caption mt-3">{{ example.label }}</div>
              <v-btn class="example mt-1" @click="performExampleSearch(example.query)">{{
                example.query
              }}</v-btn>
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
