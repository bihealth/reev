<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import { StoreState } from '@/stores/misc'
import { useVariantAcmgRatingStore } from '@/stores/variantAcmgRating'
import {
  AcmgCriteria,
  AcmgEvidenceLevel,
  StateSource,
  Presence,
  ALL_ACMG_CRITERIA,
  ACMG_EVIDENCE_LEVELS_PATHOGENIC,
  ACMG_EVIDENCE_LEVELS_BENIGN,
  ACMG_CRITERIA_DEFS
} from '@/components/ACMG/acmgSeqVar'

const props = defineProps({
  smallVariant: Object
})

const acmgRatingStore = useVariantAcmgRatingStore()

const acmgRatingConflicting = ref(false)
const showSwitches = ref(false)
const showFailed = ref(false)

const unsetAcmgRating = () => {
  acmgRatingStore.acmgRating.setUserPresenceAbsent()
}

const resetAcmgRating = () => {
  acmgRatingStore.acmgRating.setUserPresenceInterVar()
}

const updateAcmgConflicting = (isConflicting: boolean) => {
  acmgRatingConflicting.value = isConflicting
}

const calculateAcmgRating = (): string => {
  const pvs = acmgRatingStore.acmgRating.getEvidenceCounts(AcmgEvidenceLevel.PathogenicVeryStrong)
  const ps = acmgRatingStore.acmgRating.getEvidenceCounts(AcmgEvidenceLevel.PathogenicStrong)
  const pm = acmgRatingStore.acmgRating.getEvidenceCounts(AcmgEvidenceLevel.PathogenicModerate)
  const pp = acmgRatingStore.acmgRating.getEvidenceCounts(AcmgEvidenceLevel.PathogenicSupporting)
  const ba = acmgRatingStore.acmgRating.getEvidenceCounts(AcmgEvidenceLevel.BenignStandalone)
  const bs = acmgRatingStore.acmgRating.getEvidenceCounts(AcmgEvidenceLevel.BenignStrong)
  const bp = acmgRatingStore.acmgRating.getEvidenceCounts(AcmgEvidenceLevel.BenignSupporting)
  const isPathogenic =
    (pvs === 1 && (ps >= 1 || pm >= 2 || (pm === 1 && pp === 1) || pp >= 2)) ||
    ps >= 2 ||
    (ps === 1 && (pm >= 3 || (pm === 2 && pp >= 2) || (pm === 1 && pp >= 4)))
  const isLikelyPathogenic =
    (pvs === 1 && pm === 1) ||
    (ps === 1 && pm >= 1 && pm <= 2) ||
    (ps === 1 && pp >= 2) ||
    pm >= 3 ||
    (pm === 2 && pp >= 2) ||
    (pm === 1 && pp >= 4)
  const isBenign = ba > 0 || bs >= 2
  const isLikelyBenign = (bs === 1 && bp === 1) || bp >= 2
  const isConflicting = (isPathogenic || isLikelyPathogenic) && (isBenign || isLikelyBenign)

  let computedClass = 'Uncertain significance'
  if (isPathogenic) {
    computedClass = 'Pathogenic'
  } else if (isLikelyPathogenic) {
    computedClass = 'Likely pathogenic'
  } else if (isBenign) {
    computedClass = 'Benign'
  } else if (isLikelyBenign) {
    computedClass = 'Likely benign'
  }
  if (isConflicting) {
    computedClass = 'Uncertain significance'
    updateAcmgConflicting(true)
  } else {
    updateAcmgConflicting(false)
  }
  return computedClass
}

const switchCriteria = (criteria: AcmgCriteria, presence: Presence) => {
  if (presence === Presence.Present) {
    acmgRatingStore.acmgRating.setPresence(StateSource.User, criteria, Presence.Absent)
  } else {
    acmgRatingStore.acmgRating.setPresence(StateSource.User, criteria, Presence.Present)
  }
}

watch(
  () => [props.smallVariant, acmgRatingStore.storeState],
  async () => {
    if (props.smallVariant && acmgRatingStore.storeState === StoreState.Active) {
      await acmgRatingStore.setAcmgRating(props.smallVariant)
      resetAcmgRating()
    }
  }
)

const acmgRatingClass = ref('')

watch(
  () => acmgRatingStore.acmgRating.criteriaStates.User,
  () => {
    acmgRatingClass.value = calculateAcmgRating()
  }
)

onMounted(async () => {
  if (props.smallVariant) {
    await acmgRatingStore.setAcmgRating(props.smallVariant)
  }
})
</script>

<template>
  <v-row>
    <v-col cols="12" md="6" class="section">
      <div>
        <div>
          <h2 for="acmg-class"><strong>ACMG classification:</strong></h2>
        </div>
        <h1 title="Automatically determined ACMG class (Richards et al., 2015)">
          {{ acmgRatingClass }}
        </h1>
        <router-link to="/acmg-docs" target="_blank">
          Further documentation <v-icon>mdi-open-in-new</v-icon>
        </router-link>
      </div>
      <div class="button-group">
        <v-btn color="black" variant="outlined" @click="unsetAcmgRating()"> Clear </v-btn>
        <v-btn color="black" variant="outlined" @click="resetAcmgRating()"> Reset </v-btn>
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
            <i>et al.</i> (2015).
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
  <v-row style="margin-bottom: 15px">
    <v-col>
      <v-btn color="black" variant="outlined" @click="showSwitches = !showSwitches">
        {{ showSwitches ? 'Hide' : 'Show' }} summary view
      </v-btn>
    </v-col>
  </v-row>
  <v-row v-show="showSwitches" class="section">
    <v-col class="d-flex flex-row flex-wrap" cols="12" md="6">
      <div style="margin-right: 20px">
        <h3><strong>Pathogenic:</strong></h3>
      </div>
      <div v-for="criteria in ALL_ACMG_CRITERIA" :key="criteria">
        <div
          v-if="
            ACMG_EVIDENCE_LEVELS_PATHOGENIC.includes(
              acmgRatingStore.acmgRating.getCriteriaState(criteria).evidenceLevel
            )
          "
        >
          {{ acmgRatingStore.acmgRating.getCriteriaState(criteria) }}
          <v-switch
            color="primary"
            :label="criteria"
            :model-value="
              acmgRatingStore.acmgRating.getCriteriaState(criteria).presence === Presence.Present
            "
            @update:model-value="
              switchCriteria(
                criteria,
                acmgRatingStore.acmgRating.getCriteriaState(criteria).presence
              )
            "
            style="margin-right: 20px"
          />
        </div>
      </div>
    </v-col>
    <v-divider vertical></v-divider>
    <v-col class="d-flex flex-row flex-wrap" cols="12" md="6">
      <div style="margin-right: 20px">
        <h3><strong>Benign:</strong></h3>
      </div>
      <div v-for="criteria in ALL_ACMG_CRITERIA" :key="criteria">
        <div
          v-if="
            ACMG_EVIDENCE_LEVELS_BENIGN.includes(
              acmgRatingStore.acmgRating.getCriteriaState(criteria).evidenceLevel
            )
          "
        >
          <v-switch
            color="primary"
            :label="criteria"
            :model-value="
              acmgRatingStore.acmgRating.getCriteriaState(criteria).presence === Presence.Present
            "
            @update:model-value="
              switchCriteria(
                criteria,
                acmgRatingStore.acmgRating.getCriteriaState(criteria).presence
              )
            "
            style="margin-right: 20px"
          />
        </div>
      </div>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-btn color="black" variant="outlined" @click="showFailed = !showFailed">
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
          <tr v-for="criteria in ALL_ACMG_CRITERIA" :key="criteria">
            <td
              v-if="
                acmgRatingStore.acmgRating.getCriteriaState(criteria).presence ===
                  Presence.Present || showFailed
              "
            >
              <v-card class="mx-auto" width="200" style="margin: 10px">
                <div class="d-flex justify-content-between">
                  <v-switch
                    color="primary"
                    :label="criteria"
                    :model-value="
                      acmgRatingStore.acmgRating.getCriteriaState(criteria).presence ===
                      Presence.Present
                    "
                    @update:model-value="
                      switchCriteria(
                        criteria,
                        acmgRatingStore.acmgRating.getCriteriaState(criteria).presence
                      )
                    "
                    style="margin-right: 20px; margin-left: 10px"
                  />
                  <v-tooltip :text="ACMG_CRITERIA_DEFS.get(criteria)?.hint">
                    <template v-slot:activator="{ props }">
                      <v-icon style="margin: 10px" v-bind="props">mdi-information</v-icon>
                    </template>
                  </v-tooltip>
                </div>
                <v-divider />
                <v-select
                  :model-value="acmgRatingStore.acmgRating.getCriteriaState(criteria).evidenceLevel"
                  @update:model-value="
                    acmgRatingStore.acmgRating.setEvidenceLevel(StateSource.User, criteria, $event)
                  "
                  :items="
                    ACMG_EVIDENCE_LEVELS_PATHOGENIC.includes(
                      acmgRatingStore.acmgRating.getCriteriaState(criteria).evidenceLevel
                    )
                      ? ACMG_EVIDENCE_LEVELS_PATHOGENIC
                      : ACMG_EVIDENCE_LEVELS_BENIGN
                  "
                ></v-select>
              </v-card>
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
</template>

<style scoped>
#acmg-class-info {
  margin: 10px;
  width: 300px;
  grid-auto-flow: column;
}

.section {
  margin: 10px;
  border: 2px solid rgb(229, 85, 64);
  border-radius: 10px;
  padding: 5px 10px;
}

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
