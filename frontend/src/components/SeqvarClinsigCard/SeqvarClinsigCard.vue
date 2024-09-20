<!--
This component provides access to semi-automatic ACMG classification of seqvars.

Any errors on interacting with the server are communicated to the parent
component via the `errorDisplay` event and are handled there.
-->

<script setup lang="ts">
import DocsLink from '@bihealth/reev-frontend-lib/components/DocsLink/DocsLink.vue'
import { type Seqvar } from '@bihealth/reev-frontend-lib/lib/genomicVars'
import { computed, onMounted, ref, watch } from 'vue'
import { useTheme } from 'vuetify'

import {
  ACMG_CRITERIA_DEFS,
  ACMG_EVIDENCE_LEVELS_BENIGN,
  ACMG_EVIDENCE_LEVELS_PATHOGENIC,
  ALL_ACMG_CRITERIA,
  AcmgCriteria,
  AcmgEvidenceLevel,
  Presence,
  StateSource
} from '@/lib/acmgSeqvar'
import { useSeqvarAcmgRatingStore } from '@/stores/seqvarAcmgRating'
import { useUserStore } from '@/stores/user'

import CriterionSwitch from './CriterionSwitch.vue'
import SummarySheet from './SummarySheet.vue'

/** Data type used for component's props. */
interface Props {
  seqvar?: Seqvar
}

/** Define component's props. */
const props = defineProps<Props>()

/** Vuetify theme. */
const theme = useTheme()

/** Define emits. */
const emit = defineEmits<{
  /** Display error to user. */
  (e: 'errorDisplay', msg: string): void
}>()

/** Store to use for ACMG ratings of sequence variants. */
const acmgRatingStore = useSeqvarAcmgRatingStore()

/** Store for user data. */
const userStore = useUserStore()

/** Component state: error message to display, if any. */
const errorMessage = ref<string>('')
/** Component state: whether to enable summary view. */
const showTerse = ref<boolean>(true)
/** Component state: whether to show failed criteria. */
const showFailed = ref<boolean>(true)

/** Helper function to run a function in a try/catch and emit `errorDisplay` otherwise.. */
const tryCatchEmitErrorDisplay = async (fn: () => Promise<any>) => {
  try {
    return await fn()
  } catch (err) {
    const msg = `Ooops, there was an error: ${err}`
    errorMessage.value = msg
    emit('errorDisplay', msg)
  }
}

/** Clear ACMG ratings to result. */
const unfetchAcmgRating = () => {
  // Presence
  tryCatchEmitErrorDisplay(async () => acmgRatingStore.acmgRating.setUserPresenceAbsent())
  // Evidence level
  tryCatchEmitErrorDisplay(async () => acmgRatingStore.acmgRating.setUserEvidenceLevelDefault())
  // Summary
  tryCatchEmitErrorDisplay(async () => acmgRatingStore.acmgRating.setUserSummaryAbsent())
}

/** Re-fetch ACMG rating from AutoACMG. */
const refetchAcmgRatingAutoacmg = () => {
  // Presence
  tryCatchEmitErrorDisplay(async () => acmgRatingStore.acmgRating.setUserPresenceAutoACMG())
  // Evidence level
  tryCatchEmitErrorDisplay(async () => acmgRatingStore.acmgRating.setUserEvidenceLevelAutoACMG())
  // Summary
  tryCatchEmitErrorDisplay(async () => acmgRatingStore.acmgRating.setUserSummaryAutoACMG())
}

/** Re-fetch ACMG rating from InterVar. */
const refetchAcmgRatingInterVar = () => {
  // Presence
  tryCatchEmitErrorDisplay(async () => acmgRatingStore.acmgRating.setUserPresenceInterVar())
  // Evidence level
  tryCatchEmitErrorDisplay(async () => acmgRatingStore.acmgRating.setUserEvidenceLevelDefault())
  // Summary
  tryCatchEmitErrorDisplay(async () => acmgRatingStore.acmgRating.setUserSummaryInterVar())
}

/** Whether to re-fetch ACMG rating saved on server earlier. */
const refetchAcmgRatingServer = () => {
  tryCatchEmitErrorDisplay(async () => {
    if (props.seqvar) {
      await acmgRatingStore.refetchAcmgRating(props.seqvar)
    }
  })
  // Presence
  tryCatchEmitErrorDisplay(async () => acmgRatingStore.acmgRating.setUserPresenceServer())
  // Evidence level
  tryCatchEmitErrorDisplay(async () => acmgRatingStore.acmgRating.setUserEvidenceLevelServer())
  // Summary
  tryCatchEmitErrorDisplay(async () => acmgRatingStore.acmgRating.setUserSummaryServer())
}

/** Store ACMG rating on server. */
const saveAcmgRating = () => {
  tryCatchEmitErrorDisplay(async () => await acmgRatingStore.saveAcmgRating())
}

/** Delete ACMG rating on server. */
const deleteAcmgRating = () => {
  tryCatchEmitErrorDisplay(async () => await acmgRatingStore.deleteAcmgRating())
}

/** Overall ACMG rating computed from current criteria state */
const calculatedAcmgClass = computed((): string => {
  // eslint-disable-next-line prefer-const
  let [acmgClass, isConflicting] = acmgRatingStore.acmgRating.getAcmgClass()
  if (isConflicting) {
    acmgClass = 'Uncertain significance'
  }
  return acmgClass
})

/** Enumeration for all conflicts. */
enum Conflict {
  /** Benign vs. pathogenic. */
  BenignPathogenic = 'benign_pathogenic',
  /** PVS1 vs. PM4. */
  Pvs1Pm4 = 'pvs1_pm4',
  /** PVS1 vs. PP3. */
  Pvs1Pp3 = 'pvs1_pp3',
  /** PP3_strong vs. PM1_strong. */
  Pp3StrongPm1Strong = 'pp3_strong_pm1_strong'
}

/** Currently detected conflicts. */
const currentConflicts = computed<Conflict[]>(() => {
  const result: Conflict[] = []
  // Check for pathogenic vs. benign conflict.
  const [, conflictBenignPathogenic] = acmgRatingStore.acmgRating.getAcmgClass()
  if (conflictBenignPathogenic) {
    result.push(Conflict.BenignPathogenic)
  }
  // Check for PVS1 being applied at the same time as PM4 or PP3.
  if (
    acmgRatingStore.acmgRating.getCriteriaState(AcmgCriteria.PVS1).presence === Presence.Present &&
    acmgRatingStore.acmgRating.getCriteriaState(AcmgCriteria.PM4).presence === Presence.Present
  ) {
    result.push(Conflict.Pvs1Pm4)
  }
  if (
    acmgRatingStore.acmgRating.getCriteriaState(AcmgCriteria.PVS1).presence === Presence.Present &&
    acmgRatingStore.acmgRating.getCriteriaState(AcmgCriteria.PP3).presence === Presence.Present
  ) {
    result.push(Conflict.Pvs1Pp3)
  }
  // Check for combination of PP3_strong and PM1_strong which is discouraged by Pejaver et al. (2022).
  if (
    acmgRatingStore.acmgRating.getCriteriaState(AcmgCriteria.PP3).presence === Presence.Present &&
    acmgRatingStore.acmgRating.getCriteriaState(AcmgCriteria.PP3).evidenceLevel ===
      AcmgEvidenceLevel.PathogenicStrong &&
    acmgRatingStore.acmgRating.getCriteriaState(AcmgCriteria.PM1).presence === Presence.Present &&
    acmgRatingStore.acmgRating.getCriteriaState(AcmgCriteria.PM1).evidenceLevel ===
      AcmgEvidenceLevel.PathogenicStrong
  ) {
    result.push(Conflict.Pp3StrongPm1Strong)
  }
  return result
})

/** Return font color for genome build based on current theme. */
const fontColor = computed(() => {
  return theme.global.current.value.dark ? 'white' : 'black'
})

/** Re-compute ACMG rating from AutoACMG and InterVar when the sequence variant changed. */
watch(
  () => [props.seqvar],
  async () => {
    if (props.seqvar) {
      try {
        await acmgRatingStore.fetchAcmgRating(props.seqvar)
        if (acmgRatingStore.acmgRatingStatus === false) {
          refetchAcmgRatingAutoacmg()
        } else if (props.seqvar?.genomeBuild === 'grch37') {
          refetchAcmgRatingInterVar()
        } else {
          refetchAcmgRatingServer()
        }
      } catch (err) {
        const msg = `Ooops, there was an error: ${err}`
        errorMessage.value = msg
        emit('errorDisplay', msg)
      }
    }
  }
)

/** Fetch ACMG rating when mounted. */
onMounted(async () => {
  userStore.initialize()
  if (props.seqvar) {
    const seqvar = props.seqvar // so that it is not undefined in the async function
    await tryCatchEmitErrorDisplay(async () => await acmgRatingStore.fetchAcmgRating(seqvar))
  }
})
</script>

<template>
  <v-card>
    <v-card-title class="pb-0 pr-2">
      Clinical Significance
      <DocsLink anchor="clinical-significance" />
    </v-card-title>
    <v-card-subtitle class="text-overline">
      Semi-Automated Pathogenicity Prediction
    </v-card-subtitle>
    <v-card-text v-if="errorMessage">
      <v-card>
        <v-alert type="error"> {{ errorMessage }} </v-alert>
      </v-card>
    </v-card-text>
    <v-card-text v-else>
      <p class="mb-6">
        Classification of variants is based on predictions from AutoACMG
        <a href="https://github.com/bihealth/auto-acmg" target="_blank"> (BIH, 2023) </a> and
        InterVar
        <a href="https://europepmc.org/article/MED/28132688" target="_blank">
          (Li &amp; Wang, 2017)
        </a>
        which follow the ACMG 2015 criteria
        <a href="https://europepmc.org/article/MED/25741868" target="_blank"
          >(Richards et al., 2015)</a
        >.
      </p>

      <!-- Top summary sheet and server storage buttons -->
      <v-row>
        <v-col cols="3">
          <div class="d-flex flex-column">
            <div
              color="black"
              variant="text"
              class="d-block pa-3 text-center text-body-1"
              :class="{
                'text-success': acmgRatingStore.acmgRatingAutoacmgLoaded,
                'text-error': !acmgRatingStore.acmgRatingAutoacmgLoaded
              }"
            >
              <template v-if="acmgRatingStore.acmgRatingAutoacmgLoaded">
                <v-icon>mdi-check-circle-outline</v-icon>
                AutoACMG provides prediction
              </template>
              <template v-else>
                <v-icon>mdi-close-circle</v-icon>
                No AutoACMG prediction
              </template>
            </div>
            <div
              color="black"
              variant="text"
              class="d-block pa-3 text-center text-body-1"
              :class="{
                'text-success': acmgRatingStore.acmgRatingIntervarLoaded,
                'text-error': !acmgRatingStore.acmgRatingIntervarLoaded
              }"
            >
              <template v-if="acmgRatingStore.acmgRatingIntervarLoaded">
                <v-icon>mdi-check-circle-outline</v-icon>
                InterVar provides prediction
              </template>
              <template v-else>
                <v-icon>mdi-close-circle</v-icon>
                No InterVar prediction
              </template>
            </div>
            <v-btn
              :color="fontColor"
              variant="text"
              rounded="sm"
              :prepend-icon="showTerse ? 'mdi-playlist-remove' : 'mdi-playlist-check'"
              @click="showTerse = !showTerse"
            >
              {{ showTerse ? 'Hide' : 'Show' }} terse mode
            </v-btn>
            <v-btn
              :color="fontColor"
              variant="text"
              rounded="sm"
              :prepend-icon="showFailed ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              class="show-failed"
              @click="showFailed = !showFailed"
            >
              {{ showFailed ? 'Hide' : 'Show' }} failed criteria
            </v-btn>
          </div>
        </v-col>
        <v-col cols="6">
          <SummarySheet
            :calculated-acmg-class="calculatedAcmgClass"
            :autoacmg-available="acmgRatingStore.acmgRatingAutoacmgLoaded"
            :inter-var-available="acmgRatingStore.acmgRatingIntervarLoaded"
            @clear-all="() => unfetchAcmgRating()"
            @reset-to-autoacmg="() => refetchAcmgRatingAutoacmg()"
            @reset-to-inter-var="() => refetchAcmgRatingInterVar()"
          />
        </v-col>
        <v-col cols="3">
          <div class="d-flex flex-column">
            <v-btn
              :color="fontColor"
              variant="text"
              rounded="sm"
              prepend-icon="mdi-cloud-upload-outline"
              :disabled="!userStore.isAuthenticated"
              @click="() => saveAcmgRating()"
            >
              Save to Server
            </v-btn>
            <v-btn
              :color="fontColor"
              variant="text"
              rounded="sm"
              prepend-icon="mdi-cloud-download-outline"
              :disabled="!userStore.isAuthenticated"
              @click="() => refetchAcmgRatingServer()"
            >
              Load from Server
            </v-btn>
            <v-btn
              :color="fontColor"
              variant="text"
              rounded="sm"
              prepend-icon="mdi-cloud-remove-outline"
              :disabled="!userStore.isAuthenticated"
              @click="() => deleteAcmgRating()"
            >
              Delete from Server
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <!-- Warning in case of conflicts -->
      <v-alert v-if="currentConflicts.length" type="warning">
        <p class="mb-3"><strong>Warning:</strong> The following conflicts were detected:</p>
        <ul>
          <li v-if="currentConflicts.includes(Conflict.BenignPathogenic)">
            Conflicting interpretation of variant (benign vs. pathogenic).
          </li>
          <li v-if="currentConflicts.includes(Conflict.Pvs1Pm4)">
            PVS1 and PM4 cannot be applied at the same time.
          </li>
          <li v-if="currentConflicts.includes(Conflict.Pvs1Pp3)">
            PVS1 and PP3 cannot be applied at the same time.
          </li>
          <li v-if="currentConflicts.includes(Conflict.Pp3StrongPm1Strong)">
            PP3_strong and PM1_strong should not be applied at the same time.
          </li>
        </ul>
      </v-alert>
      <!-- Actual criteria-->
      <v-row v-show="showTerse" class="ml-3 mb-3">
        <v-col cols="12" md="6">
          <v-card-subtitle class="text-overline pl-0"> Pathogenic </v-card-subtitle>
          <div class="d-flex flex-row flex-wrap">
            <div v-for="criteria in ALL_ACMG_CRITERIA" :key="`${criteria}--1`">
              <div
                v-if="
                  ACMG_EVIDENCE_LEVELS_PATHOGENIC.includes(
                    acmgRatingStore.acmgRating.getCriteriaState(criteria).evidenceLevel
                  ) &&
                  (acmgRatingStore.acmgRating.getCriteriaState(criteria).presence ===
                    Presence.Present ||
                    showFailed)
                "
              >
                <CriterionSwitch
                  :acmg-rating="acmgRatingStore.acmgRating"
                  :criteria="criteria"
                  :criteria-state="
                    acmgRatingStore.acmgRating.getCriteriaStateFromSource(
                      criteria,
                      StateSource.User
                    )
                  "
                />
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <v-card-subtitle class="text-overline pl-0"> Benign </v-card-subtitle>
          <div class="d-flex flex-row flex-wrap">
            <div v-for="criteria in ALL_ACMG_CRITERIA" :key="`${criteria}--1`">
              <div
                v-if="
                  ACMG_EVIDENCE_LEVELS_BENIGN.includes(
                    acmgRatingStore.acmgRating.getCriteriaState(criteria).evidenceLevel
                  ) &&
                  (acmgRatingStore.acmgRating.getCriteriaState(criteria).presence ===
                    Presence.Present ||
                    showFailed)
                "
              >
                <CriterionSwitch
                  :acmg-rating="acmgRatingStore.acmgRating"
                  :criteria="criteria"
                  :criteria-state="acmgRatingStore.acmgRating.getCriteriaState(criteria)"
                />
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row v-show="!showTerse">
        <v-col class="d-flex flex-row flex-wrap">
          <v-table>
            <thead>
              <tr>
                <th class="font-weight-bold">Criteria</th>
                <th class="font-weight-bold">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="criteria in ALL_ACMG_CRITERIA" :key="criteria">
                <td
                  v-if="
                    acmgRatingStore.acmgRating.getCriteriaState(criteria).presence ===
                      Presence.Present || showFailed
                  "
                >
                  <CriterionSwitch
                    :acmg-rating="acmgRatingStore.acmgRating"
                    :criteria="criteria"
                    :criteria-state="acmgRatingStore.acmgRating.getCriteriaState(criteria)"
                  />
                </td>
                <td
                  v-if="
                    acmgRatingStore.acmgRating.getCriteriaState(criteria).presence ===
                      Presence.Present || showFailed
                  "
                >
                  {{ ACMG_CRITERIA_DEFS.get(criteria)?.description ?? '' }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-card-text>
    <!-- <v-card-actions>
      <v-btn href="http://wintervar.wglab.org/" target="_blank" prepend-icon="mdi-launch">
        wInterVar
      </v-btn>
    </v-card-actions> -->
  </v-card>
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

ul {
  list-style-position: inside;
}
</style>
