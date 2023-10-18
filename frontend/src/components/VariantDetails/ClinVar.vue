<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  clinvar: Object
})

const significances = [
  'Pathogenic', // 0
  'Likely pathogenic', // 1
  'Uncertain signifiance', // 2
  'Likely benign', // 3
  'Benign', // 4
  'Other'
]

const review_statuses = [
  'practice guideline', // 0
  'reviewed by expert panel', // 1
  'criteria provided, multiple submitters, no conflicts', // 2
  'criteria provided, single submitter', // 3
  'criteria provided, conflicting interpretations', // 4
  'no assertion criteria provided', // 5
  'no assertion provided', // 6
  'other'
]

const stars = [
  4, // 0 - "practice guideline"
  3, // 1 - "reviewed by expert panel"
  2, // 2 - "criteria provided, multiple submitters, no conflicts"
  1, // 3 - "criteria provided, single submitter"
  1, // 4 - "criteria provided, conflicting interpretations"
  0, // 5 - "no assertion criteria provided"
  0, // 6 - "no assertion provided"
  0 // 7 - "other"
]

const vcvToNumber = (vcv: string): number => {
  return parseInt(vcv.substring(3))
}

const expand = ref<boolean>(false)
</script>

<template>
  <v-card variant="elevated" v-if="props.clinvar?.vcv">
    <v-card-title> ClinVar </v-card-title>
    <v-card-text>
      <v-row no-gutters class="flex-nowrap">
        <v-col cols="1" class="font-weight-black"> Significance </v-col>
        <v-col cols="1" style="min-width: 100px; max-width: 100%" class="flex-grow-1 flex-shrink-0">
          {{ significances[props.clinvar.reference_assertions[0].clinical_significance] }}
        </v-col>
      </v-row>

      <v-row no-gutters class="flex-nowrap">
        <v-col cols="1" class="font-weight-black"> Review Status </v-col>
        <v-col cols="1" style="min-width: 100px; max-width: 100%" class="flex-grow-1 flex-shrink-0">
          <span v-for="i of [1, 2, 3, 4, 5]" :key="i">
            <span v-if="i <= stars[props.clinvar.reference_assertions[0].review_status]">
              <v-icon>mdi-star</v-icon>
            </span>
            <span v-else>
              <v-icon>mdi-star-outline</v-icon>
            </span>
          </span>
          <span class="ml-3">
            {{ review_statuses[props.clinvar.reference_assertions[0].review_status] }}
          </span>
        </v-col>
      </v-row>

      <v-row no-gutters class="flex-nowrap">
        <v-col cols="1" class="font-weight-black"> Accession </v-col>
        <v-col cols="1" style="min-width: 100px; max-width: 100%" class="flex-grow-1 flex-shrink-0">
          <a
            :href="`https://www.ncbi.nlm.nih.gov/clinvar/variation/${vcvToNumber(
              props.clinvar.vcv
            )}/?redir=vcv`"
            target="_blank"
          >
            <v-icon>mdi-launch</v-icon>
            {{ props.clinvar.vcv }}
          </a>
        </v-col>
      </v-row>
    </v-card-text>

    <v-expand-transition>
      <div v-show="expand">
        <v-divider />

        <v-card-title> ClinVar Reference Assertions </v-card-title>
        <v-card-text>
          <p>Below are all reference assertions for all assessed conditions from ClinVar.</p>
          <v-table density="compact" class="mt-3">
            <thead>
              <tr>
                <th>Condition</th>
                <th>Significance</th>
                <th>Review Status</th>
                <th>RCV</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="assertion of props.clinvar.reference_assertions">
                <td>
                  {{ assertion.title.split('AND')[1] }}
                </td>
                <td>
                  {{ significances[assertion.clinical_significance] }}
                </td>
                <td>
                  <span v-for="i of [1, 2, 3, 4, 5]" :key="i">
                    <span v-if="i <= stars[assertion.review_status]">
                      <v-icon>mdi-star</v-icon>
                    </span>
                    <span v-else>
                      <v-icon>mdi-star-outline</v-icon>
                    </span>
                  </span>
                  <span class="ml-3"> {{ review_statuses[assertion.review_status] }} </span>
                </td>
                <td>
                  <a
                    :href="`https://www.ncbi.nlm.nih.gov/clinvar/${assertion.rcv}`"
                    target="_blank"
                  >
                    <v-icon>mdi-launch</v-icon>
                    {{ assertion.rcv }}
                  </a>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </div>
    </v-expand-transition>

    <v-divider />

    <v-card-actions>
      <v-btn @click="expand = !expand">
        {{ !expand ? 'Show Reference Assertions' : 'Hide Reference Assertions' }}
      </v-btn>
      <v-spacer />
      <v-btn
        :icon="expand ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="expand = !expand"
      ></v-btn>
    </v-card-actions>
  </v-card>

  <v-card variant="elevated" v-else>
    <v-card-text> sNo ClinVar information available. </v-card-text>
  </v-card>
</template>
