<script setup lang="ts">
import { computed } from 'vue'

import { type SvRecord } from '@/stores/svInfo'

export interface Props {
  genomeRelease: 'grch37' | 'grch38'
  svRecord: SvRecord | null
}

const props = withDefaults(defineProps<Props>(), {
  svRecord: null
})

const ucscLinkout = computed((): string => {
  if (!props.svRecord) {
    return '#'
  }
  const db = props.genomeRelease === 'grch37' ? 'hg19' : 'hg38'
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
  if (props.genomeRelease === 'grch37') {
    return `https://grch37.ensembl.org/Homo_sapiens/Location/View?r=${loc}`
  } else if (props.genomeRelease === 'grch38') {
    return `https://ensembl.org/Homo_sapiens/Location/View?r=${loc}`
  }
  return '#'
})

const dgvLinkout = computed((): string => {
  if (!props.svRecord) {
    return '#'
  }
  const db = props.genomeRelease === 'grch37' ? 'hg19' : 'hg38'
  return (
    `http://dgv.tcag.ca/gb2/gbrowse/dgv2_${db}/?name=${props.svRecord.chromosome}:` +
    `${props.svRecord.start}-${props.svRecord.end};search=Search`
  )
})

const gnomadLinkout = computed((): string => {
  if (!props.svRecord) {
    return '#'
  }
  const dataset = props.genomeRelease === 'grch37' ? 'gnomad_r2_1' : 'gnomad_r3'
  return (
    `https://gnomad.broadinstitute.org/region/${props.svRecord.chromosome}:` +
    `${props.svRecord.start}-${props.svRecord.end}?dataset=${dataset}`
  )
})

const varsomeLinkout = computed((): string => {
  if (!props.svRecord) {
    return '#'
  }
  const urlRelease = props.genomeRelease === 'grch37' ? 'hg19' : 'hg38'
  const chrom = props.svRecord.chromosome.startsWith('chr')
    ? props.svRecord.chromosome
    : `chr${props.svRecord.chromosome}`
  return `https://varsome.com/cnv/${urlRelease}/${chrom}:${props.svRecord.start}:${props.svRecord.end}:${props.svRecord.svType}`
})

const franklinLinkout = computed((): string => {
  if (!props.svRecord) {
    return '#'
  }
  const { chromosome, start, end, svType } = props.svRecord;
  const urlRelease = props.genomeRelease === 'grch37' ? 'hg19' : 'hg38'
  return `https://franklin.genoox.com/clinical-db/variant/sv/chr${chromosome.replace('chr', '')}-${start}-${end}-${svType}-${urlRelease}`
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

interface Linkout {
  href: string
  label: string
}

const genomeBrowsers = computed<Linkout[]>(() => {
  return [
    { label: 'ENSEMBL', href: ensemblLinkout.value },
    { label: 'UCSC', href: ucscLinkout.value }
  ]
})

const resources = computed<Linkout[]>(() => {
  return [
    { label: 'DGV', href: dgvLinkout.value },
    { label: 'gnomAD', href: gnomadLinkout.value },
    { label: 'varsome', href: varsomeLinkout.value },
    { label: 'genoox Franklin', href: franklinLinkout.value },
  ]
})
</script>

<template>
  <v-card class="mt-3" id="strucvar-tools">
    <v-card-title class="pb-0"> Variant Tools </v-card-title>

    <v-card-subtitle class="text-overline"> Genome Browsers </v-card-subtitle>
    <v-card-text>
      <v-btn
        v-for="linkout in genomeBrowsers"
        :key="linkout.label"
        :href="linkout.href"
        target="_blank"
        prepend-icon="mdi-launch"
        variant="tonal"
        rounded="sm"
        class="mr-2"
      >
        {{ linkout.label }}
      </v-btn>
    </v-card-text>

    <v-card-subtitle class="text-overline"> Other Resources </v-card-subtitle>
    <v-card-text>
      <v-btn
        v-for="linkout in resources"
        :key="linkout.label"
        :href="linkout.href"
        target="_blank"
        prepend-icon="mdi-launch"
        variant="tonal"
        rounded="sm"
        class="mr-2"
      >
        {{ linkout.label }}
      </v-btn>
    </v-card-text>

    <v-card-actions>
      <v-btn @click.prevent="jumpToLocus()" prepend-icon="mdi-launch"> Jump in Local IGV </v-btn>
    </v-card-actions>
  </v-card>
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
