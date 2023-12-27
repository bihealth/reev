<!--
This component displays related literature using the PubTator 3 API.
-->
<script setup lang="ts">
/** Interface for this component's */
export interface Props {
  geneInfo: any
}

/** This component's props. */
const props = defineProps<Props>()
</script>

<template>
  <!-- no HGNC symbol => display loader -->
  <template v-if="!geneInfo?.hgnc?.symbol">
    <v-skeleton-loader class="mt-3 mx-auto border" type="heading,subtitle,text,text" />
  </template>

  <!-- otherwise, display actual card -->
  <template v-else>
    <v-card class="mt-3">
      <v-card-title class="pb-0 pr-2">
        Literature
        <DocsLink anchor="literature" />
      </v-card-title>
      <v-card-subtitle class="text-overline"> Latest PubMed Entries from PubTator 3 </v-card-subtitle>
      <v-card-text class="pt-3">
      </v-card-text>

      <v-card-actions>
        <v-btn
          :href="`https://www.ncbi.nlm.nih.gov/research/pubtator3/docsum?text=@GENE_${geneInfo?.hgnc?.symbol}`"
          target="_blank"
          prepend-icon="mdi-launch"
        >
          PubTator 3
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
</template>
