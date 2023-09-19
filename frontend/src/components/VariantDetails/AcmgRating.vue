<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import { StoreState } from '@/stores/misc'
import { useVariantAcmgRatingStore } from '@/stores/variantAcmgRating'
import { ACMGRanking } from '@/components/ACMG/acmgInterfaces'

const props = defineProps({
  smallVariant: Object
})

const acmgRatingStore = useVariantAcmgRatingStore()

const ScoreExplanation = {
  1: 'Benign',
  2: 'Likely benign',
  3: 'Uncertain significance',
  4: 'Likely pathogenic',
  5: 'Pathogenic'
}

const acmgRatingConflicting = ref(false)
const acmgRatingScore = ref(0)
const acmgRatingScoreComputed = ref(0)
const acmgRatingPathogenicScore = ref(0)
const acmgRatingBenignScore = ref(0)
const showTooltip = ref(false)
const showSwitches = ref(false)
const showFailed = ref(false)

const unsetAcmgRating = () => {
  ACMGRanking.userSelected = { ...ACMGRanking.default }
}

const setInterVarAcmgRating = () => {
  if (acmgRatingStore.acmgRatingInterVar) {
    for (const [key, value] of Object.entries(acmgRatingStore.acmgRatingInterVar)) {
      if (value === true) {
        for (const [criteriaKey, criteria] of Object.entries(ACMGRanking.interVar) as any) {
          if (criteriaKey === key) {
            criteria.active = true
          }
        }
      }
    }

    ACMGRanking.userSelected = { ...ACMGRanking.interVar }
    const acmgScore = calculateAcmgScore(ACMGRanking.interVar)
    acmgRatingScoreComputed.value = acmgScore.acmgScore
  } else {
    unsetAcmgRating()
  }
}

const resetAcmgRating = () => {
  ACMGRanking.userSelected = { ...ACMGRanking.interVar }
}

const updateAcmgClass = (isConflicting: boolean, pathogenicScore: number, benignScore: number) => {
  acmgRatingConflicting.value = isConflicting
  acmgRatingPathogenicScore.value = pathogenicScore
  acmgRatingBenignScore.value = -benignScore
  acmgRatingScore.value = pathogenicScore + benignScore
}

const calculateAcmgScore = (acmgRating: any) => {
  let pathogenicScore = 0
  let benignScore = 0
  for (const criteria of Object.values(acmgRating) as any) {
    if (criteria.active) {
      pathogenicScore += criteria.evidence
    }
  }
  for (const criteria of Object.values(acmgRating) as any) {
    if (criteria.active) {
      benignScore += criteria.evidence
    }
  }
  const acmgScore = pathogenicScore + benignScore
  return {
    pathogenicScore,
    benignScore,
    acmgScore
  }
}

const calculateAcmgRating = computed(() => {
  const acmgScores = calculateAcmgScore(ACMGRanking.userSelected)
  const acmgScore = acmgScores.acmgScore
  const pathogenicScore = acmgScores.pathogenicScore
  const benignScore = acmgScores.benignScore

  const isPathogenic = acmgScore >= 10
  const isLikelyPathogenic = acmgScore >= 6 && acmgScore <= 9
  const isLikelyBenign = acmgScore >= -6 && acmgScore <= -1
  const isBenign = acmgScore <= -7
  const isConflicting = pathogenicScore >= 6 && benignScore <= -1

  var computedClassAuto = 3
  if (isPathogenic) {
    computedClassAuto = 5
  } else if (isLikelyPathogenic) {
    computedClassAuto = 4
  } else if (isBenign) {
    computedClassAuto = 1
  } else if (isLikelyBenign) {
    computedClassAuto = 2
  }
  if (isConflicting) {
    computedClassAuto = 3
    updateAcmgClass(true, pathogenicScore, benignScore)
  } else {
    updateAcmgClass(false, pathogenicScore, benignScore)
  }
  return ScoreExplanation[computedClassAuto as 1 | 2 | 3 | 4 | 5]
})

watch(
  () => [props.smallVariant, acmgRatingStore.storeState],
  async () => {
    if (props.smallVariant && acmgRatingStore.storeState === StoreState.Active) {
      await acmgRatingStore.retrieveAcmgRating(props.smallVariant)
      resetAcmgRating()
    }
  }
)

onMounted(async () => {
  if (props.smallVariant) {
    await acmgRatingStore.retrieveAcmgRating(props.smallVariant)
    setInterVarAcmgRating()
  }
})
</script>

<template>
  <v-row>
    <v-col cols="12" md="3">
      <div>
        <div>
          <h2 for="acmg-class">
            <strong>ACMG classification:</strong>
            <small
              ><v-tooltip
                width="300"
                v-model="showTooltip"
                bottom
                text="Rules are combined using the point system described in PMID:32720330

              Each rule triggered is assigned a number of points based on the strength of the evidence provided:

              Supporting: 1 point
              Moderate: 2 points
              Strong: 4 points
              Very Strong: 8 points
              A total score is computed as the sum of the points from the pathogenic rules, minus the sum of the points from benign rules.

              The total score is then compared to thresholds to assign the final verdict:

              Pathogenic if greater than or equal to 10.
              Likely Pathogenic if between 6 and 9 inclusive.
              Uncertain Significance if between 0 and 5.
              Likely Benign if between -6 and -1.
              Benign if less than or equal to -7."
              >
                <template v-slot:activator="{ props }">
                  <v-icon style="margin: 10px" v-bind="props">mdi-help-circle</v-icon>
                </template>
              </v-tooltip>
            </small>
            <v-btn prepend-icon="mdi-help-circle-outline" @click="showTooltip = !showTooltip">
              info
            </v-btn>
          </h2>
        </div>
        <h2>
          {{ acmgRatingScore }} points = {{ acmgRatingPathogenicScore }}P -
          {{ acmgRatingBenignScore }}B
        </h2>
        <h1 title="Automatically determined ACMG class (Richards et al., 2015)">
          {{ calculateAcmgRating }}
        </h1>
        <router-link to="/acmg-docs" target="_blank">
          <h3>Further documentation <v-icon>mdi-open-in-new</v-icon></h3>
        </router-link>
      </div>
    </v-col>
    <v-col cols="12" md="5">
      <v-table>
        <thead>
          <tr>
            <th>Mode</th>
            <th>Criteria</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>InterVar</td>
            <td class="d-flex flex-row flex-wrap">
              <div v-for="(criteria, criteriaKey) in ACMGRanking.interVar" :key="criteriaKey">
                <div v-if="criteria.active && criteria.evidence > 0" style="margin-right: 10px">
                  {{ criteria.id }}: +{{ criteria.evidence }}
                </div>
                <div
                  v-else-if="criteria.active && criteria.evidence < 0"
                  style="margin-right: 10px"
                >
                  {{ criteria.id }}: {{ criteria.evidence }}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>Manually selected</td>
            <td class="d-flex flex-row flex-wrap">
              <div v-for="(criteria, criteriaKey) in ACMGRanking.userSelected" :key="criteriaKey">
                <div v-if="criteria.active && criteria.evidence > 0" style="margin-right: 10px">
                  {{ criteria.id }}: +{{ criteria.evidence }}
                </div>
                <div
                  v-else-if="criteria.active && criteria.evidence < 0"
                  style="margin-right: 10px"
                >
                  {{ criteria.id }}: {{ criteria.evidence }}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>Difference</td>
            <td class="d-flex flex-row flex-wrap">
              <div v-for="(criteria, criteriaKey) in ACMGRanking.userSelected" :key="criteriaKey">
                <div
                  v-if="
                    ACMGRanking.interVar[criteriaKey].active !== criteria.active ||
                    ACMGRanking.interVar[criteriaKey].evidence !== criteria.evidence
                  "
                  style="margin-right: 10px"
                >
                  {{ criteria.id }}: +{{ criteria.evidence }}
                </div>
              </div>
              <div style="color: #2196f3">
                Score computed: {{ acmgRatingScoreComputed }} /VS/ Custom score:
                {{ acmgRatingScore }}
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
    <v-col cols="12" md="4">
      <div class="button-group">
        <v-btn @click="unsetAcmgRating()"> Clear </v-btn>
        <v-btn @click="resetAcmgRating()"> Reset </v-btn>
      </div>
      <div v-if="acmgRatingConflicting">
        <div>
          <div>
            <v-icon>mdi-information-outline</v-icon>
            <strong>Caution!</strong> Conflicting interpretation of variant.
          </div>
        </div>
      </div>
      <div>
        <div>
          <div>
            <v-icon>mdi-information-outline</v-icon>
            Select all fulfilled criteria to get the classification following Richards
            <i>et al.</i> (2015). If necessary, you can also specify a manual override. Press
            <span style="background-color: wheat">Reset</span> to reset criteria to the default
            state. Press <span style="background-color: wheat">Clear</span> to set all criteria to
            initial state.
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
  <v-row style="margin-bottom: 15px">
    <v-col>
      <v-btn @click="showSwitches = !showSwitches">
        {{ showSwitches ? 'Hide' : 'Show' }} summary view
      </v-btn>
    </v-col>
  </v-row>
  <v-row v-show="showSwitches">
    <v-col class="d-flex flex-row flex-wrap" cols="12" md="6">
      <div style="margin-right: 20px">
        <h3><strong>Pathogenic:</strong></h3>
      </div>
      <div v-for="(criteria, criteriaKey) in ACMGRanking.userSelected" :key="criteriaKey">
        <div v-if="criteria.evidence > 0">
          <v-switch
            color="primary"
            :label="criteria.id"
            :model-value="criteria.active"
            @update:model-value="criteria.active = $event as any"
            style="margin-right: 20px"
          ></v-switch>
        </div>
      </div>
    </v-col>
    <v-divider vertical></v-divider>
    <v-col class="d-flex flex-row flex-wrap" cols="12" md="6">
      <div style="margin-right: 20px">
        <h3><strong>Benign:</strong></h3>
      </div>
      <div v-for="(criteria, criteriaKey) in ACMGRanking.userSelected" :key="criteriaKey">
        <div v-if="criteria.evidence < 0">
          <v-switch
            color="primary"
            :label="criteria.name"
            :model-value="criteria.active"
            @update:model-value="criteria.active = $event as any"
            style="margin-right: 20px"
          ></v-switch>
        </div>
      </div>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-btn @click="showFailed = !showFailed">
        {{ showFailed ? 'Hide' : 'Show' }} failed criteria
      </v-btn>
    </v-col>
  </v-row>
  <v-row>
    <v-col class="d-flex flex-row flex-wrap">
      <v-table>
        <thead>
          <tr>
            <th>Criteria</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(criteria, criteriaKey) in ACMGRanking.userSelected" :key="criteriaKey">
            <td v-if="criteria.active || showFailed">
              <v-card class="mx-auto" width="200" style="margin: 10px">
                <div class="d-flex justify-content-between">
                  <v-switch
                    style="margin-left: 10px"
                    color="primary"
                    :label="criteria.id"
                    :model-value="criteria.active"
                    @update:model-value="criteria.active = $event as any"
                  />
                  <v-tooltip :text="criteria.id">
                    <template v-slot:activator="{ props }">
                      <v-icon style="margin: 10px" v-bind="props">mdi-information</v-icon>
                    </template>
                  </v-tooltip>
                </div>
                <v-divider />
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      <template v-slot:default="{}">
                        <v-row no-gutters>
                          <v-col class="d-flex justify-start">
                            Score: {{ criteria.evidence }}
                          </v-col>
                        </v-row>
                      </template>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <!-- <v-select
                        v-model="criteria.evidence"
                        :items="[8, 4, 2, 1, null]"
                        label="Select Custom Score"
                      ></v-select> -->
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card>
            </td>
            <td v-if="criteria.active || showFailed">
              {{ criteria.description }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<style scoped>
#acmg-class-override {
  width: 135px;
  height: 50px;
  margin-bottom: 120px;
}

.button-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 12px;
}
</style>
