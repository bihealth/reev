<script setup lang="ts">
import { computed } from 'vue'

import { separateIt } from '@/lib/utils'

export interface Props {
  geneClinvar: any
}

const props = withDefaults(defineProps<Props>(), {
  geneClinvar: null
})

/** Enumeration fo coarser impacts. */
enum CoarseImpact {
  UNKNOWN = 'UNKNOWN',
  OTHER = 'OPTHER',
  NONSENSE = 'NONSENSE',
  MISSENSE_INFRAME = 'MISSENSE_INFRAME',
  NON_CODING = 'NON_CODING',
  SYNONYMOUS = 'SYNONYMOUS',
  TOTAL = 'TOTAL'
}

/** Mapping from coarse impact to index. */
const COARSE_IMPACT_TO_INDEX: { [key: string]: number } = {
  UNKNOWN: -1,
  OTHER: -1,
  NONSENSE: 0,
  MISSENSE_INFRAME: 1,
  NON_CODING: 2,
  SYNONYMOUS: 3,
  TOTAL: 4
}

/** Labels for coarse impact. */
const COARSE_IMPACT_LABELS: { [key: string]: string } = {
  UNKNOWN: 'unknown',
  OTHER: 'other',
  NONSENSE: 'LoF',
  MISSENSE_INFRAME: 'missense / inframe',
  NON_CODING: 'non-coding',
  SYNONYMOUS: 'synonymous',
  TOTAL: 'total'
}

/** Mapping from raw to coarse impact.  */
const IMPACT_RAW_TO_COARSE: { [key: string]: CoarseImpact } = {
  IMPACT_UNKNOWN: CoarseImpact.UNKNOWN,
  IMPACT_STOP_LOST: CoarseImpact.OTHER,
  IMPACT_NO_SEQUENCE_ALTERATION: CoarseImpact.SYNONYMOUS,
  IMPACT_SYNONYMOUS_VARIANT: CoarseImpact.SYNONYMOUS,
  IMPACT_THREE_PRIME_UTR_VARIANT: CoarseImpact.NON_CODING,
  IMPACT_FIVE_PRIME_UTR_VARIANT: CoarseImpact.NON_CODING,
  IMPACT_DOWNSTREAM_TRANSCRIPT_VARIANT: CoarseImpact.NON_CODING,
  IMPACT_INTRON_VARIANT: CoarseImpact.NON_CODING,
  IMPACT_NON_CODING_TRANSCRIPT_VARIANT: CoarseImpact.NON_CODING,
  IMPACT_UPSTREAM_TRANSCRIPT_VARIANT: CoarseImpact.NON_CODING,
  IMPACT_INFRAME_INDEL: CoarseImpact.MISSENSE_INFRAME,
  IMPACT_MISSENSE_VARIANT: CoarseImpact.MISSENSE_INFRAME,
  IMPACT_FRAMESHIFT_VARIANT: CoarseImpact.NONSENSE,
  IMPACT_START_LOST: CoarseImpact.NONSENSE,
  IMPACT_STOP_GAINED: CoarseImpact.NONSENSE,
  IMPACT_SPLICE_ACCEPTOR_VARIANT: CoarseImpact.NONSENSE,
  IMPACT_SPLICE_DONOR_VARIANT: CoarseImpact.NONSENSE,
  total: CoarseImpact.TOTAL
}

/** Mapping from clinsig order to coarse order */
const CLINSIG_ORDER_TO_COARSE_ORDER = [
  2, // benign
  2, // likely benign
  1, // uncertain
  0, // likely pathogenic
  0 // pathogenic
]

/** Labels of clinical significance by order in table. */
const COARSE_CLINSIG_LABELS = ['pathogenic', 'uncertain', 'benign', 'total']

/** Returns true for coarse impacts to show */
const showCoarseImpact = (key: string): boolean => COARSE_IMPACT_TO_INDEX[key] >= 0

/** Counts per coarse impact, `list[coarseImpact][coarseClinsig]` */
const perCoarseImpactCounts = computed(() => {
  const result = Object.keys(CoarseImpact)
    .filter(showCoarseImpact)
    .map(() => {
      return [0, 0, 0, 0]
    })

  if (props.geneClinvar?.perImpactCounts) {
    for (const perImpactCount of props.geneClinvar.perImpactCounts) {
      const coarseImpact = IMPACT_RAW_TO_COARSE[perImpactCount.impact]
      for (let i = 0; i < 5; ++i) {
        const idx = COARSE_IMPACT_TO_INDEX[coarseImpact]
        const idxTotal = COARSE_IMPACT_TO_INDEX[CoarseImpact.TOTAL]
        result[idx][CLINSIG_ORDER_TO_COARSE_ORDER[i]] += perImpactCount.counts[i]
        result[idxTotal][CLINSIG_ORDER_TO_COARSE_ORDER[i]] += perImpactCount.counts[i]
        result[idx][3] += perImpactCount.counts[i]
        result[idxTotal][3] += perImpactCount.counts[i]
      }
    }
  }

  return result
})

/** Return percent given the coarse impact and clinsig index */
const percent = (coarseImpact: string, coarseClinsigIdx: number): number => {
  const idx = COARSE_IMPACT_TO_INDEX[coarseImpact]
  const idxTotal = COARSE_IMPACT_TO_INDEX[CoarseImpact.TOTAL]
  return (
    Math.round(
      (1000 * perCoarseImpactCounts.value[idx][coarseClinsigIdx]) /
        perCoarseImpactCounts.value[idxTotal][3]
    ) / 10
  )
}

/** Return color given the coarse clinsig idx and percentage. */
const clinsigColor = (coarseClinsigIdx: number, percent: number): string => {
  const MAX_INTENSITY = 0.8
  const MAX_PERCENT = 20
  let intensity = MAX_INTENSITY
  if (percent < MAX_PERCENT) {
    intensity = (MAX_INTENSITY * percent) / MAX_PERCENT
  }

  switch (coarseClinsigIdx) {
    case 2:
      return `rgba(93, 153, 54, ${intensity})`
    case 1:
      return `rgba(150, 150, 150, ${intensity})`
    case 0:
      return `rgba(176, 84, 84, ${intensity})`
    default:
      return 'rgba(0, 0, 0, 0)'
  }
}
</script>

<template>
  <!-- no ClinVar data => display loader -->
  <template v-if="!geneClinvar?.perImpactCounts?.length">
    <v-skeleton-loader
      class="mt-3 mx-auto border"
      type="table-heading,table-row,table-row,table-row,table-row"
    />
  </template>
  <template v-else>
    <v-sheet rounded="lg" class="bg-grey-lighten-3 pa-3 mt-3 mr-1 h-100">
      <v-table class="bg-transparent">
        <thead>
          <tr>
            <th width="20%" class="text-subtitle-1">Impact Counts</th>
            <th
              v-for="key of Object.keys(CoarseImpact).filter(showCoarseImpact)"
              :key="key"
              class="font-weight-bold text-center"
            >
              {{ COARSE_IMPACT_LABELS[key] }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(label, idx) of COARSE_CLINSIG_LABELS" :key="idx">
            <td class="font-weight-bold">
              {{ label }}
            </td>
            <td
              v-for="key of Object.keys(COARSE_IMPACT_LABELS).filter(showCoarseImpact)"
              :key="key"
              class="text-center"
              :title="`${percent(key, idx)} %`"
            >
              <span
                class="pa-3 rounded-lg text-no-wrap"
                :style="`background-color: ${clinsigColor(idx, percent(key, idx))}`"
              >
                {{ separateIt(perCoarseImpactCounts[COARSE_IMPACT_TO_INDEX[key]][idx]) }}
              </span>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-sheet>
  </template>
</template>
