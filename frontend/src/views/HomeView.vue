<template>
  <v-container class="home-view">
    <v-row>
      <v-col cols="12" md="6" class="search-container">
        <v-text-field
          v-model="geneSymbol"
          label="Enter gene symbol"
          class="gene-input"
        ></v-text-field>

        <v-select
          v-model="genomeRelease"
          :items="genomeReleases"
          label="Genome Release"
          class="genome-select"
        ></v-select>

        <v-btn @click="search" color="primary" class="search-button">Search</v-btn>
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

<script lang="ts">
import { searchGene } from '@/api/geneSearch'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCounterStore } from '@/stores/counter'

export default {
  name: 'HomeView',
  setup() {
    const geneSymbol = ref('')
    const genomeReleases = ['hg19', 'hg38']
    const genomeRelease = ref('hg19')
    const router = useRouter()
    const examples = ['BRCA1', 'CHROM:POS:REF:ALT']
    const counterStore = useCounterStore()

    const useExample = (example: string) => {
      geneSymbol.value = example
    }

    const search = async () => {
      try {
        const data = await searchGene(geneSymbol.value, genomeRelease.value)
        counterStore.setGeneData(data)
        router.push({ name: 'gene', params: { geneSymbol: geneSymbol.value } })
      } catch (error) {
        console.error(error)
      }
    }

    return { geneSymbol, genomeReleases, genomeRelease, examples, search, useExample }
  }
}
</script>

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
