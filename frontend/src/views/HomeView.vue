<script setup lang="ts">
/**
 * Display of Home default page.
 *
 * Implements the search bar for variants and genes.
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import HeaderDefault from '@/components/HeaderDefault.vue'
import SearchBar from '@/components/SearchBar.vue'
import { search } from '@/api/utils'

const router = useRouter()

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

const performSearch = async () => {
  const routeLocation: any = search(searchTerm.value, genomeRelease.value)
  if (routeLocation) {
    router.push(routeLocation)
  } else {
    console.error(`no route found for ${searchTerm.value}`)
  }
}
</script>

<template>
  <HeaderDefault />
  <v-container class="home-view">
    <SearchBar
      v-model:search-term="searchTerm"
      v-model:genome-release="genomeRelease"
      @click-search="performSearch"
    />

    <v-row>
      <v-col>
        <h2>Example Queries:</h2>
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
.examples {
  display: flex;
  flex-direction: column;
}

.example {
  margin-top: 10px;
  cursor: pointer;
}
</style>
