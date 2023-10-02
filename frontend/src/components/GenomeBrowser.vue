<script setup lang="ts">
import igv from 'igv'
import { onMounted, ref, watch } from 'vue'

import { publicTracks } from '@/lib/genomeBrowserTracks'

/** Alias for Genome Browser type. */
type GenomeBrowser = any

export interface Props {
  // Genome build, e.g., "hg19" or "b37"
  genome: string
  // Locus to go to, e.g., "chr1:1,900,000-2,000,000"
  locus: string
}

// Define the props.
const props = defineProps<Props>()

/** The <div> to show the browser in. */
const genomeBrowserDivRef = ref(null)
/** Set on IGV browser creation. */
const igvBrowser = ref(null)

/**
 * Translate genome build names from GRCh37/GRCh38 to hg19/hg38.
 *
 * @param value The genome build name.
 * @returns The translated genome build name. (hg19/hg38)
 */
const translateGenome = (value: any) => {
  if (value === 'GRCh37') {
    return 'hg19'
  } else if (value === 'GRCh38') {
    return 'hg38'
  } else {
    return value
  }
}

/**
 * Add public tracks.
 *
 * @param browser The IGV browser.
 */
const addTracks = (browser: any) => {
  for (const track of publicTracks) {
    browser.loadTrack(track)
  }
}

// Watch changes to the genome (requires full reload).
watch(
  () => props.genome,
  () => {
    ;(igvBrowser.value! as GenomeBrowser)
      .loadGenome(translateGenome(props.genome))
      .then((browser: GenomeBrowser) => {
        browser.search(props.locus)
      })
      .then((browser: GenomeBrowser) => {
        addTracks(browser)
      })
  }
)

// Watch changes to the locus (jumping is enough).
watch(
  () => props.locus,
  () => {
    if (igvBrowser.value) {
      ;(igvBrowser.value! as GenomeBrowser).search(props.locus)
    }
  }
)

// Construct igv.js browser when mounted.
onMounted(() => {
  igv
    .createBrowser(genomeBrowserDivRef.value, {
      genome: translateGenome(props.genome),
      locus: props.locus
    })
    .then((browser: GenomeBrowser) => {
      igvBrowser.value = browser
      addTracks(browser)
      if (props.locus) {
        ;(igvBrowser.value! as GenomeBrowser).search(props.locus)
      }
    })
})
</script>

<template>
  <div ref="genomeBrowserDivRef"></div>
</template>
