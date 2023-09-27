<script setup lang="ts">
import { ref } from 'vue'
import { API_BASE_PREFIX } from '@/api/common'
import { type SmallVariant } from '@/stores/variantInfo'

const API_BASE_URL = API_BASE_PREFIX

enum VariantValidatorStates {
  Initial = 0,
  Running = 1,
  Done = 2,
  Error = 3
}

const props = defineProps<{
  smallVariant?: SmallVariant
}>()

const variantValidatorState = ref<VariantValidatorStates>(VariantValidatorStates.Initial)
const variantValidatorResults = ref<any>(null)

const queryVariantValidatorApi = async () => {
  variantValidatorResults.value = null
  variantValidatorState.value = VariantValidatorStates.Running
  const url =
    API_BASE_URL +
    `/internal/remote/variantvalidator/${props.smallVariant?.release}/` +
    `${props.smallVariant?.chromosome}-${props.smallVariant?.start}-` +
    `${props.smallVariant?.reference}-${props.smallVariant?.alternative}` +
    `/all?content-type=application%2Fjson`
  const res = await fetch(url)
  if (res.ok) {
    variantValidatorResults.value = await res.json()
    variantValidatorState.value = VariantValidatorStates.Done
  } else {
    variantValidatorState.value = VariantValidatorStates.Error
  }
}

const activeIdentifier = ref<string>('')
</script>

<template>
  <div>
    <p v-if="variantValidatorState === VariantValidatorStates.Done">
      <span v-if="variantValidatorResults.metadata">
        <h3>VariantValidator HGVS Version:</h3>
        <h4>{{ variantValidatorResults.metadata.variantvalidator_hgvs_version }}</h4>
      </span>
      <span v-if="variantValidatorResults.metadata">
        <h3>VariantValidator Version:</h3>
        <h4>{{ variantValidatorResults.metadata.variantvalidator_version }}</h4>
      </span>
    </p>
    <v-divider />
    <div v-if="variantValidatorState === VariantValidatorStates.Done">
      <v-list id="pills-tab">
        <v-list-item
          v-for="(data, identifier, index) in variantValidatorResults"
          :key="index"
          class="variant-validator-result-tab"
        >
          <div v-if="String(identifier) !== 'metadata' && String(identifier) !== 'flag'">
            <v-btn
              :id="'variant-validator-result-' + index + '-tab'"
              :href="'#variant-validator-result-' + index"
              @click="activeIdentifier = String(identifier)"
              :class="{ 'active-tab': String(identifier) === activeIdentifier }"
              >{{ identifier }}</v-btn
            >
          </div>
        </v-list-item>
      </v-list>
      <div class="tab-content">
        <div v-for="(data, identifier, index) in variantValidatorResults" :key="index">
          <v-card
            v-if="String(identifier) !== 'metadata' && String(identifier) !== 'flag'"
            :id="'variant-validator-result-' + index"
            variant="outlined"
            v-show="String(identifier) === activeIdentifier"
          >
            <div v-if="data.validation_warnings && data.validation_warnings.length">
              <v-list>
                <v-list-item v-for="(warning, indexW) in data.validation_warnings" :key="indexW">
                  {{ warning }}
                </v-list-item>
              </v-list>
            </div>
            <v-card-title>Results for {{ identifier }}</v-card-title>
            <v-divider />
            <v-card-subtitle>HGVS-Compliant Variant Descriptions</v-card-subtitle>
            <v-divider />
            <v-table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Variant Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="data.hgvs_transcript_variant && data.hgvs_transcript_variant.length">
                  <td>Transcript <span class="badge badge-dark">:c.</span></td>
                  <td>{{ data.hgvs_transcript_variant }}</td>
                </tr>
                <tr v-if="data.hgvs_refseqgene_variant && data.hgvs_refseqgene_variant.length">
                  <td>RefSeq Gene <span class="badge badge-dark">:g.</span></td>
                  <td>{{ data.hgvs_refseqgene_variant }}</td>
                </tr>
                <tr
                  v-if="data.hgvs_lrg_transcript_variant && data.hgvs_lrg_transcript_variant.length"
                >
                  <td>
                    LRG Transcript
                    <span class="badge badge-dark">:c.</span>
                  </td>
                  <td>{{ data.hgvs_lrg_transcript_variant }}</td>
                </tr>
                <tr v-if="data.hgvs_lrg_variant && data.hgvs_lrg_variant.length">
                  <td>LRG <span class="badge badge-dark">:g.</span></td>
                  <td>{{ data.hgvs_lrg_variant }}</td>
                </tr>
                <tr
                  v-if="
                    data.hgvs_predicted_protein_consequence &&
                    data.hgvs_predicted_protein_consequence.length
                  "
                >
                  <td>Protein <span class="badge badge-dark">:p.</span></td>
                  <td>
                    {{ data.hgvs_predicted_protein_consequence.tlr }}
                  </td>
                </tr>
              </tbody>
            </v-table>

            <v-divider />
            <v-card-subtitle>Genomic Variants</v-card-subtitle>
            <v-divider />
            <v-table>
              <thead>
                <tr>
                  <th>Variant Description</th>
                  <th>VCF Description</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-if="
                    data.primary_assembly_loci &&
                    data.primary_assembly_loci.grch37 &&
                    data.primary_assembly_loci.grch37.hgvs_genomic_description
                  "
                >
                  <td>
                    {{ data.primary_assembly_loci.grch37.hgvs_genomic_description }}
                  </td>
                  <td>
                    GRCh37:{{ data.primary_assembly_loci.grch37?.vcf?.chr }}:{{
                      data.primary_assembly_loci.grch37?.vcf?.pos
                    }}:{{ data.primary_assembly_loci.grch37?.vcf?.ref }}:{{
                      data.primary_assembly_loci.grch37?.vcf?.alt
                    }}
                  </td>
                </tr>
                <tr
                  v-if="
                    data.primary_assembly_loci &&
                    data.primary_assembly_loci.grch38 &&
                    data.primary_assembly_loci.grch38.hgvs_genomic_description
                  "
                >
                  <td>
                    {{ data.primary_assembly_loci.grch38.hgvs_genomic_description }}
                  </td>
                  <td>
                    GRCh38:{{ data.primary_assembly_loci.grch38?.vcf?.chr }}:{{
                      data.primary_assembly_loci.grch38?.vcf?.pos
                    }}:{{ data.primary_assembly_loci.grch38?.vcf?.ref }}:{{
                      data.primary_assembly_loci.grch38?.vcf?.alt
                    }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </div>
      </div>
    </div>
    <div v-else-if="variantValidatorState === VariantValidatorStates.Running">
      <div class="alert alert-info">
        <v-progress-circular indeterminate></v-progress-circular>
        <strong class="pl-2">Loading ...</strong>
      </div>
    </div>
    <div v-else-if="variantValidatorState === VariantValidatorStates.Error">
      <div class="alert alert-danger">
        <v-icon>mdi-alert-outline</v-icon>
        <strong class="pl-2">Error</strong>
        <p>An error occurred while querying the VariantValidator API. Please try again later.</p>
      </div>
    </div>
    <div v-else>
      <div class="alert alert-secondary text-muted">
        <v-icon>mdi-information-outline</v-icon>
        Click&nbsp;
        <span class="badge badge-primary">
          <v-icon>mdi-cloud-upload-outline</v-icon>
          Submit
        </span>
        to submit the variant to VariantValidator.org. Results will be displayed here.
      </div>
    </div>
    <div class="row">
      <div class="col pr-0 text-right">
        <v-btn prepend-icon="mdi-cloud-upload-outline" @click="queryVariantValidatorApi()">
          Submit
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped>
.variant-validator-result-tab {
  float: left;
}
</style>
