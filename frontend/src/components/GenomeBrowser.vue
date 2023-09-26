<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import igv from 'igv'

// import { genCaseTrack, publicTracks } from '@/components/GenomeBrowser.tracks'

/** Alias for Genome Browser type. */
type GenomeBrowser = any

// Define the props.
const props = defineProps({
  // Case UUID
  caseUuid: String,
  // Genome build, e.g., "hg19" or "b37"
  genome: String,
  // Locus to go to, e.g., "chr1:1,900,000-2,000,000"
  locus: String
})

// The <div> to show the browser in.
const genomeBrowserDivRef = ref(null)
// Set on IGV browser creation.
const igvBrowser = ref(null)

const translateGenome = (value: any) => {
  if (value === 'GRCh37') {
    return 'hg19'
  } else if (value === 'GRCh38') {
    return 'b38'
  } else {
    return value
  }
}

// Conditionally add case tracks.
// const addCaseTracks = (browser: GenomeBrowser) => {
//   if (props.caseUuid) {
//     console.log(genCaseTrack(props.caseUuid))
//     browser.loadTrack(genCaseTrack(props.caseUuid))
//   }
// }

// Add all tracks.
// const addTracks = (browser: any) => {
//   addCaseTracks(browser)
//   for (const track of publicTracks) {
//     browser.loadTrack(track)
//   }
// }

// Watch changes to the genome (requires full reload).
watch(
  () => props.genome,
  () => {
    igvBrowser.value?.loadGenome(translateGenome(props.genome)).then((browser: GenomeBrowser) => {
      browser.search(props.locus)
    })
    // .then((browser: GenomeBrowser) => {
    // addTracks(browser)
    // })
  }
)

// Watch changes to the case (requires track reload).
watch(
  () => props.caseUuid,
  () => {
    if (igvBrowser.value) {
      igvBrowser.value.removeTrackByName('Case SVs')
      // addCaseTracks(igvBrowser.value)
    }
  }
)

// Watch changes to the locus (jumping is enough).
watch(
  () => props.locus,
  () => {
    if (igvBrowser.value) {
      igvBrowser.value.search(props.locus)
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
      // addTracks(browser)
      if (props.locus) {
        igvBrowser.value?.search(props.locus)
      }
    })
})
</script>

<template>
  <div ref="genomeBrowserDivRef"></div>
</template>
