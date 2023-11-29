<script setup lang="ts">
import { computed } from 'vue'

import { useSvInfoStore } from '@/stores/svInfo'

interface Props {
  genomeRelease: 'grch37' | 'grch38'
}

const props = defineProps<Props>()

const svInfoStore = useSvInfoStore()

const vcvUrl = (vcv: string): string => {
  const stripped = vcv.replace(/^VCV0+/, '')
  return `https://www.ncbi.nlm.nih.gov/clinvar/variation/${stripped}/`
}

/** Return coordinates for ClinVar link-out */
const clinvarRange = computed<string>(() => {
  if (!props.genomeRelease || !svInfoStore.currentSvRecord) {
    return ''
  }
  const release = props.genomeRelease === 'grch37' ? 'GRCh37' : 'GRCh38'
  const { chromosome, start, end } = svInfoStore.currentSvRecord
  return `${release}:${chromosome.replace('chr', '')}:${start}-${end}`
})
</script>

<template>
  <v-card class="mt-3" id="strucvar-clinvar">
    <v-card-title class="pb-0">
      ClinVar
      <small>
        <a :href="`https://www.ncbi.nlm.nih.gov/clinvar/?term=${clinvarRange}`">
          (see locus
          <v-icon>mdi-launch</v-icon>)
        </a>
      </small>
    </v-card-title>
    <v-card-subtitle class="text-overline"> Matching Variants in ClinVar </v-card-subtitle>
    <v-card-text>
      <template v-if="svInfoStore.currentSvRecord?.payload?.clinvar_ovl_vcvs?.length">
        <p>The following overlapping SVs are flagged as (likely) pathogenic in ClinVar.</p>

        <ul>
          <li
            v-for="vcv in svInfoStore.currentSvRecord?.payload?.clinvar_ovl_vcvs ?? []"
            :key="vcv"
          >
            <a :href="vcvUrl(vcv)">
              {{ vcv }}
            </a>
          </li>
        </ul>
      </template>
      <template v-else>
        <div class="text-center font-italic mt-6 mb-6">
          SV has not been annotated with (likely) pathogenic ClinVar SV records.
        </div>
      </template>
    </v-card-text>
  </v-card>
</template>
