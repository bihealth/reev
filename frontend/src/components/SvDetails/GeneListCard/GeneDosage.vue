<script setup lang="ts">
import {
  CLINGEN_DOSAGE_COLOR,
  CLINGEN_DOSAGE_SCORES
} from '@/components/GeneDetails/PathogenicityCard.c'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  dosage?: string
  geneSymbol?: string
}>()
</script>

<template>
  <template v-if="dosage === 'CLINGEN_DOSAGE_SCORE_RECESSIVE'">
    <a
      :href="`https://search.clinicalgenome.org/kb/gene-dosage/${geneSymbol ?? ''}`"
      target="_blank"
    >
      <v-chip density="compact" rounded="xl" :class="`bg-${CLINGEN_DOSAGE_COLOR[dosage]}`">
        AR
      </v-chip>
      <small class="pl-1"><v-icon>mdi-launch</v-icon></small>
    </a>
  </template>
  <template v-else-if="!dosage || dosage === 'CLINGEN_DOSAGE_SCORE_UNKNOWN'">
    <v-chip density="compact" rounded="xl" :class="`bg-grey-lighten-5`"> N/A </v-chip>
    <small class="pl-1">
      <v-icon><!--spacer only--></v-icon>
    </small>
  </template>
  <template v-else>
    <a
      :href="`https://search.clinicalgenome.org/kb/gene-dosage/${geneSymbol ?? ''}`"
      target="_blank"
    >
      <v-chip density="compact" rounded="xl" :class="`bg-${CLINGEN_DOSAGE_COLOR[dosage]}`">
        {{ CLINGEN_DOSAGE_SCORES[dosage] }}
      </v-chip>
      <small class="pl-1"><v-icon>mdi-launch</v-icon></small>
    </a>
  </template>
</template>
