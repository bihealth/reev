<script setup lang="ts">
import { ref } from 'vue'
import { searchGene } from '@/api/search'
import { useRouter } from 'vue-router'
import { useGeneInfoStore } from '@/stores/geneInfo'

export interface GenomeReleaseChoice {
  value: string
  label: string
}

export interface Props {
  searchTerm?: string
  genomeRelease?: string
  genomeReleaseChoices?: GenomeReleaseChoice[]
}

const props = withDefaults(defineProps<Props>(), {
  searchTerm: '',
  genomeRelease: 'grch37',
  genomeReleaseChoices: () => [
    { value: 'grch37', label: 'GRCh37' },
    { value: 'grch38', label: 'GRCh38' }
  ]
})

const emit = defineEmits(['update:searchTerm', 'update:genomeRelease', 'clickSearch'])

const router = useRouter()

const geneInfoStore = useGeneInfoStore()

// const performSearch = async (symbol: string, release: string) => {
//   try {
//     const data = await searchGene(symbol, release)
//     geneInfoStore.setGeneData(data)
//     router.push({ name: 'gene', params: { searchTerm: symbol } })
//   } catch (error) {
//     console.error(error)
//   }
// }
</script>

<template>
  <v-row>
    <v-col cols="12" md="7" class="search-container">
      <v-text-field
        :model-value="props.searchTerm"
        @input="$emit('update:searchTerm', $event.target.value)"
        label="Enter search term"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="2">
      <v-select
        :model-value="props.genomeRelease"
        @update:model-value="$emit('update:genomeRelease', $event)"
        :items="props.genomeReleaseChoices"
        item-title="label"
        item-value="value"
        label="Genome Release"
      ></v-select>
    </v-col>
    <v-col cols="12" md="3">
      <v-btn @click="$emit('clickSearch', props.searchTerm, props.genomeRelease)" color="primary">
        search
      </v-btn>
    </v-col>
  </v-row>
</template>

<style scoped>
/* Your styling here */
</style>
