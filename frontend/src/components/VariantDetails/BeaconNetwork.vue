<script setup lang="ts">
import { ref } from 'vue'

import { type SmallVariant } from '@/stores/variantInfo'

const props = defineProps({
  smallVariant: Object as () => SmallVariant | undefined
})

const beaconAddress = ref('')

const loadBeacon = () => {
  if (!props.smallVariant) {
    return
  }
  beaconAddress.value =
    'https://beacon-network.org:443/#/widget?rs=' +
    props.smallVariant.release +
    '&chrom=' +
    props.smallVariant.chromosome +
    '&pos=' +
    props.smallVariant.start +
    '&ref=' +
    props.smallVariant.reference +
    '&allele=' +
    props.smallVariant.alternative
}
</script>

<template>
  <v-card>
    <v-card-title>Beacon Network</v-card-title>
    <v-divider />
    <v-card-text v-if="beaconAddress">
      <iframe
        ref="beaconFrame"
        :src="beaconAddress"
        style="width: 100%; height: 300px; overflow: auto; border: 0"
        vspace="0"
        hspace="0"
      >
      </iframe>
    </v-card-text>
    <v-card-actions v-else>
      <v-card-title>
        <v-btn prepend-icon="mdi-refresh" style="float: right" @click="loadBeacon()">
          Query Beacon
        </v-btn>
      </v-card-title>
    </v-card-actions>
  </v-card>
</template>
