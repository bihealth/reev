<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const CadaPrioRanking = defineAsyncComponent(
  () => import('@/components/GeneDetails/CadaPrioRanking.vue')
)
export interface Props {
  /** Gene information from annonars. */
  gene: any
}

withDefaults(defineProps<Props>(), {
  gene: null
})
</script>

<template>
  <v-card id="hgnc" class="gene-item">
    <v-card-title>HGNC</v-card-title>
    <v-divider />
    <v-card-text>
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
        {{ $props.gene?.hgnc?.aliasName?.join(', ') }}
      </div>
      <div>
        <strong>synonyms:</strong>
        {{ $props.gene?.hgnc?.aliasSymbol?.join(', ') }}
      </div>
    </v-card-text>
  </v-card>

  <v-divider></v-divider>
  <v-divider></v-divider>

  <v-card id="ncbi-summary" class="gene-item">
    <v-card-title>NCBI Summary</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div class="overflow-auto" style="max-height: 250px; font-size: 90%">
        {{ $props.gene?.ncbi?.summary }}
        <a :href="`https://www.ncbi.nlm.nih.gov/gene/672`" target="_blank">
          <v-icon>mdi-launch</v-icon>
          source
        </a>
      </div>
    </v-card-text>
  </v-card>

  <CadaPrioRanking />
</template>

<style scoped="true">
.gene-item {
  margin: 15px;
}
</style>
