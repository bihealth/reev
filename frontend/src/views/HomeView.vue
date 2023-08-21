<script setup lang="ts">
/**
 * Display of Home default page.
 *
 * Implements the search bar for variants and genes.
 */

import { searchGene } from '@/api/search'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGeneDataStore } from '@/stores/geneData'

import Header from '@/components/Header.vue'
import SearchBar from '@/components/SearchBar.vue'

const router = useRouter()
const geneDataStore = useGeneDataStore()

const geneSymbol = ref('')
const genomeRelease = ref('hg19')
const genomeReleases = ['hg19', 'hg38']
const examples = [
  'BRCA1',
  'EGFR',
  'HGNC:1097',
  ' ENTREZ:1956',
  'UNIPROT:B7ZA85',
  'CHROM:POS:REF:ALT'
]

const useExample = (example: string) => {
  geneSymbol.value = example
}

const performSearch = async () => {
  try {
    const data = await searchGene(geneSymbol.value, genomeRelease.value)
    geneDataStore.setGeneData(data)
    router.push({ name: 'gene', params: { geneSymbol: geneSymbol.value } })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <Header />
  <v-container class="home-view">
    <!-- <SearchBar :geneSymbol="geneSymbol" @update:geneSymbol="updateGeneSymbol" /> -->
    <v-row>
      <v-col cols="12" md="7" class="search-container">
        <v-text-field
          v-model="geneSymbol"
          label="Enter gene symbol"
          class="gene-input"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="genomeRelease"
          :items="genomeReleases"
          label="Genome Release"
          class="genome-select"
        ></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn @click="performSearch" color="primary" class="search-button">
          Search for variants and genes
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <h2>Examples:</h2>
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
