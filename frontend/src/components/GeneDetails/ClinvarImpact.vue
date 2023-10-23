<script setup lang="ts">
import { computed } from 'vue'

export interface Props {
  geneClinvar: any
}

const props = withDefaults(defineProps<Props>(), {
  geneClinvar: null
})

const variantImpactLabels = [
  "3' UTR",
  "5' UTR",
  'downstream',
  'frameshift',
  'inframe indel',
  'start lost',
  'intron',
  'missense',
  'non-coding',
  'stop gained',
  'no alteration',
  'splice acceptor',
  'splice donor',
  'stop lost',
  'synonymous',
  'upstream gene'
]

const clinsigLabels = [
  'benign', // 0
  'likely benign', // 1
  'uncertain signifiance', // 2
  'likely pathogenic', // 3
  'pathogenic' // 4
]

const clinsigColor = ['#5d9936', '#a3f56c', '#f5c964', '#f59f9f', '#b05454']

const perImpactCounts = computed(() => {
  const result = []
  const sum = {
    impact: variantImpactLabels.length - 1,
    counts: [0, 0, 0, 0, 0]
  }

  if (props.geneClinvar?.per_impact_counts) {
    for (const perImpactCount of props.geneClinvar.per_impact_counts) {
      result.push(perImpactCount)
      for (let i = 0; i < sum.counts.length; ++i) {
        sum.counts[i] += perImpactCount.counts[i]
      }
    }
    result.push(sum)
  }
  return result
})
</script>

<template>
  <v-card id="clinvar-impact" class="gene-item">
    <v-card-title>ClinVar By Impact</v-card-title>
    <v-divider />
    <v-card-text v-if="props.geneClinvar?.per_impact_counts?.length">
      <table>
        <tr>
          <thead>
            <th>impact</th>
            <th v-for="i in [0, 1, 2, 3, 4]" :key="i">
              {{ clinsigLabels[i] }}
            </th>
            <th>total</th>
          </thead>
          <tbody>
            <tr v-for="row in perImpactCounts" :key="row">
              <td
                :class="{
                  'font-weight-bolder': variantImpactLabels[row.impact] == 'overall'
                }"
              >
                {{ variantImpactLabels[row.impact] }}
              </td>
              <td
                class="text-right"
                :class="{
                  'font-weight-bolder': variantImpactLabels[row.impact] == 'overall'
                }"
                v-for="(count, idx) in row.counts"
                :style="`background-color: ${clinsigColor[idx]}`"
                :key="idx"
              >
                {{ count }}
              </td>
              <td
                class="text-right"
                :class="{
                  'font-weight-bolder': variantImpactLabels[row.impact] == 'overall'
                }"
              >
                {{ row.counts.reduce((a: any, b: any) => a + b, 0) }}
              </td>
            </tr>
          </tbody>
        </tr>
      </table>
    </v-card-text>
    <v-card-text v-else class="text-center font-italic">No ClinVar data for gene.</v-card-text>
  </v-card>
</template>
