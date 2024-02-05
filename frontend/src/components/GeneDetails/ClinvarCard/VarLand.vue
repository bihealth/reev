<script setup lang="ts">
import Plotly from 'plotly.js-dist-min'
import { computed, onMounted, ref } from 'vue'

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

/** Mapping from clinvar significance to a number. */
const clinvarSignificanceMapping: { [key: string]: number } = {
  CLINICAL_SIGNIFICANCE_UNKNOWN: -3,
  CLINICAL_SIGNIFICANCE_PATHOGENIC: 2,
  CLINICAL_SIGNIFICANCE_LIKELY_PATHOGENIC: 1,
  CLINICAL_SIGNIFICANCE_UNCERTAIN_SIGNIFICANCE: 0,
  CLINICAL_SIGNIFICANCE_LIKELY_BENIGN: -1,
  CLINICAL_SIGNIFICANCE_BENIGN: -2
}

/** Interface for clinvar reference assertions. */
interface ClinvarReferenceAssertions {
  rcv: string
  clinicalSignificance: string
  reviewStatus: string
  title: string
}

/** Interface for clinvar variant. */
interface ClinvarVariant {
  chrom: string
  start: number
  stop: number
  reference: string
  alternative: string
  vcv: string
  referenceAssertions: ClinvarReferenceAssertions[]
}

/** Interface for plotly data point. */
interface PlotlyDataPoint {
  x: number
  y: number
}

/** Interface for downsampled data point. */
interface DownsampledDataPoint {
  x: number
  y: number
  count: number
}

/** The current plot boundaries. */
const currentPlotBoundaries = ref({
  minX: 0,
  maxX: 0
})

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

/** Compute the min and max values for the plot */
const clinvarData = computed<PlotlyDataPoint[]>(() => {
  if (!props.clinvar) {
    return []
  }

  let clinvarInfo = []
  for (const item of props.clinvar.variants) {
    if (item.genomeRelease.toLowerCase() == props.genomeBuild) {
      clinvarInfo = item.variants.sort((a: ClinvarVariant, b: ClinvarVariant) => a.start - b.start)
    }
  }

  // Update plot boundaries
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  currentPlotBoundaries.value = {
    minX: clinvarInfo[0].start,
    maxX: clinvarInfo[clinvarInfo.length - 1].start
  }

  return clinvarInfo.map((variant: ClinvarVariant) => ({
    x: variant.start,
    y: convertClinvarSignificance(variant.referenceAssertions[0].clinicalSignificance)
  }))
})

/** Helper function for downstreaming data.
 * @param data - The data to downsample.
 * @param windowSize - The size of the window to downsample.
 * @returns The downsampled data.
 */
const downsample = (data: PlotlyDataPoint[], windowSize: number): DownsampledDataPoint[] => {
  if (data.length === 0) return []
  // If there are less then 800 variants, do not downsample
  if (data.length < 800) return data.map((item) => ({ x: item.x, y: item.y, count: 1 }))

  const minX = data[0].x
  const maxX = data[data.length - 1].x

  const bins: DownsampledDataPoint[] = []
  for (let x = minX; x <= maxX; x += windowSize) {
    for (let y = -3; y <= 2; y++) {
      bins.push({ x: x + windowSize / 2, y: y, count: 0 })
    }
  }

  data.forEach((point) => {
    const binIndex = Math.floor((point.x - minX) / windowSize)
    const bin = bins[binIndex * 5 + (point.y + 3)]
    bin.count++
  })

  // Return only bins with count > 0
  return bins.filter((bin) => bin.count > 0)
}

/** Downsampled data. */
const plotlyData = computed(() => {
  // If there are less then 800 variants, return the data
  if (clinvarData.value.length < 800) {
    return clinvarData.value
  }

  const windowSize = (currentPlotBoundaries.value.maxX - currentPlotBoundaries.value.minX) / 800
  return downsample(clinvarData.value, windowSize)
  // DEBUG: Uncomment the line below to return the full data and compare with the original plot
  // return clinvarData.value
})

/** Plotly trace */
const trace = {
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

/** Initial Lollipop sticks for each variant */
const initiallollipopSticks = computed(() => {
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

/** Exons for the gene */
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

/** Plot layout */
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
  shapes: [...initiallollipopSticks.value, ...exonShapes, horizontalLine],
  autosize: true,
  margin: {
    l: 150,
    r: 50,
    b: 50,
    t: 50,
    pad: 4
  }
}

/** Method to update plot with new data based on zoom or pan */
const updatePlotData = (minX: number, maxX: number) => {
  // Filter clinvarData for new boundaries and compute new downsampled data
  const windowSize = (maxX - minX) / 800
  const filteredClinvarData = clinvarData.value.filter((item) => item.x >= minX && item.x <= maxX)
  const newDownsampledData = downsample(filteredClinvarData, windowSize)

  trace.x = newDownsampledData.map((item) => item.x)
  trace.y = newDownsampledData.map((item) => item.y)
  trace.marker.color = newDownsampledData.map((item) => markerColor(item.y))

  // Update lollipopSticks
  const newLollipopSticks = []
  for (const variant of newDownsampledData) {
    newLollipopSticks.push({
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
  layout.shapes = [...newLollipopSticks, ...exonShapes, horizontalLine]

  // Re-render plot with new data
  Plotly.react('plot', [trace], layout)
}

onMounted(() => {
  Plotly.newPlot('plot', [trace], layout, { scrollZoom: true }).then(() => {
    // @ts-expect-error Property 'on' seems to exist on type 'HTMLElement'
    document.getElementById('plot')?.on('plotly_relayout', (eventdata: any) => {
      if (eventdata['xaxis.range[0]'] && eventdata['xaxis.range[1]']) {
        // Update plot boundaries based on zoom or pan
        const minX = parseFloat(eventdata['xaxis.range[0]'])
        const maxX = parseFloat(eventdata['xaxis.range[1]'])
        currentPlotBoundaries.value = { minX, maxX }
        updatePlotData(minX, maxX)
      }
    })

    // @ts-expect-error Property 'on' seems to exist on type 'HTMLElement'
    document.getElementById('plot')?.on('plotly_doubleclick', () => {
      const minX = clinvarData.value[0].x
      const maxX = clinvarData.value[clinvarData.value.length - 1].x
      currentPlotBoundaries.value = { minX, maxX }
      updatePlotData(minX, maxX)
    })
  })
})
</script>

<template>
  <div class="pt-3">
    <template v-if="!clinvar">
      <v-skeleton-loader class="mt-3 mx-auto border" type="text,image,text" />
    </template>
    <v-sheet v-else color="background" class="pa-3 mt-3 h-100">
      <div id="plot"></div>
    </v-sheet>
  </div>
</template>
