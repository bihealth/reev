<!--
Display population frequencies.

Note that we do not use VSkelLoader here as this is done in the child
components when necessary.
-->

<script setup lang="ts">
import VariantDetailsFreqsAutosomal from '@/components/SeqvarDetails/FreqsCard/AutosomalFreqs.vue'
import VariantDetailsFreqsMitochondrial from '@/components/SeqvarDetails/FreqsCard/MitochondrialFreqs.vue'
import { type Seqvar } from '@/lib/genomicVars'
import { isVariantMt } from '@/lib/utils'

/** The component's props with defaults applied. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  seqvar?: Seqvar
  varAnnos?: any
}>()
</script>

<template>
  <v-card>
    <v-card-title class="mb-0">Population Frequencies</v-card-title>
    <v-card-text>
      <VariantDetailsFreqsMitochondrial
        v-if="isVariantMt(seqvar as Seqvar)"
        :seqvar="seqvar"
        :var-annos="varAnnos"
      />
      <div v-else>
        <v-row no-gutters>
          <v-col cols="6">
            <VariantDetailsFreqsAutosomal
              :seqvar="seqvar"
              :var-annos="varAnnos"
              dataset="gnomad_exomes"
            />
          </v-col>
          <v-col cols="6">
            <VariantDetailsFreqsAutosomal
              :seqvar="seqvar"
              :var-annos="varAnnos"
              dataset="gnomad_genomes"
            />
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>
