<script setup lang="ts">
import { useSvInfoStore } from '@/stores/svInfo'

const svInfoStore = useSvInfoStore()

const vcvUrl = (vcv: string): string => {
  const stripped = vcv.replace(/^VCV0+/, '')
  return `https://www.ncbi.nlm.nih.gov/clinvar/variation/${stripped}/`
}
</script>

<template>
  <div>
    <template v-if="svInfoStore.currentSvRecord?.payload?.clinvar_ovl_vcvs?.length">
      <p>The following overlapping SVs are flagged as (likely) pathogenic in ClinVar.</p>

      <ul>
        <li v-for="vcv in svInfoStore.currentSvRecord?.payload?.clinvar_ovl_vcvs ?? []" :key="vcv">
          <a :href="vcvUrl(vcv)">
            {{ vcv }}
          </a>
        </li>
      </ul>
    </template>
    <template v-else>
      <div class="text-muted text-center font-italic">
        SV has not been annotated with (likely) pathogenic ClinVar SV records.
      </div>
    </template>
  </div>
</template>
