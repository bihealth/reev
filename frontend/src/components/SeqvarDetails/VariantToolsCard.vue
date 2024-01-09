<script setup lang="ts">
import { computed } from 'vue'

import DocsLink from '@/components/DocsLink.vue'
import { type Seqvar } from '@/lib/genomicVars'

export interface Props {
  seqvar?: Seqvar
  varAnnos?: any
}

const props = defineProps<Props>()

const ucscLinkout = computed((): string => {
  if (!props.seqvar) {
    return '#'
  }
  const db = props.seqvar.genomeBuild === 'grch37' ? 'hg19' : 'hg38'
  return (
    `https://genome-euro.ucsc.edu/cgi-bin/hgTracks?db=${db}&position=` +
    `${props.seqvar.chrom}:${props.seqvar.pos}-` +
    `${props.seqvar.pos + props.seqvar.del.length}`
  )
})

const ensemblLinkout = computed((): string => {
  if (!props.seqvar) {
    return '#'
  }
  const loc = `${props.seqvar.chrom}:${props.seqvar.pos}-${
    props.seqvar.pos + props.seqvar.del.length
  }`
  if (props.seqvar.genomeBuild === 'grch37') {
    return `https://grch37.ensembl.org/Homo_sapiens/Location/View?r=${loc}`
  } else if (props.seqvar.genomeBuild === 'grch38') {
    return `https://ensembl.org/Homo_sapiens/Location/View?r=${loc}`
  }
  return '#'
})

const dgvLinkout = computed((): string => {
  if (!props.seqvar) {
    return '#'
  }
  const db = props.seqvar.genomeBuild === 'grch37' ? 'hg19' : 'hg38'
  return (
    `http://dgv.tcag.ca/gb2/gbrowse/dgv2_${db}/?name=${props.seqvar.chrom}:` +
    `${props.seqvar.pos}-${props.seqvar.pos + props.seqvar.del.length};search=Search`
  )
})

const gnomadLinkout = computed((): string => {
  if (!props.seqvar) {
    return '#'
  }
  const dataset = props.seqvar.genomeBuild === 'grch37' ? 'gnomad_r2_1' : 'gnomad_r3'
  return (
    `https://gnomad.broadinstitute.org/region/${props.seqvar.chrom}:` +
    `${props.seqvar.pos}-${props.seqvar.pos + props.seqvar.del.length}?dataset=${dataset}`
  )
})

const mt85Linkout = computed((): string => {
  if (!props.seqvar) {
    return '#'
  }
  if (props.seqvar.genomeBuild === 'grch37') {
    return (
      `https://www.genecascade.org/MT85/ChrPos85.cgi?chromosome=${props.seqvar.chrom}` +
      `&position=${props.seqvar.pos}&ref=${props.seqvar.del}&alt=${props.seqvar.ins}`
    )
  } else {
    return ''
  }
})

const mt2021Linkout = computed((): string => {
  if (!props.seqvar) {
    return '#'
  }
  if (props.seqvar.genomeBuild === 'grch37') {
    return (
      `https://www.genecascade.org/MTc2021/ChrPos102.cgi?chromosome=${props.seqvar.chrom}` +
      `&position=${props.seqvar.pos}&ref=${props.seqvar.del}&alt=${props.seqvar.ins}`
    )
  } else {
    return ''
  }
})

const varsomeLinkout = computed((): string => {
  if (!props.seqvar) {
    return '#'
  }
  const urlRelease = props.seqvar.genomeBuild === 'grch37' ? 'hg19' : 'hg38'
  const chrom = props.seqvar.chrom.startsWith('chr')
    ? props.seqvar.chrom
    : `chr${props.seqvar.chrom}`
  return (
    `https://varsome.com/variant/${urlRelease}/${chrom}:${props.seqvar.pos}:` +
    `${props.seqvar.del}:${props.seqvar.ins}`
  )
})

const franklinLinkout = computed((): string => {
  if (!props.seqvar) {
    return '#'
  }
  const { chrom, pos, del, ins } = props.seqvar
  const urlRelease = props.seqvar.genomeBuild === 'grch37' ? 'hg19' : 'hg38'
  return `https://franklin.genoox.com/clinical-db/variant/snp/chr${chrom.replace(
    'chr',
    ''
  )}-${pos}-${del}-${ins}-${urlRelease}`
})

const jumpToLocus = async () => {
  const chrPrefixed = props.seqvar?.chrom.startsWith('chr')
    ? props.seqvar?.chrom
    : `chr${props.seqvar?.chrom}`
  // NB: we allow the call to fetch here as it goes to local IGV.
  await fetch(
    `http://127.0.0.1:60151/goto?locus=${chrPrefixed}:${props.seqvar?.pos}-${
      (props.seqvar?.pos ?? 0) + (props.seqvar?.del?.length ?? 0)
    }`
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
    { label: 'MutationTaster 85', href: mt85Linkout.value },
    { label: 'MutationTaster 2021', href: mt2021Linkout.value }
  ]
})
</script>

<template>
  <v-card>
    <v-card-title class="pb-0 pr-2">
      Variant Tools
      <DocsLink anchor="variant-tools" />
    </v-card-title>

    <v-card-subtitle class="text-overline"> Genome Browsers </v-card-subtitle>
    <v-card-text class="pt-3">
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
    <v-card-text class="pt-3">
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
