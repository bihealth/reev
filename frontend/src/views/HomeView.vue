<script setup lang="ts">
/**
 * Display of Home default page.
 *
 * Implements the search bar for variants and genes.
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import HeaderDefault from '@/components/HeaderDefault.vue'
import FooterDefault from '@/components/FooterDefault.vue'
import SearchBar from '@/components/SearchBar.vue'
import { search } from '@/lib/utils'

const router = useRouter()

const searchTerm = ref('')
const genomeRelease = ref('grch37')

const examples = [
  'BRCA1',
  'EMP',
  'TP53',
  'HGNC:1100',
  'HGNC:777',
  'chr17:41197708:T:G',
  'chr17:41197751:G:T',
  'chr17:41197708:T:G',
  'NC_000017.10:g.41197728G>T'
]

const useExample = (example: string) => {
  searchTerm.value = example
}

/**
 * Perform a search based on the current search term and genome release.
 *
 * If a route is found for the search term then redirect to that route.
 * Otherwise log an error.
 */
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
  <FooterDefault />
</template>

<style scoped>
.examples {
  display: flex;
  flex-direction: column;
}

.example {
  width: 250px;
  margin-top: 10px;
  cursor: pointer;
  border: 2px solid rgb(229, 85, 64);
  border-radius: 10px;
  padding: 5px 10px;
}
</style>
