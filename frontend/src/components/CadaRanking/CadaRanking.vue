<script setup lang="ts">
import { roundIt, separateIt } from '@bihealth/reev-frontend-lib/lib/utils'
import { type GeneRank, useCadaPrioStore } from '@bihealth/reev-frontend-lib/stores/cadaPrio'
import { computed, onMounted } from 'vue'

import { useCaseInfoStore } from '@/stores/caseInfo'

export interface Props {
  /** HGNC ID of gene to display */
  hgncId?: string
}

const props = withDefaults(defineProps<Props>(), { hgncId: '' })

const caseInfoStore = useCaseInfoStore()
const cadaPrioStore = useCadaPrioStore()

const geneRank = computed<GeneRank | null>(() => {
  return (
    (cadaPrioStore.geneRanking ?? []).find((geneRank) => {
      return geneRank.hgncId === props.hgncId
    }) ?? null
  )
})

// Load case store when mounted.
onMounted(async () => await caseInfoStore.initialize())
</script>

<template>
  <v-sheet color="blue-grey-lighten-2" class="px-3 pt-1 pb-3 rounded h-100 text-center">
    <div class="text-overline mb-1" style="font-size: 120% !important">Gene-to-Phenotype Rank</div>

    <div v-if="caseInfoStore.caseInfo.hpoTerms.length === 0">No Case HPO terms</div>
    <div v-else-if="!geneRank">No Rank Computed</div>
    <div v-else>
      <div class="text-h2 mb-6 mt-6">#{{ separateIt(geneRank?.rank) }}</div>
      <div class="text-caption" style="font-size: 120% !important">
        out of {{ separateIt(cadaPrioStore?.geneRanking?.length ?? 0) }} genes
      </div>
      <div class="text-caption font-weight-bold mt-3" style="font-size: 120% !important">
        <!-- eslint-disable vue/no-v-html -->
        CADA score: <span v-html="roundIt(geneRank?.score)" />
        <!-- eslint-enable -->
      </div>
    </div>
  </v-sheet>
</template>
