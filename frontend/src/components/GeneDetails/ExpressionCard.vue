<script setup lang="ts">
import { computed, ref } from 'vue'

import DocsLink from '@/components/DocsLink.vue'
import VegaPlot from '@/components/VegaPlot.vue'

import { TISSUE_DETAILED_LABELS, TISSUE_LABELS } from './ExpressionCard.c'

export interface ExpressionRecord {
  /** Tissue id */
  tissue: number
  /** Detailed tissue id */
  tissueDetailed: number
  /** TPM quantiles (0, 0.25, 0.5, 0.75, 1.0) */
  tpms: number[]
}

export interface Props {
  /** Gene symbol */
  geneSymbol: string
  /** Expression records */
  expressionRecords: ExpressionRecord[]
  /** Ensembl gene ID */
  ensemblGeneId: string
}

const props = withDefaults(defineProps<Props>(), {
  geneSymbol: '',
  expressionRecords: () => [],
  ensemblGeneId: ''
})

// -- interactive plot configuration -------------------------------------------

/** Sort order. */
enum SortOrder {
  /** Sort alphabetically by label */
  ALPHA = 'alphabetical',
  /** Sort by TPM metric */
  TPM = 'tpm'
}

/** Sort order configuration (currently static) */
const sortOrder = ref<SortOrder>(SortOrder.TPM)

// -- data for Vega plot -------------------------------------------------------

/** Interface for the plot data. */
interface VegaData {
  /** Tissue label */
  tissue: string
  /** Detailed tissue label */
  tissueDetailed: string
  /** Lower quantile */
  lower: number
  /** First quartile */
  q1: number
  /** Median */
  median: number
  /** Third quartile */
  q3: number
  /** Upper quantile */
  upper: number
}

/** Compute data values for Vega plot. */
const vegaData = computed<VegaData[]>(() => {
  if (!props?.expressionRecords?.length) {
    return []
  }

  const expressionRecords = Object.assign([], props?.expressionRecords)
  if (sortOrder.value === SortOrder.ALPHA) {
    expressionRecords.sort((a: any, b: any) => {
      const aTissue = TISSUE_LABELS[a.tissue]
      const bTissue = TISSUE_LABELS[b.tissue]
      if (aTissue < bTissue) {
        return -1
      } else if (aTissue > bTissue) {
        return 1
      } else {
        return 0
      }
    })
  } else {
    expressionRecords.sort((a: any, b: any) => {
      if (a.tpms[2] < b.tpms[2]) {
        return 1
      } else if (a.tpms[2] > b.tpms[2]) {
        return -1
      } else {
        return 0
      }
    })
  }
  return expressionRecords.map((record: any) => ({
    tissue: TISSUE_LABELS[record.tissue],
    tissueDetailed: TISSUE_DETAILED_LABELS[record.tissueDetailed],
    lower: record.tpms[0],
    q1: record.tpms[1],
    median: record.tpms[2],
    q3: record.tpms[3],
    upper: record.tpms[4]
  }))
})

/** The encoding for the Vega plot. */
const vegaEncoding = {
  x: {
    field: 'tissueDetailed',
    type: 'nominal',
    title: null,
    axis: { labelAngle: 45 }
  }
}

/** The layer definition for the Vega plot. */
const vegaLayer = [
  {
    mark: { type: 'rule', tooltip: { content: 'data' } },
    encoding: {
      y: {
        field: 'lower',
        type: 'quantitative',
        scale: { zero: false },
        title: 'TPM'
      },
      y2: { field: 'upper' }
    }
  },
  {
    mark: { type: 'bar', size: 14, tooltip: { content: 'data' } },
    encoding: {
      y: { field: 'q1', type: 'quantitative' },
      y2: { field: 'q3' },
      color: { field: 'tissue', type: 'nominal', legend: null }
    }
  },
  {
    mark: {
      type: 'tick',
      color: 'white',
      size: 14,
      tooltip: { content: 'data' }
    },
    encoding: {
      y: { field: 'median', type: 'quantitative' }
    }
  }
]
</script>

<template>
  <!-- no ENSG => display loader -->
  <template v-if="!ensemblGeneId?.length">
    <v-skeleton-loader class="mt-3 mx-auto border" type="image,button" />
  </template>

  <!-- otherwise, display actual card -->
  <template v-else>
    <v-card class="mt-3">
      <v-card-title class="pb-0 pr-2">
        Expression
        <DocsLink anchor="expression" />
      </v-card-title>
      <v-card-subtitle class="text-overline">
        Tissue-Specific Gene Expression from GTeX
      </v-card-subtitle>
      <v-card-text class="pt-3 pb-0">
        <v-sheet color="background">
          <VegaPlot
            data-name="expression"
            :data-values="vegaData"
            :encoding="vegaEncoding"
            :layer="vegaLayer"
            :mark="false"
            :height="300"
            :width="1200"
            background="#eeeeee"
            renderer="svg"
          />
        </v-sheet>
      </v-card-text>
      <v-card-actions>
        <v-btn
          id="expression-card-gtex-portal"
          :href="`https://gtexportal.org/home/gene/${ensemblGeneId ?? ''}`"
          target="_blank"
          prepend-icon="mdi-launch"
        >
          GTeX Portal
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
</template>
