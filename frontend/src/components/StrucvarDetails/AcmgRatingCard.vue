<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'

import {
  ACMG_CRITERIA_CNV_DEFS,
  ACMG_CRITERIA_CNV_GAIN,
  ACMG_CRITERIA_CNV_LOSS,
  AcmgCriteriaCNVGain,
  AcmgCriteriaCNVLoss,
  Presence,
  StateSourceCNV
} from '@/components/StrucvarDetails/AcmgRatingCard.c'
import { StoreState } from '@/stores/misc'
import { useSvAcmgRatingStore } from '@/stores/svAcmgRating'
import type { SvRecord } from '@/stores/svInfo'

interface Props {
  svRecord?: SvRecord
}

const props = defineProps<Props>()

const acmgRatingStore = useSvAcmgRatingStore()

const resetAcmgRating = () => {
  if (!acmgRatingStore.acmgRating) {
    return
  }
  acmgRatingStore.acmgRating.setUserToAutoCNV()
}

const calculateAcmgClass = computed((): string => {
  if (!acmgRatingStore.acmgRating) {
    return ''
  }
  const [acmgClass] = acmgRatingStore.acmgRating.getAcmgClass()
  return acmgClass
})

const calculateAcmgScore = computed((): number => {
  if (!acmgRatingStore.acmgRating) {
    return 0
  }
  const [, score] = acmgRatingStore.acmgRating.getAcmgClass()
  return score
})

watch(
  () => [props.svRecord, acmgRatingStore.storeState],
  async () => {
    if (props.svRecord && acmgRatingStore.storeState === StoreState.Active) {
      await acmgRatingStore.setAcmgRating(props.svRecord)
    }
  }
)

onMounted(async () => {
  if (props.svRecord) {
    await acmgRatingStore.setAcmgRating(props.svRecord)
  }
})

const switchCriteria = (
  criteria: AcmgCriteriaCNVLoss | AcmgCriteriaCNVGain,
  presence: Presence
) => {
  if (presence === Presence.Present) {
    acmgRatingStore.acmgRating.setPresence(StateSourceCNV.User, criteria, Presence.Absent)
  } else {
    acmgRatingStore.acmgRating.setPresence(StateSourceCNV.User, criteria, Presence.Present)
  }

  // Unset conflicting criteria
  const conflictingEvidence = ACMG_CRITERIA_CNV_DEFS.get(criteria)?.conflictingEvidence
  if (conflictingEvidence) {
    for (const conflictingCriteria of conflictingEvidence) {
      acmgRatingStore.acmgRating.setPresence(
        StateSourceCNV.User,
        conflictingCriteria,
        Presence.Absent
      )
    }
  }
}
</script>

<template>
  <v-card>
    <v-card-title>ACMG</v-card-title>
    <v-divider />

    <div v-if="acmgRatingStore.storeState === StoreState.Active">
      <v-row>
        <v-col cols="12" md="3" />
        <v-col cols="12" md="6" class="section">
          <div>
            <div>
              <h2 for="acmg-class">
                <strong>ACMG classification:</strong>
              </h2>
            </div>
            <h1 title="Automatically determined ACMG class (Richards et al., 2015)">
              {{ calculateAcmgClass }} with score: {{ calculateAcmgScore }}
            </h1>
            <router-link to="/acmg-sv-docs" target="_blank">
              Further documentation <v-icon>mdi-open-in-new</v-icon>
            </router-link>
          </div>
          <div class="button-group">
            <v-btn color="black" variant="outlined" @click="resetAcmgRating()"> Reset </v-btn>
          </div>
          <div>
            <div>
              <div>
                <v-icon>mdi-information-outline</v-icon>
                Select all fulfilled criteria to get the classification following Rooney Riggs
                <i>et al.</i> (2020).
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3" />
      </v-row>
      <v-row>
        <v-col class="d-flex flex-row flex-wrap">
          <v-table>
            <thead>
              <tr>
                <th width="20%">Evidence</th>
                <th width="74%">Description</th>
                <th width="3%">Suggested points</th>
                <th width="3%">Max score</th>
              </tr>
            </thead>
            <tbody v-if="props.svRecord?.svType === 'DEL'">
              <tr v-for="criteria in ACMG_CRITERIA_CNV_LOSS" :key="criteria">
                <td>
                  <v-switch
                    :label="criteria"
                    :model-value="
                      acmgRatingStore.acmgRating.getCriteriaCNVState(criteria).presence ===
                      Presence.Present
                    "
                    color="primary"
                    hide-details="auto"
                    density="compact"
                    class="switch"
                    @update:model-value="
                      switchCriteria(
                        criteria,
                        acmgRatingStore.acmgRating.getCriteriaCNVState(criteria).presence
                      )
                    "
                  />
                  <div v-if="ACMG_CRITERIA_CNV_DEFS.get(criteria)?.slider">
                    <v-slider
                      :model-value="
                        acmgRatingStore.acmgRating.getCriteriaCNVState(criteria).score ?? 0
                      "
                      :min="ACMG_CRITERIA_CNV_DEFS.get(criteria)?.minScore ?? 0"
                      :max="ACMG_CRITERIA_CNV_DEFS.get(criteria)?.maxScore ?? 0"
                      :step="0.05"
                      thumb-label
                      thumb-size="10"
                      class="slider"
                      @update:model-value="
                        acmgRatingStore.acmgRating.setScore(StateSourceCNV.User, criteria, $event)
                      "
                    />
                  </div>
                </td>
                <td>
                  {{ ACMG_CRITERIA_CNV_DEFS.get(criteria)?.hint }}
                  <br />
                  {{ ACMG_CRITERIA_CNV_DEFS.get(criteria)?.description ?? '' }}
                  <br />
                  Conflicting evidence:
                  {{ ACMG_CRITERIA_CNV_DEFS.get(criteria)?.conflictingEvidence }}
                </td>
                <td>{{ ACMG_CRITERIA_CNV_DEFS.get(criteria)?.defaultScore }}</td>
                <td>{{ ACMG_CRITERIA_CNV_DEFS.get(criteria)?.maxScore }}</td>
              </tr>
            </tbody>
            <tbody v-else-if="props.svRecord?.svType === 'DUP'">
              <tr v-for="criteria in ACMG_CRITERIA_CNV_GAIN" :key="criteria">
                <td>
                  <v-switch
                    :label="criteria"
                    :model-value="
                      acmgRatingStore.acmgRating.getCriteriaCNVState(criteria).presence ===
                      Presence.Present
                    "
                    color="primary"
                    hide-details="auto"
                    density="compact"
                    class="switch"
                    @update:model-value="
                      switchCriteria(
                        criteria,
                        acmgRatingStore.acmgRating.getCriteriaCNVState(criteria).presence
                      )
                    "
                  />
                  <div v-if="ACMG_CRITERIA_CNV_DEFS.get(criteria)?.slider">
                    <v-slider
                      :model-value="
                        acmgRatingStore.acmgRating.getCriteriaCNVState(criteria).score ?? 0
                      "
                      :min="ACMG_CRITERIA_CNV_DEFS.get(criteria)?.minScore ?? 0"
                      :max="ACMG_CRITERIA_CNV_DEFS.get(criteria)?.maxScore ?? 1"
                      :step="0.05"
                      thumb-label
                      thumb-size="10"
                      class="slider"
                      @update:model-value="
                        acmgRatingStore.acmgRating.setScore(StateSourceCNV.User, criteria, $event)
                      "
                    />
                  </div>
                </td>
                <td>
                  {{ ACMG_CRITERIA_CNV_DEFS.get(criteria)?.hint }}
                  <br />
                  {{ ACMG_CRITERIA_CNV_DEFS.get(criteria)?.description ?? '' }}
                  <br />
                  Conflicting evidence:
                  {{ ACMG_CRITERIA_CNV_DEFS.get(criteria)?.conflictingEvidence }}
                </td>
                <td>{{ ACMG_CRITERIA_CNV_DEFS.get(criteria)?.defaultScore }}</td>
                <td>{{ ACMG_CRITERIA_CNV_DEFS.get(criteria)?.maxScore }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </div>
    <v-card-text v-else>
      <div class="d-flex align-center justify-center" style="min-height: 300px">
        <h3>Loading ACMG information</h3>
        <v-progress-circular indeterminate />
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.section {
  margin: 10px;
  border: 2px solid rgb(229, 85, 64);
  border-radius: 10px;
  padding: 5px 10px;
}
.switch {
  margin-left: 10px;
  padding: 0px;
}

.slider {
  margin-top: 10px;
}
</style>
