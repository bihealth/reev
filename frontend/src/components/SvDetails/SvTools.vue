<script setup lang="ts">
import { computed } from 'vue'

import { type SvRecord } from '@/stores/svInfo'

export interface Props {
  svRecord: SvRecord | null
}

const props = withDefaults(defineProps<Props>(), {
  svRecord: null
})

const ucscLinkout = computed((): string => {
  if (!props.svRecord) {
    return '#'
  }
  const db = props.svRecord.release === 'grch37' ? 'hg19' : 'hg38'
  return (
    `https://genome-euro.ucsc.edu/cgi-bin/hgTracks?db=${db}&position=` +
    `${props.svRecord.chromosome}:${props.svRecord.start}-` +
    `${props.svRecord.end}`
  )
})

const ensemblLinkout = computed((): string => {
  if (!props.svRecord) {
    return '#'
  }
  const loc = `${props.svRecord.chromosome}:${props.svRecord.start}-${props.svRecord.end}`
  if (props.svRecord.release === 'grch37') {
    return `https://grch37.ensembl.org/Homo_sapiens/Location/View?r=${loc}`
  } else if (props.svRecord.release === 'grch38') {
    return `https://ensembl.org/Homo_sapiens/Location/View?r=${loc}`
  }
  return '#'
})

const dgvLinkout = computed((): string => {
  if (!props.svRecord) {
    return '#'
  }
  const db = props.svRecord.release === 'grch37' ? 'hg19' : 'hg38'
  return (
    `http://dgv.tcag.ca/gb2/gbrowse/dgv2_${db}/?name=${props.svRecord.chromosome}:` +
    `${props.svRecord.start}-${props.svRecord.end};search=Search`
  )
})

const gnomadLinkout = computed((): string => {
  if (!props.svRecord) {
    return '#'
  }
  const dataset = props.svRecord.release === 'grch37' ? 'gnomad_r2_1' : 'gnomad_r3'
  return (
    `https://gnomad.broadinstitute.org/region/${props.svRecord.chromosome}:` +
    `${props.svRecord.start}-${props.svRecord.end}?dataset=${dataset}`
  )
})

const varsomeLinkout = computed((): string => {
  if (!props.svRecord) {
    return '#'
  }
  const urlRelease = props.svRecord.release === 'grch37' ? 'hg19' : 'hg38'
  const chrom = props.svRecord.chromosome.startsWith('chr')
    ? props.svRecord.chromosome
    : `chr${props.svRecord.chromosome}`
  return `https://varsome.com/cnv/${urlRelease}/${chrom}:${props.svRecord.start}:${props.svRecord.end}:${props.svRecord.svType}`
})

const jumpToLocus = async () => {
  const chrPrefixed = props.svRecord?.chromosome.startsWith('chr')
    ? props.svRecord?.chromosome
    : `chr${props.svRecord?.chromosome}`
  await fetch(
    `http://127.0.0.1:60151/goto?locus=${chrPrefixed}:${props.svRecord?.start}-${props.svRecord?.end}`
  ).catch((e) => {
    const msg = "Couldn't connect to IGV. Please make sure IGV is running and try again."
    alert(msg)
    console.error(msg, e)
  })
}
</script>

<template>
  <div>
    <h2>External Resources</h2>
    <div class="external-resource-item">
      <a :href="dgvLinkout" target="_blank">
        <v-icon>mdi-launch</v-icon>
        DGV
      </a>
    </div>
    <div class="external-resource-item">
      <a :href="ensemblLinkout" target="_blank">
        <v-icon>mdi-launch</v-icon>
        ENSEBML
      </a>
    </div>
    <div class="external-resource-item">
      <a :href="gnomadLinkout" target="_blank">
        <v-icon>mdi-launch</v-icon>
        gnomAD
      </a>
    </div>
    <div class="external-resource-item">
      <a :href="ucscLinkout" target="_blank">
        <v-icon>mdi-launch</v-icon>
        UCSC Genome Browser
      </a>
    </div>
    <div class="external-resource-item">
      <a :href="varsomeLinkout" target="_blank">
        <v-icon>mdi-launch</v-icon>
        varsome
      </a>
    </div>
  </div>

  <v-divider />

  <div>
    <h2>IGV</h2>
    <div>
      <div>
        <a href="#" target="_blank" @click.prevent="jumpToLocus()">
          <v-icon>mdi-launch</v-icon>
          Jump to Location in IGV
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.external-resource-item {
  float: left;
  margin-right: 10px;
}

.external-resource-item:last-child {
  float: none;
  margin-right: 0;
}
</style>
