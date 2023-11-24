<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  clinvar: Object
})

const clinicalSignificanceLabel: { [key: string]: string } = {
  CLINICAL_SIGNIFICANCE_PATHOGENIC: 'pathogenic',
  CLINICAL_SIGNIFICANCE_LIKELY_PATHOGENIC: 'likely pathogenic',
  CLINICAL_SIGNIFICANCE_UNCERTAIN_SIGNIFICANCE: 'uncertain significance',
  CLINICAL_SIGNIFICANCE_LIKELY_BENIGN: 'likely benign',
  CLINICAL_SIGNIFICANCE_BENIGN: 'benign'
}

const reviewStatusLabel: { [key: string]: string } = {
  REVIEW_STATUS_PRACTICE_GUIDELINE: 'practice guideline',
  REVIEW_STATUS_REVIEWED_BY_EXPERT_PANEL: 'reviewed by expert panel',
  REVIEW_STATUS_CRITERIA_PROVIDED_MULTIPLE_SUBMITTERS_NO_CONFLICTS:
    'criteria provided, multiple submitters, no conflicts',
  REVIEW_STATUS_CRITERIA_PROVIDED_SINGLE_SUBMITTER: 'criteria provided, single submitter',
  REVIEW_STATUS_CRITERIA_PROVIDED_CONFLICTING_INTERPRETATIONS:
    'criteria provided, conflicting interpretations',
  REVIEW_STATUS_NO_ASSERTION_CRITERIA_PROVIDED: 'no assertion criteria provided',
  REVIEW_STATUS_NO_ASSERTION_PROVIDED: 'no assertion provided'
}

const reviewStatusStars: { [key: string]: number } = {
  REVIEW_STATUS_PRACTICE_GUIDELINE: 4,
  REVIEW_STATUS_REVIEWED_BY_EXPERT_PANEL: 3,
  REVIEW_STATUS_CRITERIA_PROVIDED_MULTIPLE_SUBMITTERS_NO_CONFLICTS: 2,
  REVIEW_STATUS_CRITERIA_PROVIDED_SINGLE_SUBMITTER: 2,
  REVIEW_STATUS_CRITERIA_PROVIDED_CONFLICTING_INTERPRETATIONS: 0,
  REVIEW_STATUS_NO_ASSERTION_CRITERIA_PROVIDED: 0,
  REVIEW_STATUS_NO_ASSERTION_PROVIDED: 0
}

const vcvToNumber = (vcv: string): number => {
  return parseInt(vcv.substring(3))
}

const expand = ref<boolean>(false)
</script>

<template>
  <v-card v-if="props.clinvar?.vcv">
    <v-card-title> ClinVar </v-card-title>
    <v-card-text>
      <v-row no-gutters class="flex-nowrap">
        <v-col cols="1" class="font-weight-black"> Significance </v-col>
        <v-col cols="1" style="min-width: 100px; max-width: 100%" class="flex-grow-1 flex-shrink-0">
          {{
            clinicalSignificanceLabel[props.clinvar?.referenceAssertions[0]?.clinicalSignificance]
          }}
        </v-col>
      </v-row>

      <v-row no-gutters class="flex-nowrap">
        <v-col cols="1" class="font-weight-black"> Review Status </v-col>
        <v-col cols="1" style="min-width: 100px; max-width: 100%" class="flex-grow-1 flex-shrink-0">
          <span v-for="i of [1, 2, 3, 4, 5]" :key="i">
            <span
              v-if="i <= reviewStatusStars[props.clinvar?.referenceAssertions[0]?.reviewStatus]"
            >
              <v-icon>mdi-star</v-icon>
            </span>
            <span v-else>
              <v-icon>mdi-star-outline</v-icon>
            </span>
          </span>
          <span class="ml-3">
            {{ reviewStatusLabel[props.clinvar?.reviewStatus] }}
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
              <tr
                v-for="assertion of props.clinvar?.referenceAssertions"
                v-bind:key="assertion.rcv"
              >
                <td>
                  {{ assertion.title.split('AND')[1] }}
                </td>
                <td>
                  {{ clinicalSignificanceLabel[assertion.clinicalSignificance] }}
                </td>
                <td>
                  <span v-for="i of [1, 2, 3, 4, 5]" :key="i">
                    <span v-if="i <= reviewStatusStars[assertion.reviewStatus]">
                      <v-icon>mdi-star</v-icon>
                    </span>
                    <span v-else>
                      <v-icon>mdi-star-outline</v-icon>
                    </span>
                  </span>
                  <span class="ml-3"> {{ reviewStatusLabel[assertion.reviewStatus] }} </span>
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
    <v-card-text> No ClinVar information available. </v-card-text>
  </v-card>
</template>
