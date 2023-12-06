<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import {
  ACMG_CRITERIA_CNV_DEFS,
  AcmgCriteriaCNVGain,
  AcmgCriteriaCNVLoss,
  Presence,
  StateSourceCNV
} from '@/components/StrucvarDetails/ClinsigCard.c'
// -- local components ---------------------------------------------------------
import CnGain from '@/components/StrucvarDetails/ClinsigCard/CnGain.vue'
import CnLoss from '@/components/StrucvarDetails/ClinsigCard/CnLoss.vue'
import SummarySheet from '@/components/StrucvarDetails/ClinsigCard/SummarySheet.vue'
import { StoreState } from '@/stores/misc'
import { useSvAcmgRatingStore } from '@/stores/svAcmgRating'
import type { SvRecord } from '@/stores/svInfo'

/** Data type used for component's props. */
interface Props {
  svRecord?: SvRecord
}

/** Define component's props. */
const props = defineProps<Props>()

/** Store to use for ACMG ratings of structural variants. */
const acmgRatingStore = useSvAcmgRatingStore()

/** Component state: whether display of conflicting sections is enabled. */
const showConflictingSections = ref<boolean>(false)

/**
 * Update user ACMG rating values to those of AutoCNV.
 */
const refetchAcmgRating = () => {
  if (!acmgRatingStore.acmgRating) {
    return
  }
  acmgRatingStore.acmgRating.setUserToAutoCNV()
}

/** Calculate ACMG class from data in `acmgRatingStore`. */
const calculateAcmgClass = computed((): string => {
  if (!acmgRatingStore.acmgRating) {
    return ''
  }
  const [acmgClass] = acmgRatingStore.acmgRating.getAcmgClass()
  return acmgClass
})

/** Compute the decimal number score. */
const calculateAcmgScore = computed((): number => {
  if (!acmgRatingStore.acmgRating) {
    return 0
  }
  const [, score] = acmgRatingStore.acmgRating.getAcmgClass()
  return score
})

/** Fetch ACMG rating of SV from server when it changed. */
watch(
  () => [props.svRecord, acmgRatingStore.storeState],
  async () => {
    if (props.svRecord && acmgRatingStore.storeState === StoreState.Active) {
      await acmgRatingStore.fetchAcmgRating(props.svRecord)
    }
  }
)

/** Fetch ACMG rating when mounted. */
onMounted(async () => {
  if (props.svRecord) {
    await acmgRatingStore.fetchAcmgRating(props.svRecord)
  }
})

/** Switch a given ACMG criteria in the score and update conflicting sections. */
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
  <v-card class="mt-3">
    <v-card-title class="pb-0"> Clinical Significance </v-card-title>
    <v-card-subtitle class="text-overline">
      Semi-Automated Pathogenicity Prediction
    </v-card-subtitle>
    <v-card-text>
      <div>
        <v-row>
          <v-col cols="3"></v-col>
          <v-col cols="6">
            <SummarySheet
              :calculated-acmg-class="calculateAcmgClass"
              :calculated-acmg-score="calculateAcmgScore"
              @clear-user="() => refetchAcmgRating()"
            />
            <v-col cols="3"></v-col>
          </v-col>
        </v-row>
        <div v-if="props.svRecord?.svType === 'DEL'">
          <CnLoss
            :show-conflicting-sections="showConflictingSections"
            @switch-criteria="(criteria, presence) => switchCriteria(criteria, presence)"
          />
        </div>
        <div v-if="props.svRecord?.svType === 'DUP'">
          <CnGain
            :show-conflicting-sections="showConflictingSections"
            @switch-criteria="(criteria, presence) => switchCriteria(criteria, presence)"
          />
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-switch
        v-model="showConflictingSections"
        color="primary"
        :value="true"
        :false-value="false"
        label="conflicts documentation"
        class="ml-3 d-inline-flex flex-grow-0"
        density="compact"
      />
    </v-card-actions>
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
@/components/StrucvarDetails/ClinsigCard.c
