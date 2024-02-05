<script setup lang="ts">
import { defineAsyncComponent, watch } from 'vue'

import DocsLink from '@/components/DocsLink.vue'
import ClinvarFreqPlot from '@/components/GeneDetails/ClinvarCard/ClinvarFreqPlot.vue'
import ClinvarImpact from '@/components/GeneDetails/ClinvarCard/ClinvarImpact.vue'
import type { GenomeBuild } from '@/lib/genomeBuilds'

// const VariationLandscape = defineAsyncComponent(
//   () => import('@/components/GeneDetails/ClinvarCard/VariationLandscape.vue')
// )
const VarLand = defineAsyncComponent(
  () => import('@/components/GeneDetails/ClinvarCard/VarLand.vue')
)

export interface Props {
  geneClinvar: any
  geneInfo: any
  genomeBuild?: GenomeBuild
  transcripts?: any
  perFreqCounts: any
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<Props>()

// Watch for changes in the transctipts prop
watch(
  () => props.transcripts,
  () => {
    // Just update props.transcripts
  }
)
</script>

<template>
  <v-card class="mt-3">
    <v-card-title class="pb-0 pr-2">
      ClinVar Information
      <small>
        <a
          :href="`https://www.ncbi.nlm.nih.gov/clinvar/?term=${geneInfo?.hgnc?.symbol}[gene]`"
          target="_blank"
        >
          <v-icon>mdi-launch</v-icon>
        </a>
      </small>
      <DocsLink anchor="clinvar-information" />
    </v-card-title>
    <v-card-text class="pt-0">
      <v-row no-gutters>
        <v-col cols="6">
          <ClinvarImpact :gene-clinvar="geneClinvar" />
        </v-col>
        <v-col cols="6">
          <ClinvarFreqPlot :per-freq-counts="perFreqCounts" />
        </v-col>
        <!-- <v-col cols="12">
          <VariationLandscape
            :clinvar="geneClinvar"
            :transcripts="transcripts"
            :genome-build="genomeBuild"
            :gene-symbol="geneInfo?.hgnc?.symbol"
          />
        </v-col> -->
        <v-col cols="12">
          <VarLand
            :clinvar="geneClinvar"
            :transcripts="transcripts"
            :genome-build="genomeBuild"
            :gene-symbol="geneInfo?.hgnc?.symbol"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
