<script setup lang="ts">
import { computed } from 'vue'

import VegaPlot from '@/components/VegaPlot.vue'

export interface Props {
  /** Gene information from annonars. */
  clinvar: any
  /** Transctipts information. */
  transcripts: any
  /** The genome release. */
  genomeRelease: string
  /** The gene HGNC symbol. */
  hgnc: string
}

const props = withDefaults(defineProps<Props>(), {
  clinvar: null,
  transcripts: null,
  genomeRelease: 'grch37',
  hgnc: ''
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

const convertClinvarSignificance = (input: string): number => {
  if (input in clinvarSignificanceMapping) {
    return clinvarSignificanceMapping[input]
  } else {
    return -4
  }
}

const minMax = computed(() => {
  if (!props.clinvar) {
    return []
  }
  let min = null
  let max = null
  for (const item of props.clinvar.variants ?? []) {
    if (item.genomeRelease.toLowerCase() == props.genomeRelease) {
      // Go through all item.variants and find the min and max pos.
      for (const variant of item.variants) {
        if (variant.start < min || min === null) {
          min = variant.start
        }
        if (variant.start > max || max === null) {
          max = variant.start
        }
      }
    }
  }
  for (const exon of exons.value) {
    if (exon.start < min || min === null) {
      min = exon.start
    }
    if (exon.stop > max || max === null) {
      max = exon.stop
    }
  }
  const totalLength = max - min
  const padding = Math.round(totalLength * 0.05)
  return [min - padding, max + padding]
})

const paddedMinMax = computed(() => {
  let [min, max] = minMax.value
  const totalLength = max - min
  const padding = Math.round(totalLength * 0.05)
  return [min - padding, max + padding]
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

const vegaData = computed(() => {
  if (!props.clinvar) {
    return []
  }
  let clinvarInfo = []
  for (const item of props.clinvar.variants ?? []) {
    if (item.genomeRelease.toLowerCase() == props.genomeRelease) {
      clinvarInfo = item.variants
    }
  }

  return clinvarInfo.map((variant: ClinvarVariant) => ({
    pos: variant.start,
    clinsig: convertClinvarSignificance(variant.referenceAssertions[0].clinicalSignificance)
  }))
})

const vegaEncoding = {}

const vegaLayer = [
  {
    description: 'gray baseline',
    data: { values: [{}] },
    mark: { type: 'rule', stroke: 'lightgray', size: 3 },
    encoding: { y: { datum: 'Uncertain significance' } }
  },
  {
    description: 'lollipop heads',
    transform: [
      {
        lookup: 'clinsig',
        from: {
          data: {
            values: [
              { clinsig: -5, clinsigLabel: 'other' },
              { clinsig: -4, clinsigLabel: 'Not provided' },
              { clinsig: -3, clinsigLabel: 'Conflicting' },
              { clinsig: -2, clinsigLabel: 'Benign' },
              { clinsig: -1, clinsigLabel: 'Likely benign' },
              { clinsig: 0, clinsigLabel: 'Uncertain significance' },
              { clinsig: 1, clinsigLabel: 'Likely pathogenic' },
              { clinsig: 2, clinsigLabel: 'Pathogenic' },
              { clinsig: 3, clinsigLabel: 'Gene' }
            ]
          },
          key: 'clinsig',
          fields: ['clinsigLabel']
        }
      }
    ],
    mark: { type: 'circle', opacity: 0.8 },
    encoding: {
      x: {
        field: 'pos',
        type: 'quantitative',
        scale: { domain: paddedMinMax.value },
        axis: { grid: false, zindex: 1000 },
        title: null
      },
      y: {
        field: 'clinsigLabel',
        type: 'nominal',
        scale: {
          domain: [
            'Gene',
            'Pathogenic',
            'Likely pathogenic',
            'Uncertain significance',
            'Likely benign',
            'Benign'
          ]
        },
        axis: { grid: false },
        title: null
      },
      color: {
        field: 'clinsigLabel',
        type: 'nominal',
        scale: {
          domain: [
            'Gene',
            'Pathogenic',
            'Likely pathogenic',
            'Uncertain significance',
            'Likely benign',
            'Benign'
          ],
          range: ['gray', 'darkred', 'orange', 'yellow', 'green', 'darkgreen']
        },
        legend: null
      },
      size: { value: 100 }
    }
  },
  {
    description: 'lollipop sticks',
    transform: [
      {
        lookup: 'clinsig',
        from: {
          data: {
            values: [
              {
                clinsig: -5,
                clinsigBaseline: 'Uncertain significance',
                clinsigLabel: 'other'
              },
              {
                clinsig: -4,
                clinsigBaseline: 'Uncertain significance',
                clinsigLabel: 'Not provided'
              },
              {
                clinsig: -3,
                clinsigBaseline: 'Uncertain significance',
                clinsigLabel: 'Conflicting'
              },
              {
                clinsig: -2,
                clinsigBaseline: 'Uncertain significance',
                clinsigLabel: 'Benign'
              },
              {
                clinsig: -1,
                clinsigBaseline: 'Uncertain significance',
                clinsigLabel: 'Likely benign'
              },
              {
                clinsig: 0,
                clinsigBaseline: 'Uncertain significance',
                clinsigLabel: 'Uncertain significance'
              },
              {
                clinsig: 1,
                clinsigBaseline: 'Uncertain significance',
                clinsigLabel: 'Likely pathogenic'
              },
              {
                clinsig: 2,
                clinsigBaseline: 'Uncertain significance',
                clinsigLabel: 'Pathogenic'
              },
              {
                clinsig: 3,
                clinsigBaseline: 'Uncertain significance',
                clinsigLabel: 'Gene'
              }
            ]
          },
          key: 'clinsig',
          fields: ['clinsigBaseline', 'clinsigLabel']
        }
      }
    ],
    mark: { type: 'rule', opacity: 0.8 },
    encoding: {
      x: {
        field: 'pos',
        type: 'quantitative',
        scale: { domain: paddedMinMax.value },
        axis: { grid: false },
        title: null
      },
      y: {
        field: 'clinsigLabel',
        type: 'nominal',
        scale: {
          domain: [
            'Gene',
            'Pathogenic',
            'Likely pathogenic',
            'Uncertain significance',
            'Likely benign',
            'Benign'
          ]
        },
        axis: { grid: false, zindex: 1000 },
        title: null
      },
      y2: { field: 'clinsigBaseline' },
      color: {
        field: 'clinsigLabel',
        type: 'nominal',
        scale: {
          domain: [
            'Gene',
            'Pathogenic',
            'Likely pathogenic',
            'Uncertain significance',
            'Likely benign',
            'Benign'
          ],
          range: ['gray', 'darkred', 'orange', 'yellow', 'green', 'darkgreen']
        },
        legend: null
      },
      size: { value: 1 }
    }
  },
  {
    description: 'gene - line',
    data: { values: [{ pos: minMax.value[0] }, { pos: minMax.value[1] }] },
    mark: { type: 'line', stroke: 'black', size: 1, opacity: 0.5 },
    encoding: {
      x: {
        field: 'pos',
        type: 'quantitative',
        scale: { domain: paddedMinMax.value },
        axis: { grid: false },
        title: null
      },
      y: { datum: 'Gene' }
    }
  },
  {
    description: 'gene - exons',
    data: {
      values: exons.value
    },
    mark: {
      type: 'rect',
      stroke: 'black',
      height: 10,
      fill: 'black',
      opacity: 0.5
    },
    encoding: {
      x: {
        field: 'start',
        type: 'quantitative',
        scale: { domain: paddedMinMax.value },
        axis: { grid: false },
        title: null
      },
      x2: { field: 'stop' },
      y: { datum: 'Gene' }
    }
  }
]
</script>

<template>
  <v-card>
    <v-card-title> ClinVar Variation </v-card-title>
    <v-divider />
    <figure class="figure border rounded pl-2 pt-2 mr-3 w-100 col">
      <figcaption class="figure-caption text-center">
        Variantion landscape for gene {{ props?.hgnc }}
      </figcaption>
      <VegaPlot
        :data-values="vegaData"
        :encoding="vegaEncoding"
        :layer="vegaLayer"
        :height="300"
        renderer="canvas"
      />
    </figure>
  </v-card>
</template>
