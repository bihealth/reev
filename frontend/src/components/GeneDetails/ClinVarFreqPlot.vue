<script setup lang="ts">
import { computed } from 'vue'

import VegaPlot from '@/components/VegaPlot.vue'

const coarseClinsigLabels: { [key: string]: string } = {
  COARSE_CLINICAL_SIGNIFICANCE_BENIGN: 'benign',
  COARSE_CLINICAL_SIGNIFICANCE_UNCERTAIN: 'uncertain',
  COARSE_CLINICAL_SIGNIFICANCE_PATHOGENIC: 'pathogenic'
}

const bucketLabels = [
  'no frequency',
  '<0.00001',
  '<0.00025',
  '<0.0005',
  '<0.0001',
  '<0.00025',
  '<0.0005',
  '<0.001',
  '<0.0025',
  '<0.005',
  '<0.01',
  '<0.025',
  '<0.05',
  '<0.1',
  '<0.25',
  '<0.5',
  '<1.0'
]

export interface CountsRecord {
  /** Coarse clinical significance ID */
  coarseClinsig: number
  /** Counts per bucket */
  counts: number[]
}

export interface Props {
  /** Expression records */
  perFreqCounts: CountsRecord[]
}

const props = withDefaults(defineProps<Props>(), {})

const vegaData = computed<any>(() => {
  const values = []
  for (const record of props?.perFreqCounts || []) {
    for (let i = 0; i < record.counts.length; i++) {
      if (record.counts[i] > 0) {
        const value = {
          coarseClinsig: coarseClinsigLabels[record.coarseClinsig],
          freqBucket: bucketLabels[i],
          freqBucketNo: i,
          value: record.counts[i]
        }
        values.push(value)
      }
    }
  }
  if (values.length) {
    return values
  } else {
    return null
  }
})

const vegaLayer = [
  {
    mark: { type: 'bar', tooltip: true }
  },
  {
    mark: {
      type: 'text',
      align: 'center',
      baseline: 'middle',
      dy: -10
    },
    encoding: {
      text: { field: 'value', type: 'quantitative', fontSize: 8 }
    }
  }
]

const vegaEncoding = {
  x: {
    field: 'freqBucket',
    title: 'population frequency',
    type: 'nominal',
    sort: bucketLabels,
    axis: { labelAngle: 45 }
  },
  y: {
    field: 'value',
    scale: { type: 'log' },
    title: 'variant count',
    axis: {
      grid: false,
      tickExtra: false
    }
  },
  xOffset: {
    field: 'coarseClinsig',
    title: 'clinical sig.',
    type: 'nominal',
    sort: Object.values(coarseClinsigLabels)
  },
  color: {
    field: 'coarseClinsig',
    title: 'clinical sig.',
    type: 'nominal',
    sort: Object.values(coarseClinsigLabels),
    scale: {
      domain: Object.values(coarseClinsigLabels),
      range: ['#5d9936', '#f5c964', '#b05454']
    }
  }
}

/** Ref to the VegaPlot (for testing). */
// const vegaPlotRef = ref(null)
</script>

<template>
  <template v-if="!perFreqCounts?.length">
    <v-skeleton-loader class="mt-3 mx-auto border" type="image,image"></v-skeleton-loader>
  </template>

  <v-sheet rounded="lg" class="bg-grey-lighten-3 pa-3 mt-3 ml-2 h-100" v-else>
    <div class="text-subtitle-1 text-center">Impact / Frequency</div>
    <VegaPlot
      :data-values="vegaData"
      :encoding="vegaEncoding"
      :mark="false"
      :layer="vegaLayer"
      :height="200"
      :width="550"
      renderer="svg"
    />
  </v-sheet>
</template>
