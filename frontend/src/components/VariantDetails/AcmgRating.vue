<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import { StoreState } from '@/stores/misc'
import { useVariantAcmgRatingStore } from '@/stores/variantAcmgRating'
import { type SmallVariant } from '@/stores/variantInfo'
import AcmgCriteriaCard from '@/components/AcmgCriteriaCard.vue'
import {
  Presence,
  ALL_ACMG_CRITERIA,
  ACMG_EVIDENCE_LEVELS_PATHOGENIC,
  ACMG_EVIDENCE_LEVELS_BENIGN,
  ACMG_CRITERIA_DEFS
} from '@/lib/acmgSeqVar'

const props = defineProps({
  smallVariant: Object as () => SmallVariant | undefined
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

const calculateAcmgRating = computed((): string => {
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
      resetAcmgRating()
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
  <v-row>
    <v-col cols="12" md="3"></v-col>
    <v-col cols="12" md="6" class="section">
      <div>
        <div>
          <h2 for="acmg-class"><strong>ACMG classification:</strong></h2>
        </div>
        <h1 title="Automatically determined ACMG class (Richards et al., 2015)">
          {{ calculateAcmgRating }}
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
    <v-col cols="12" md="3"></v-col>
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
          <AcmgCriteriaCard
            :acmg-rating="acmgRatingStore.acmgRating"
            :criteria="criteria"
            :criteria-state="acmgRatingStore.acmgRating.getCriteriaState(criteria)"
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
          <AcmgCriteriaCard
            :acmg-rating="acmgRatingStore.acmgRating"
            :criteria="criteria"
            :criteria-state="acmgRatingStore.acmgRating.getCriteriaState(criteria)"
          />
        </div>
      </div>
    </v-col>
  </v-row>
  <v-row>
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
