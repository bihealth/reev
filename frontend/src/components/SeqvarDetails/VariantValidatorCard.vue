<script setup lang="ts">
import { ref } from 'vue'

import { API_INTERNAL_BASE_PREFIX } from '@/api/common'
import DocsLink from '@/components/DocsLink.vue'
import { type Seqvar } from '@/lib/genomicVars'

const API_BASE_URL = API_INTERNAL_BASE_PREFIX

enum VariantValidatorStates {
  Initial = 0,
  Running = 1,
  Done = 2,
  Error = 3
}

interface Props {
  seqvar?: Seqvar
}

const props = defineProps<Props>()

const variantValidatorState = ref<VariantValidatorStates>(VariantValidatorStates.Initial)
const variantValidatorResults = ref<any>(null)

const primaryAssemblyLoci = ref<any | null>(null)

const queryVariantValidatorApi = async () => {
  variantValidatorState.value = VariantValidatorStates.Running
  variantValidatorResults.value = null
  primaryAssemblyLoci.value = null
  const url =
    API_BASE_URL +
    `remote/variantvalidator/${props.seqvar?.genomeBuild}/` +
    `${props.seqvar?.chrom}-${props.seqvar?.pos}-` +
    `${props.seqvar?.del}-${props.seqvar?.ins}` +
    `/all?content-type=application%2Fjson`
  const res = await fetch(url)
  if (res.ok) {
    const resObj = await res.json()
    const items = []
    let metadata = null
    for (const key in resObj) {
      const value = resObj[key]
      if (primaryAssemblyLoci.value === null) {
        primaryAssemblyLoci.value = value.primary_assembly_loci
      }
      if (value?.submitted_variant?.length) {
        items.push({
          key,
          value
        })
      } else if (key == 'metadata') {
        metadata = value
      }
    }
    variantValidatorResults.value = { items, metadata }
    variantValidatorState.value = VariantValidatorStates.Done
  } else {
    variantValidatorState.value = VariantValidatorStates.Error
  }
}
</script>

<template>
  <template v-if="!seqvar">
    <v-skeleton-loader type="card" />
  </template>
  <v-card v-else>
    <v-card-title class="pb-0 pr-2">
      Variant Validator
      <DocsLink anchor="variant-validator" />
    </v-card-title>
    <v-card-subtitle class="text-overline">
      Retrieve Predictions from VariantValidator.org
    </v-card-subtitle>
    <v-card-text class="mt-0 pt-0">
      <div v-if="variantValidatorState === VariantValidatorStates.Running">
        <div class="alert alert-info pt-3">
          <v-progress-circular indeterminate class="mr-3" />
          Loading...
        </div>
      </div>
      <template v-else-if="variantValidatorState === VariantValidatorStates.Done">
        <v-list class="d-flex flex-row">
          <v-list-item class="px-0 mr-6">
            <v-list-item-title> VariantValidator HGVS Version </v-list-item-title>
            <v-list-item-subtitle>
              {{ variantValidatorResults.metadata?.variantvalidator_hgvs_version ?? 'N/A' }}
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item class="px-0">
            <v-list-item-title> VariantValidator Version </v-list-item-title>
            <v-list-item-subtitle>
              {{ variantValidatorResults.metadata?.variantvalidator_version ?? 'N/A' }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <div class="text-overline">Transcript Variants</div>

        <v-table density="compact">
          <thead>
            <tr>
              <th class="font-weight-bold">Gene Symbol</th>
              <th class="font-weight-bold">Transcript Variant</th>
              <th class="font-weight-bold">Protein Variant</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="{ key, value } in variantValidatorResults.items" :key="key">
              <td>{{ value.gene_symbol }}</td>
              <td>{{ value.hgvs_transcript_variant }}</td>
              <td>{{ value.hgvs_predicted_protein_consequence?.slr || '&mdash;' }}</td>
            </tr>
          </tbody>
        </v-table>

        <div class="text-overline">Genomic Variants</div>

        <v-table density="compact">
          <thead>
            <tr>
              <th class="font-weight-bold">Variant Description</th>
              <th class="font-weight-bold">VCF Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="primaryAssemblyLoci?.grch37?.hgvs_genomic_description">
              <td>
                {{ primaryAssemblyLoci?.grch37.hgvs_genomic_description }}
              </td>
              <td>
                GRCh37:{{ primaryAssemblyLoci?.grch37?.vcf?.chr }}:{{
                  primaryAssemblyLoci?.grch37?.vcf?.pos
                }}:{{ primaryAssemblyLoci?.grch37?.vcf?.ref }}:{{
                  primaryAssemblyLoci?.grch37?.vcf?.alt
                }}
              </td>
            </tr>
            <tr v-if="primaryAssemblyLoci?.grch38?.hgvs_genomic_description">
              <td>
                {{ primaryAssemblyLoci?.grch38.hgvs_genomic_description }}
              </td>
              <td>
                GRCh38:{{ primaryAssemblyLoci?.grch38?.vcf?.chr }}:{{
                  primaryAssemblyLoci?.grch38?.vcf?.pos
                }}:{{ primaryAssemblyLoci?.grch38?.vcf?.ref }}:{{
                  primaryAssemblyLoci?.grch38?.vcf?.alt
                }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </template>
      <div v-else-if="variantValidatorState === VariantValidatorStates.Error">
        <v-alert color="error" icon="$error" title="Problem Querying VariantValidator.org">
          An error occurred while querying the VariantValidator API. Please try again later.
        </v-alert>
      </div>
      <div class="mt-3">
        <v-btn
          prepend-icon="mdi-cloud-upload-outline"
          variant="tonal"
          rounded="sm"
          @click="queryVariantValidatorApi()"
        >
          Submit to VariantValidator.org
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.variant-validator-result-tab {
  float: left;
}
</style>
