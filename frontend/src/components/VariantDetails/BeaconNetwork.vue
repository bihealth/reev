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
    <v-card-subtitle>
      Query Beacon -----|>
      <v-btn prepend-icon="mdi-refresh" style="float: right" @click="loadBeacon()"> Load </v-btn>
    </v-card-subtitle>
    <v-divider />
    <v-card-text>
      <iframe
        v-if="beaconAddress"
        ref="beaconFrame"
        :src="beaconAddress"
        style="width: 100%; height: 300px; overflow: auto; border: 0"
        vspace="0"
        hspace="0"
      >
      </iframe>
      <p v-else class="text-muted text-center">
        <i>Click</i>&nbsp;
        <span>
          <v-icon>mdi-refresh</v-icon>
          Load
        </span>
        <i>
          button to submit the variant to the GA4GH Beacon network. The results will appear here.
        </i>
      </p>
    </v-card-text></v-card
  >
</template>
