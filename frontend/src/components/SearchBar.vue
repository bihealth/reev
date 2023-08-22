<script setup lang="ts">
import { ref } from 'vue'
import { searchGene } from '@/api/search'
import { useRouter } from 'vue-router'
import { useGeneDataStore } from '@/stores/geneData'

const props = defineProps({
  geneSymbol: String
})

// const emit = defineEmits()

const router = useRouter()
const geneDataStore = useGeneDataStore()

const geneSymbol = ref(props.geneSymbol)
const genomeRelease = ref('hg19')
const genomeReleases = ['hg19', 'hg38']

// const updateGeneSymbol = (event: InputEvent) => {
//   geneSymbol.value = (event.target as HTMLInputElement).value
//   emit('update:geneSymbol', geneSymbol.value)
// }

const performSearch = async (symbol: string, release: string) => {
  try {
    const data = await searchGene(symbol, release)
    geneDataStore.setGeneData(data)
    router.push({ name: 'gene', params: { geneSymbol: symbol } })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12" md="7" class="search-container">
      <v-text-field
        v-bind:geneSymbol="geneSymbol"
        v-on:update:geneSymbol="updateGeneSymbol"
        v-model="geneSymbol"
        label="Enter gene symbol"
        class="gene-input"
        @input="updateGeneSymbol"
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
      <v-btn
        @click="performSearch(geneSymbol, genomeRelease)"
        color="primary"
        class="search-button"
      >
        Search for variants and genes
      </v-btn>
    </v-col>
  </v-row>
</template>

<style scoped>
/* Your styling here */
</style>
