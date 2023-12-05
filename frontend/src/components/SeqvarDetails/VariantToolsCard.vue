<script setup lang="ts">
import { computed } from 'vue'

import { type SmallVariant } from '@/stores/variantInfo'

export interface Props {
  smallVar: SmallVariant | null
  varAnnos: any
}

const props = withDefaults(defineProps<Props>(), {
  smallVar: null,
  varAnnos: null
})

const ucscLinkout = computed((): string => {
  if (!props.smallVar) {
    return '#'
  }
  const db = props.smallVar.release === 'grch37' ? 'hg19' : 'hg38'
  return (
    `https://genome-euro.ucsc.edu/cgi-bin/hgTracks?db=${db}&position=` +
    `${props.smallVar.chromosome}:${props.smallVar.start}-` +
    `${props.smallVar.end}`
  )
})

const ensemblLinkout = computed((): string => {
  if (!props.smallVar) {
    return '#'
  }
  const loc = `${props.smallVar.chromosome}:${props.smallVar.start}-${props.smallVar.end}`
  if (props.smallVar.release === 'grch37') {
    return `https://grch37.ensembl.org/Homo_sapiens/Location/View?r=${loc}`
  } else if (props.smallVar.release === 'grch38') {
    return `https://ensembl.org/Homo_sapiens/Location/View?r=${loc}`
  }
  return '#'
})

const dgvLinkout = computed((): string => {
  if (!props.smallVar) {
    return '#'
  }
  const db = props.smallVar.release === 'grch37' ? 'hg19' : 'hg38'
  return (
    `http://dgv.tcag.ca/gb2/gbrowse/dgv2_${db}/?name=${props.smallVar.chromosome}:` +
    `${props.smallVar.start}-${props.smallVar.end};search=Search`
  )
})

const gnomadLinkout = computed((): string => {
  if (!props.smallVar) {
    return '#'
  }
  const dataset = props.smallVar.release === 'grch37' ? 'gnomad_r2_1' : 'gnomad_r3'
  return (
    `https://gnomad.broadinstitute.org/region/${props.smallVar.chromosome}:` +
    `${props.smallVar.start}-${props.smallVar.end}?dataset=${dataset}`
  )
})

const mt85Linkout = computed((): string => {
  if (!props.smallVar) {
    return '#'
  }
  if (props.smallVar.release === 'grch37') {
    return (
      `https://www.genecascade.org/MT85/ChrPos85.cgi?chromosome=${props.smallVar.chromosome}` +
      `&position=${props.smallVar.start}&ref=${props.smallVar.reference}&alt=${props.smallVar.alternative}`
    )
  } else {
    return ''
  }
})

const mt2021Linkout = computed((): string => {
  if (!props.smallVar) {
    return '#'
  }
  if (props.smallVar.release === 'grch37') {
    return (
      `https://www.genecascade.org/MTc2021/ChrPos102.cgi?chromosome=${props.smallVar.chromosome}` +
      `&position=${props.smallVar.start}&ref=${props.smallVar.reference}&alt=${props.smallVar.alternative}`
    )
  } else {
    return ''
  }
})

const varsomeLinkout = computed((): string => {
  if (!props.smallVar) {
    return '#'
  }
  const urlRelease = props.smallVar.release === 'grch37' ? 'hg19' : 'hg38'
  const chrom = props.smallVar.chromosome.startsWith('chr')
    ? props.smallVar.chromosome
    : `chr${props.smallVar.chromosome}`
  return (
    `https://varsome.com/variant/${urlRelease}/${chrom}:${props.smallVar.start}:` +
    `${props.smallVar.reference}:${props.smallVar.alternative}`
  )
})

const franklinLinkout = computed((): string => {
  if (!props.smallVar) {
    return '#'
  }
  const { chromosome, start, reference, alternative } = props.smallVar
  const urlRelease = props.smallVar.release === 'grch37' ? 'hg19' : 'hg38'
  return `https://franklin.genoox.com/clinical-db/variant/snp/chr${chromosome.replace(
    'chr',
    ''
  )}-${start}-${reference}-${alternative}-${urlRelease}`
})

const jumpToLocus = async () => {
  const chrPrefixed = props.smallVar?.chromosome.startsWith('chr')
    ? props.smallVar?.chromosome
    : `chr${props.smallVar?.chromosome}`
  await fetch(
    `http://127.0.0.1:60151/goto?locus=${chrPrefixed}:${props.smallVar?.start}-${props.smallVar?.end}`
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
    <v-card-title class="pb-0"> Variant Tools </v-card-title>

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
