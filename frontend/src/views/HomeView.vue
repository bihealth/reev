<template>
  <div class="home-view">
    <nav class="topbar-links">
      <router-link to="/about">About</router-link>
      <router-link to="/contact">Contact</router-link>
    </nav>

    <div class="search-container">
      <input v-model="geneSymbol" class="gene-input" type="text" placeholder="Enter gene symbol" />

      <select v-model="genomeRelease" class="genome-select">
        <option value="hg19">hg19</option>
        <option value="hg38">hg38</option>
      </select>

      <button @click="search" class="search-button">Search</button>
    </div>

    <div class="examples">
      <div class="example" v-for="example in examples" :key="example" @click="useExample(example)">
        {{ example }}
      </div>
    </div>
  </div>
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
    const genomeRelease = ref('hg19')
    const router = useRouter()
    const examples = ['BRCA1', 'CHROM:POS:REF:ALT']
    const counterStore = useCounterStore()

    const useExample = (example: string) => {
      geneSymbol.value = example
    }

    const search = async () => {
      try {
        const data = await searchGene(geneSymbol.value, '', genomeRelease.value)
        counterStore.setGeneData(data)
        router.push({ name: 'gene', params: { geneSymbol: geneSymbol.value } })
      } catch (error) {
        console.error(error)
      }
    }

    return { geneSymbol, genomeRelease, examples, search, useExample }
  }
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  align-items: left;
  padding: 20px;
}

.topbar-links {
  display: flex;
  justify-content: center;
  top: 50px;
  margin-top: 20px;
}

nav {
  margin-bottom: 20px;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: blue;
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.gene-input {
  padding: 5px;
  margin-right: 10px;
}

.genome-select {
  padding: 5px;
  margin-right: 10px;
}

.search-button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.examples {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.example {
  margin-top: 10px;
  cursor: pointer;
}
</style>
