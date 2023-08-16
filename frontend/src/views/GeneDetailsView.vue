<template>
  <div class="gene-details">
    <h1>Gene Details</h1>
    <pre>{{ geneData }}</pre>
  </div>
</template>

<script lang="ts">
import { useCounterStore } from '@/stores/counter'

export default {
  name: 'GeneDetailsView',
  setup() {
    const counterStore = useCounterStore()
    return { geneData: counterStore.geneData }
  }
}
</script>
