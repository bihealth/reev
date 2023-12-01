<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import AcmgCriteriaCard from '@/components/AcmgCriteriaCard.vue'
import {
  ACMG_CRITERIA_DEFS,
  ACMG_EVIDENCE_LEVELS_BENIGN,
  ACMG_EVIDENCE_LEVELS_PATHOGENIC,
  ALL_ACMG_CRITERIA,
  Presence
} from '@/lib/acmgSeqVar'
import { StoreState } from '@/stores/misc'
import { useVariantAcmgRatingStore } from '@/stores/variantAcmgRating'
import { type SmallVariant } from '@/stores/variantInfo'

interface Props {
  smallVariant?: SmallVariant
}

const props = defineProps<Props>()

const acmgRatingStore = useVariantAcmgRatingStore()

const acmgRatingConflicting = ref(false)
const showSwitches = ref(false)
const showFailed = ref(false)

const unsetAcmgRating = () => {
  acmgRatingStore.acmgRating.setUserPresenceAbsent()
}

const resetAcmgRatingInterVar = () => {
  acmgRatingStore.acmgRating.setUserPresenceInterVar()
}

const resetAcmgRatingServer = () => {
  acmgRatingStore.acmgRating.setUserPresenceServer()
}

const saveAcmgRating = () => {
  acmgRatingStore.saveAcmgRating()
}

const deleteAcmgRating = () => {
  acmgRatingStore.deleteAcmgRating()
}

const updateAcmgConflicting = (isConflicting: boolean) => {
  acmgRatingConflicting.value = isConflicting
}

const calculateAcmgRating = computed((): string => {
  // eslint-disable-next-line prefer-const
  let [acmgClass, isConflicting] = acmgRatingStore.acmgRating.getAcmgClass()
  if (isConflicting) {
    acmgClass = 'Uncertain significance'
    updateAcmgConflicting(true)
  } else {
    updateAcmgConflicting(false)
  }
  return acmgClass
})

watch(
  () => [props.smallVariant, acmgRatingStore.storeState],
  async () => {
    if (props.smallVariant && acmgRatingStore.storeState === StoreState.Active) {
      await acmgRatingStore.setAcmgRating(props.smallVariant)
      if (acmgRatingStore.acmgRatingStatus === false) {
        resetAcmgRatingInterVar()
      } else {
        resetAcmgRatingServer()
      }
    }
  }
)

onMounted(async () => {
  if (props.smallVariant) {
    await acmgRatingStore.setAcmgRating(props.smallVariant)
  }
})
</script>

<template>
  <v-card>
    <v-card-title>ACMG Rating</v-card-title>
    <v-divider />
    <v-row align-content="center" class="ml-3">
      <v-col class="mx-auto">
        <div>
          <div>
            <h2 for="acmg-class">
              <strong>ACMG classification:</strong>
            </h2>
          </div>
          <h1 title="Automatically determined ACMG class (Richards et al., 2015)">
            {{ calculateAcmgRating }}
          </h1>
          <router-link to="/acmg-docs" target="_blank">
            Further documentation <v-icon>mdi-open-in-new</v-icon>
          </router-link>
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
      <v-divider vertical />
      <v-col class="mx-auto">
        <v-card-text>
          With the buttons below you can twick the presented ACMG rating:
          <div class="button-group">
            <v-btn color="black" variant="outlined" @click="unsetAcmgRating()"> Clear </v-btn>
            <v-btn color="black" variant="outlined" @click="resetAcmgRatingInterVar()">
              Reset to InterVar
            </v-btn>
            <div v-if="acmgRatingStore.acmgRatingStatus === true">
              <v-btn color="black" variant="outlined" @click="resetAcmgRatingServer()">
                Reset to server
              </v-btn>
            </div>
            <div v-else>
              <v-btn color="black" variant="outlined" disabled> Reset to server </v-btn>
            </div>
          </div>
          With this buttons below you can
          {{ acmgRatingStore.acmgRatingStatus === false ? 'save' : 'update' }} ACMG rating on the
          server:
          <div class="button-group">
            <v-btn color="black" variant="outlined" @click="saveAcmgRating()">
              {{ acmgRatingStore.acmgRatingStatus === false ? 'Save' : 'Update' }}
            </v-btn>
            <v-btn color="black" variant="outlined" @click="deleteAcmgRating()"> Delete </v-btn>
          </div>
        </v-card-text>
      </v-col>
    </v-row>
    <v-row class="ml-3 mb-3">
      <v-col>
        <v-btn color="black" variant="outlined" @click="showSwitches = !showSwitches">
          {{ showSwitches ? 'Hide' : 'Show' }} summary view
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-show="showSwitches" class="ml-3 mb-3">
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
            <AcmgCriteriaCard
              :acmg-rating="acmgRatingStore.acmgRating"
              :criteria="criteria"
              :criteria-state="acmgRatingStore.acmgRating.getCriteriaState(criteria)"
            />
          </div>
        </div>
      </v-col>
      <v-divider vertical />
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
            <AcmgCriteriaCard
              :acmg-rating="acmgRatingStore.acmgRating"
              :criteria="criteria"
              :criteria-state="acmgRatingStore.acmgRating.getCriteriaState(criteria)"
            />
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row class="ml-3 mb-3">
      <v-col class="d-flex flex-row flex-wrap">
        <v-btn color="black" variant="outlined" @click="showFailed = !showFailed">
          {{ showFailed ? 'Hide' : 'Show' }} failed criteria
        </v-btn>
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
                <AcmgCriteriaCard
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
</style>
