<!--
This component provides access to semi-automatic ACMG classification of seqvars.

Any errors on interacting with the server are communicated to the parent
component via the `errorDisplay` event and are handled there.
-->

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import DocsLink from '@/components/DocsLink.vue'
import {
  ACMG_CRITERIA_CNV_DEFS,
  AcmgCriteriaCNVGain,
  AcmgCriteriaCNVLoss,
  Presence,
  StateSourceCNV
} from '@/components/StrucvarDetails/ClinsigCard.c'
import CnGain from '@/components/StrucvarDetails/ClinsigCard/CnGain.vue'
import CnLoss from '@/components/StrucvarDetails/ClinsigCard/CnLoss.vue'
import SummarySheet from '@/components/StrucvarDetails/ClinsigCard/SummarySheet.vue'
import type { Strucvar } from '@/lib/genomicVars'
import { StoreState } from '@/stores/misc'
import { useStrucVarAcmgRatingStore } from '@/stores/strucVarAcmgRating'

/** Data type used for component's props. */
interface Props {
  strucvar?: Strucvar
}

/** Define component's props. */
const props = defineProps<Props>()

/** Define emits. */
const emit = defineEmits<{
  /** Display error to user. */
  (e: 'errorDisplay', msg: string): void
}>()

/** Store to use for ACMG ratings of structural variants. */
const acmgRatingStore = useStrucVarAcmgRatingStore()

/** Component state: whether display of conflicting sections is enabled. */
const showConflictingSections = ref<boolean>(false)

/** Helper function to run a function in a try/catch and emit `errorDisplay` otherwise.. */
const tryCatchEmitErrorDisplay = async (fn: () => Promise<void>) => {
  try {
    await fn()
  } catch (err) {
    emit('errorDisplay', `Ooops, there was an error: ${err}`)
  }
}

/**
 * Update user ACMG rating values to those of AutoCNV.
 */
const refetchAcmgRating = () => {
  if (acmgRatingStore.acmgRating) {
    tryCatchEmitErrorDisplay(async () => acmgRatingStore.acmgRating.setUserToAutoCNV())
  }
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
  () => [props.strucvar, acmgRatingStore.storeState],
  async () => {
    if (props.strucvar && acmgRatingStore.storeState === StoreState.Active) {
      await acmgRatingStore.fetchAcmgRating(props.strucvar)
    }
  }
)

/** Fetch ACMG rating when mounted. */
onMounted(async () => {
  if (props.strucvar) {
    const strucvar = props.strucvar // so that it is not undefined
    tryCatchEmitErrorDisplay(async () => acmgRatingStore.fetchAcmgRating(strucvar))
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
    <v-card-title class="pb-0 pr-2">
      Clinical Significance
      <DocsLink anchor="doc-manual-strucvar-clinical-significance" />
    </v-card-title>
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
        <div v-if="props.strucvar?.svType === 'DEL'">
          <CnLoss
            :show-conflicting-sections="showConflictingSections"
            @switch-criteria="(criteria, presence) => switchCriteria(criteria, presence)"
          />
        </div>
        <div v-if="props.strucvar?.svType === 'DUP'">
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
