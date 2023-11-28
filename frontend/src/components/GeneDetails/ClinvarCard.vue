<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

import ClinvarFreqPlot from '@/components/GeneDetails/ClinvarCard/ClinvarFreqPlot.vue'
import ClinvarImpact from '@/components/GeneDetails/ClinvarCard/ClinvarImpact.vue'

const VariationLandscape = defineAsyncComponent(
  () => import('@/components/GeneDetails/ClinvarCard/VariationLandscape.vue')
)

export interface Props {
  geneClinvar: any
  geneInfo: any
  genomeRelease: 'grch37' | 'grch38'
  transcripts: any | null
  perFreqCounts: any
}

const props = withDefaults(defineProps<Props>(), {
  geneInfo: null
})
</script>

<template>
  <v-card class="mt-3">
    <v-card-title class="pb-0">
      ClinVar Information
      <small>
        <a
          :href="`https://www.ncbi.nlm.nih.gov/clinvar/?term=${geneInfo?.hgnc?.symbol}[gene]`"
          target="_blank"
        >
          <v-icon>mdi-launch</v-icon>
        </a>
      </small>
    </v-card-title>
    <v-card-text class="pt-0">
      <v-row no-gutters>
        <v-col cols="6">
          <ClinvarImpact :gene-clinvar="geneClinvar" />
        </v-col>
        <v-col cols="6">
          <ClinvarFreqPlot :per-freq-counts="perFreqCounts" />
        </v-col>
        <v-col cols="12">
          <VariationLandscape
            :clinvar="geneClinvar"
            :transcripts="transcripts"
            :genome-release="genomeRelease"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
