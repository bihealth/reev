<script setup lang="ts">
export interface Props {
  /** Gene information from annonars. */
  gene: any
}

withDefaults(defineProps<Props>(), {
  gene: null
})
</script>

<template>
  <div id="hgnc" class="gene-item">
    <h3>HGNC</h3>
    <v-divider></v-divider>
    <div>
      <div>
        <strong>symbol:</strong>
        {{ $props.gene?.hgnc?.symbol }}
      </div>
      <div>
        <strong>name:</strong>
        {{ $props.gene?.hgnc?.name }}
      </div>
      <div>
        <strong>cytoband:</strong>
        {{ $props.gene?.hgnc?.location }}
      </div>
      <div>
        <strong>aliases:</strong>
        {{ $props.gene?.hgnc?.alias_name?.join(', ') }}
      </div>
      <div>
        <strong>synonyms:</strong>
        {{ $props.gene?.hgnc?.alias_symbol?.join(', ') }}
      </div>
    </div>
  </div>

  <v-divider></v-divider>
  <v-divider></v-divider>

  <div id="ncbi-summary" class="gene-item">
    <h3>NCBI Summary</h3>
    <v-divider></v-divider>
    <div>
      <div class="overflow-auto" style="max-height: 250px; font-size: 90%">
        {{ $props.gene?.ncbi?.summary }}
        <a :href="`https://www.ncbi.nlm.nih.gov/gene/672`" target="_blank">
          <v-icon>mdi-launch</v-icon>
          source
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped="true">
.gene-item {
  margin: 15px;
}
</style>
