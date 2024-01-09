<script setup lang="ts">
import { computed } from 'vue'

import DocsLink from '@/components/DocsLink.vue'
import type { GenomeBuild } from '@/lib/genomeBuilds'
import { type Strucvar } from '@/lib/genomicVars'

/** Type for this component's props. */
export interface Props {
  genomeBuild?: GenomeBuild
  // eslint-disable-next-line vue/require-default-prop
  strucvar?: Strucvar
}

/** The component's props, fallback for genome build is GRCh37. */
const props = withDefaults(defineProps<Props>(), {
  genomeBuild: 'grch37'
})

const ucscLinkout = computed((): string => {
  if (!props.strucvar) {
    return '#'
  }
  const db = props.genomeBuild === 'grch37' ? 'hg19' : 'hg38'
  return (
    `https://genome-euro.ucsc.edu/cgi-bin/hgTracks?db=${db}&position=` +
    `${props.strucvar.chrom}:${props.strucvar.start}-` +
    `${props.strucvar.stop}`
  )
})

const ensemblLinkout = computed((): string => {
  if (!props.strucvar) {
    return '#'
  }
  const loc = `${props.strucvar.chrom}:${props.strucvar.start}-${props.strucvar.stop}`
  if (props.genomeBuild === 'grch37') {
    return `https://grch37.ensembl.org/Homo_sapiens/Location/View?r=${loc}`
  } else if (props.genomeBuild === 'grch38') {
    return `https://ensembl.org/Homo_sapiens/Location/View?r=${loc}`
  }
  return '#'
})

const dgvLinkout = computed((): string => {
  if (!props.strucvar) {
    return '#'
  }
  const db = props.genomeBuild === 'grch37' ? 'hg19' : 'hg38'
  return (
    `http://dgv.tcag.ca/gb2/gbrowse/dgv2_${db}/?name=${props.strucvar.chrom}:` +
    `${props.strucvar.start}-${props.strucvar.stop};search=Search`
  )
})

const gnomadLinkout = computed((): string => {
  if (!props.strucvar) {
    return '#'
  }
  const dataset = props.genomeBuild === 'grch37' ? 'gnomad_r2_1' : 'gnomad_r3'
  return (
    `https://gnomad.broadinstitute.org/region/${props.strucvar.chrom}:` +
    `${props.strucvar.start}-${props.strucvar.stop}?dataset=${dataset}`
  )
})

const varsomeLinkout = computed((): string => {
  if (!props.strucvar) {
    return '#'
  }
  const urlRelease = props.genomeBuild === 'grch37' ? 'hg19' : 'hg38'
  const chrom = props.strucvar.chrom.startsWith('chr')
    ? props.strucvar.chrom
    : `chr${props.strucvar.chrom}`
  return `https://varsome.com/cnv/${urlRelease}/${chrom}:${props.strucvar.start}:${props.strucvar.stop}:${props.strucvar.svType}`
})

const franklinLinkout = computed((): string => {
  if (!props.strucvar) {
    return '#'
  }
  const { chrom, start, stop, svType } = props.strucvar
  const urlRelease = props.genomeBuild === 'grch37' ? 'hg19' : 'hg38'
  return `https://franklin.genoox.com/clinical-db/variant/sv/chr${chrom}-${start}-${stop}-${svType}-${urlRelease}`
})

const jumpToLocus = async () => {
  const chrPrefixed = props.strucvar?.chrom.startsWith('chr')
    ? props.strucvar?.chrom
    : `chr${props.strucvar?.chrom}`
  // NB: we allow the call to fetch here as it goes to local IGV.
  await fetch(
    `http://127.0.0.1:60151/goto?locus=${chrPrefixed}:${props.strucvar?.start}-${props.strucvar?.stop}`
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
    { label: 'genoox Franklin', href: franklinLinkout.value }
  ]
})
</script>

<template>
  <v-card class="mt-3">
    <v-card-title class="pb-0 pr-2">
      Variant Tools
      <DocsLink anchor="clinvar-information" />
    </v-card-title>

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
      <v-btn prepend-icon="mdi-launch" @click.prevent="jumpToLocus()"> Jump in Local IGV </v-btn>
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
