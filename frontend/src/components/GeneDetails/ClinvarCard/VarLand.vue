<script setup lang="ts">
import Plotly from 'plotly.js-dist-min'
import { computed, onMounted, watch } from 'vue'

import type { GenomeBuild } from '@/lib/genomeBuilds'

export interface Props {
  /** Gene information from annonars. */
  clinvar: any
  /** Transctipts information. */
  transcripts: any
  /** The genome release. */
  genomeBuild?: GenomeBuild
  /** Gene symbol */
  geneSymbol: string
}

const props = withDefaults(defineProps<Props>(), {
  clinvar: null,
  transcripts: null,
  genomeBuild: 'grch37',
  geneSymbol: '???'
})

const clinvarSignificanceMapping: { [key: string]: number } = {
  CLINICAL_SIGNIFICANCE_UNKNOWN: -3,
  CLINICAL_SIGNIFICANCE_PATHOGENIC: 2,
  CLINICAL_SIGNIFICANCE_LIKELY_PATHOGENIC: 1,
  CLINICAL_SIGNIFICANCE_UNCERTAIN_SIGNIFICANCE: 0,
  CLINICAL_SIGNIFICANCE_LIKELY_BENIGN: -1,
  CLINICAL_SIGNIFICANCE_BENIGN: -2
}

interface ClinvarReferenceAssertions {
  rcv: string
  clinicalSignificance: string
  reviewStatus: string
  title: string
}

interface ClinvarVariant {
  chrom: string
  start: number
  stop: number
  reference: string
  alternative: string
  vcv: string
  referenceAssertions: ClinvarReferenceAssertions[]
}

interface PlotlyData {
  x: number
  y: number
}

/* Convert clinvar significance to a number */
const convertClinvarSignificance = (input: string): number => {
  if (input in clinvarSignificanceMapping) {
    return clinvarSignificanceMapping[input]
  } else {
    return -4
  }
}

/* Compute color for each point */
const markerColor = (value: number) => {
  if (value === 2) {
    return 'red'
  } else if (value === 1) {
    return 'orange'
  } else if (value === 0) {
    return 'yellow'
  } else if (value === -1) {
    return 'lightgreen'
  } else if (value === -2) {
    return 'green'
  } else {
    return 'grey'
  }
}

const plotlyData = computed<PlotlyData[]>(() => {
  if (!props.clinvar) {
    return []
  }

  let clinvarInfo = []
  for (const item of props.clinvar.variants) {
    if (item.genomeRelease.toLowerCase() == props.genomeBuild) {
      clinvarInfo = item.variants
    }
  }

  return clinvarInfo.map((variant: ClinvarVariant) => ({
    x: variant.start,
    y: convertClinvarSignificance(variant.referenceAssertions[0].clinicalSignificance)
  }))
})

const trace1 = {
  uid: 'fc47f27b-f3b0-4d31-8dac-9782780ba6b8',
  mode: 'markers',
  type: 'scatter',
  xsrc: 'caiotaniguchi:3:45beec',
  x: plotlyData.value ? plotlyData.value.map((item) => item.x) : [],
  ysrc: 'caiotaniguchi:3:9f1314',
  y: plotlyData.value ? plotlyData.value.map((item) => item.y) : [],
  marker: {
    color: plotlyData.value ? plotlyData.value.map((item) => markerColor(item.y)) : [],
    size: 10
  },
  scaleanchor: 'y'
}

const data = [trace1]

const lollipopSticks = computed(() => {
  if (!props.clinvar) {
    return []
  }
  const sticks = []
  for (const variant of plotlyData.value) {
    sticks.push({
      x0: variant.x,
      x1: variant.x,
      y0: 0,
      y1: variant.y,
      line: {
        color: markerColor(variant.y),
        width: 0.2
      },
      type: 'line',
      xref: 'x',
      yref: 'y'
    })
  }

  return sticks
})

const exons = computed(() => {
  if (!props.transcripts) {
    return []
  }
  const exons = []
  for (const transcript of props.transcripts.transcripts) {
    for (const alignment of transcript.alignments) {
      for (const exon of alignment.exons) {
        exons.push({
          start: exon.ref_start,
          stop: exon.ref_end
        })
      }
    }
  }
  return exons
})

// Horizontal line at y=3
const horizontalLine = {
  type: 'line',
  x0: 0,
  y0: 3,
  x1: 1,
  y1: 3,
  xref: 'paper', // This makes the line span the entire width of the plot area
  yref: 'y',
  line: {
    color: 'grey',
    width: 2
  }
}

// Grey rectangles for exons
const exonShapes = exons.value.map((exon) => ({
  type: 'rect',
  x0: exon.start,
  x1: exon.stop,
  y0: 2.9, // Slightly below y=3 for visualization
  y1: 3.1, // Slightly above y=3 for visualization
  xref: 'x',
  yref: 'y',
  fillcolor: 'grey',
  line: {
    width: 0
  }
}))

const layout = {
  title: 'Variation Landscape',
  xaxis: {
    type: 'linear',
    autorange: true
  },
  yaxis: {
    type: 'linear',
    autorange: false,
    range: [-3.5, 3.5],
    tickvals: [3, 2, 1, 0, -1, -2, -3],
    ticktext: [
      'Exons',
      'Pathogenic',
      'Likely pathogenic',
      'Uncertain significance',
      'Likely benign',
      'Benign',
      'Unknown'
    ],
    fixedrange: true
  },
  shapes: [...lollipopSticks.value, ...exonShapes, horizontalLine],
  autosize: true,
  margin: {
    l: 150,
    r: 50,
    b: 50,
    t: 50,
    pad: 4
  }
}

// Watch when myDiv is mounted
watch(
  () => document.getElementById('myDiv'),
  (newVal) => {
    if (newVal) {
      Plotly.newPlot('myDiv', data, layout, { scrollZoom: true })
    }
  }
)

onMounted(() => {
  Plotly.newPlot('myDiv', data, layout, { scrollZoom: true })
})
</script>

<template>
  <div class="pt-3">
    <template v-if="!clinvar">
      <v-skeleton-loader class="mt-3 mx-auto border" type="text,image,text" />
    </template>
    <v-sheet v-else color="background" class="pa-3 mt-3 h-100">
      <div id="myDiv"></div>
    </v-sheet>
  </div>
</template>
