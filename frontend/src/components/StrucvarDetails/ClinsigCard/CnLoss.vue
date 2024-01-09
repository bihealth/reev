<script setup lang="ts">
import {
  ACMG_CRITERIA_CNV_DEFS,
  ACMG_CRITERIA_CNV_LOSS,
  AcmgCriteriaCNVLoss,
  Presence,
  StateSourceCNV
} from '@/components/StrucvarDetails/ClinsigCard.c'
import { useStrucVarAcmgRatingStore } from '@/stores/strucvarAcmgRating'

const emit = defineEmits<{
  (e: 'switchCriteria', criteria: AcmgCriteriaCNVLoss, presence: Presence): void
}>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    showConflictingSections: boolean
  }>(),
  {
    showConflictingSections: false
  }
)

const acmgRatingStore = useStrucVarAcmgRatingStore()
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th width="20%">Evidence</th>
        <th width="74%">Description</th>
        <th width="3%">Suggested points</th>
        <th width="3%">Max score</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="criteria in ACMG_CRITERIA_CNV_LOSS" :key="criteria">
        <td>
          <v-switch
            :label="criteria"
            :model-value="
              acmgRatingStore.acmgRating.getCriteriaCNVState(criteria).presence === Presence.Present
            "
            color="primary"
            hide-details="auto"
            density="compact"
            class="switch"
            @update:model-value="
              emit(
                'switchCriteria',
                criteria,
                acmgRatingStore.acmgRating.getCriteriaCNVState(criteria).presence
              )
            "
          />
          <div v-if="ACMG_CRITERIA_CNV_DEFS.get(criteria)?.slider">
            <v-slider
              :model-value="acmgRatingStore.acmgRating.getCriteriaCNVState(criteria).score ?? 0"
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
          <div>
            {{ ACMG_CRITERIA_CNV_DEFS.get(criteria)?.hint }}
          </div>
          <div>
            {{ ACMG_CRITERIA_CNV_DEFS.get(criteria)?.description ?? '' }}
          </div>
          <div v-if="showConflictingSections">
            Conflicting evidence:
            {{ ACMG_CRITERIA_CNV_DEFS.get(criteria)?.conflictingEvidence }}
          </div>
        </td>
        <td>{{ ACMG_CRITERIA_CNV_DEFS.get(criteria)?.defaultScore }}</td>
        <td>{{ ACMG_CRITERIA_CNV_DEFS.get(criteria)?.maxScore }}</td>
      </tr>
    </tbody>
  </v-table>
</template>
@/components/StrucvarDetails/ClinsigCard.c
