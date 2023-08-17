<script lang="ts">
import { useGeneDataStore } from '@/stores/geneData'

export default {
  name: 'GeneDetailView',
  setup() {
    const geneDataStore = useGeneDataStore()
    return { geneData: geneDataStore.geneData }
  }
}
</script>

<template>
  <div class="gene-detail">
    <h1>Gene Detail View</h1>
    <pre>{{ geneData }}</pre>
  </div>
</template>
