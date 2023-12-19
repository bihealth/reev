<script setup lang="ts">
import { ref } from 'vue'

import DocsLink from '@/components/DocsLink.vue'
import { type Seqvar } from '@/lib/genomicVars'

interface Props {
  seqvar?: Seqvar
}

const props = defineProps<Props>()

const beaconAddress = ref('')

const loadBeacon = () => {
  if (!props.seqvar) {
    return
  }
  beaconAddress.value =
    'https://beacon-network.org:443/#/widget?rs=' +
    props.seqvar.genomeBuild +
    '&chrom=' +
    props.seqvar.chrom +
    '&pos=' +
    props.seqvar.pos +
    '&ref=' +
    props.seqvar.del +
    '&allele=' +
    props.seqvar.ins
}
</script>

<template>
  <v-card>
    <v-card-title class="pb-0 pr-2">
      Beacon Network
      <DocsLink anchor="variant-tools" />
    </v-card-title>
    <v-card-subtitle class="text-overline">
      Lookup Variant in GA4GH Beacon Network
    </v-card-subtitle>
    <v-card-text v-if="beaconAddress">
      <iframe
        ref="beaconFrame"
        :src="beaconAddress"
        style="width: 100%; height: 300px; overflow: auto; border: 0"
        vspace="0"
        hspace="0"
      />
    </v-card-text>
    <v-card-text v-else>
      <v-btn prepend-icon="mdi-cloud-search" variant="tonal" rounded="sm" @click="loadBeacon()">
        Query Beacon Network
      </v-btn>
    </v-card-text>
  </v-card>
</template>
