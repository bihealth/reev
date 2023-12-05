<script setup lang="ts">
import VariantDetailsFreqsAutosomal from '@/components/SeqvarDetails/FreqsCard/AutosomalFreqs.vue'
import VariantDetailsFreqsMitochondrial from '@/components/SeqvarDetails/FreqsCard/MitochondrialFreqs.vue'
import { isVariantMt } from '@/lib/utils'
import { type SmallVariant } from '@/stores/variantInfo'

const props = defineProps<{
  smallVar: SmallVariant | null
  varAnnos: any | null
}>()

const gnomadExomes = 'gnomad_exomes'
const gnomadGenomes = 'gnomad_genomes'
</script>

<template>
  <v-card>
    <v-card-title class="mb-0">Population Frequencies</v-card-title>
    <v-card-text>
      <VariantDetailsFreqsMitochondrial
        v-if="isVariantMt(props.smallVar)"
        :small-var="props.smallVar"
        :var-annos="props.varAnnos"
      />
      <div v-else>
        <v-row no-gutters>
          <v-col cols="6">
            <VariantDetailsFreqsAutosomal
              :small-var="props.smallVar"
              :var-annos="props.varAnnos"
              :dataset="gnomadExomes"
            />
          </v-col>
          <v-col cols="6">
            <VariantDetailsFreqsAutosomal
              :small-var="props.smallVar"
              :var-annos="props.varAnnos"
              :dataset="gnomadGenomes"
            />
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>
