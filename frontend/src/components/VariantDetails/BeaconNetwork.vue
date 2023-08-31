<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  smallVariant: Object
})

const beaconAddress = ref('')

const loadBeacon = () => {
  if (!props.smallVariant) {
    return
  }
  beaconAddress.value =
    'https://beacon-network.org:443/#/widget?rs=' +
    props.smallVariant.genome_release +
    '&chrom=' +
    props.smallVariant.chromosome +
    '&pos=' +
    props.smallVariant.pos +
    '&ref=' +
    props.smallVariant.reference +
    '&allele=' +
    props.smallVariant.alternative
}
</script>

<template>
  <h3>
    Query Beacon -----|>
    <button style="float: right; background-color: greenyellow" class="btn" @click="loadBeacon()">
      <v-icon>mdi-refresh</v-icon>
      Load
    </button>
  </h3>
  <div class="card-body">
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
      <span style="background-color: greenyellow" class="badge badge-warning">
        <v-icon>mdi-refresh</v-icon>
        Load
      </span>
      <i> to submit the variant to the GA4GH Beacon network. The results will appear here. </i>
    </p>
  </div>
</template>
