<script setup lang="ts">
import { isVariantMt } from '@/lib/utils'

import VariantDetailsFreqsAutosomal from '@/components/VariantDetails/FreqsAutosomal.vue'
import VariantDetailsFreqsMitochondrial from '@/components/VariantDetails/FreqsMitochondrial.vue'
import { type SmallVariant } from '@/stores/variantInfo'

const props = defineProps<{
  smallVar: SmallVariant
  varAnnos: any
}>()

const gnomadExomes = 'gnomad_exomes'
const gnomadGenomes = 'gnomad_genomes'
</script>

<template>
  <div>
    <VariantDetailsFreqsMitochondrial
      :small-var="props.smallVar"
      :var-annos="props.varAnnos"
      v-if="isVariantMt(props.smallVar)"
    />
    <div v-else>
      <VariantDetailsFreqsAutosomal
        :small-var="props.smallVar"
        :var-annos="props.varAnnos"
        :dataset="gnomadExomes"
      />
      <v-divider />
      <VariantDetailsFreqsAutosomal
        :small-var="props.smallVar"
        :var-annos="props.varAnnos"
        :dataset="gnomadGenomes"
      />
    </div>
  </div>
</template>
