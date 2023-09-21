<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import { StoreState } from '@/stores/misc'
import { useVariantAcmgRatingStore } from '@/stores/variantAcmgRating'
import { ACMGRanking } from '@/components/ACMG/acmgInterfaces'

const props = defineProps({
  smallVariant: Object
})

const acmgRatingStore = useVariantAcmgRatingStore()

const acmgRanking = new ACMGRanking()
const acmgRatingConflicting = ref(false)
const showSwitches = ref(false)
const showFailed = ref(false)

const setInterVarAcmgRating = () => {
  if (acmgRatingStore.acmgRatingInterVar) {
    for (const [key, value] of Object.entries(acmgRatingStore.acmgRatingInterVar)) {
      if (value === true) {
        for (const [criteriaKey, criteria] of Object.entries(acmgRanking.interVar) as any) {
          if (criteriaKey === key) {
            criteria.active = true
          }
        }
      }
    }

    acmgRanking.resetAllCriteria(acmgRanking.userSelected, acmgRanking.interVar)
  } else {
    unsetAcmgRating()
  }
}

const unsetAcmgRating = () => {
  acmgRanking.resetAllCriteria(acmgRanking.userSelected, acmgRanking.default)
}

const resetAcmgRating = () => {
  acmgRanking.resetAllCriteria(acmgRanking.userSelected, acmgRanking.interVar)
}

const updateAcmgConflicting = (isConflicting: boolean) => {
  acmgRatingConflicting.value = isConflicting
}

function countTrueBooleans(...variables: boolean[]): number {
  const trueVariables = variables.filter((variable) => variable === true)
  return trueVariables.length
}

const calculateAcmgRating = computed(() => {
  const pvs = countTrueBooleans(acmgRanking.userSelected.pvs1.active)
  const ps = countTrueBooleans(
    acmgRanking.userSelected.ps1.active,
    acmgRanking.userSelected.ps2.active,
    acmgRanking.userSelected.ps3.active,
    acmgRanking.userSelected.ps4.active
  )
  const pm = countTrueBooleans(
    acmgRanking.userSelected.pm1.active,
    acmgRanking.userSelected.pm2.active,
    acmgRanking.userSelected.pm3.active,
    acmgRanking.userSelected.pm4.active,
    acmgRanking.userSelected.pm5.active,
    acmgRanking.userSelected.pm6.active
  )
  const pp = countTrueBooleans(
    acmgRanking.userSelected.pp1.active,
    acmgRanking.userSelected.pp2.active,
    acmgRanking.userSelected.pp3.active,
    acmgRanking.userSelected.pp4.active,
    acmgRanking.userSelected.pp5.active
  )
  const ba = countTrueBooleans(acmgRanking.userSelected.ba1.active)
  const bs = countTrueBooleans(
    acmgRanking.userSelected.bs1.active,
    acmgRanking.userSelected.bs2.active,
    acmgRanking.userSelected.bs3.active,
    acmgRanking.userSelected.bs4.active
  )
  const bp = countTrueBooleans(
    acmgRanking.userSelected.bp1.active,
    acmgRanking.userSelected.bp2.active,
    acmgRanking.userSelected.bp3.active,
    acmgRanking.userSelected.bp4.active,
    acmgRanking.userSelected.bp5.active,
    acmgRanking.userSelected.bp6.active,
    acmgRanking.userSelected.bp7.active
  )
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

  var computedClass = 'Uncertain significance'
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
})

const switchCriteria = (criteriaKey: string) => {
  acmgRanking.changeCriteriaState(criteriaKey, acmgRanking.userSelected)
}

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
    <v-col cols="12" md="4" class="section">
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
            <i>et al.</i> (2015). If necessary, you can also specify a manual override. Press
            <span style="background-color: wheat">Reset</span> to reset criteria to the default
            state. Press <span style="background-color: wheat">Clear</span> to set all criteria to
            initial state.
          </div>
        </div>
      </div>
    </v-col>
    <v-col cols="12" md="6" class="section">
      <h3>Active criteria:</h3>
      <v-divider />
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
              <div v-for="(criteria, criteriaKey) in acmgRanking.interVar" :key="criteriaKey">
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
              <div v-for="(criteria, criteriaKey) in acmgRanking.userSelected" :key="criteriaKey">
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
              <div v-for="(criteria, criteriaKey) in acmgRanking.userSelected" :key="criteriaKey">
                <div
                  v-if="
                    acmgRanking.interVar[criteriaKey].active !== criteria.active ||
                    acmgRanking.interVar[criteriaKey].evidence !== criteria.evidence
                  "
                  style="margin-right: 10px"
                >
                  {{ criteria.id }}: +{{ criteria.evidence }}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
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
      <div v-for="(criteria, criteriaKey) in acmgRanking.userSelected" :key="criteriaKey">
        <div v-if="criteria.evidence > 0">
          {{ criteria.active }}
          <v-switch
            color="primary"
            :label="criteria.id"
            :model-value="criteria.active"
            @update:model-value="switchCriteria(criteriaKey)"
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
      <div v-for="(criteria, criteriaKey) in acmgRanking.userSelected" :key="criteriaKey">
        <div v-if="criteria.evidence < 0">
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
          <tr v-for="(criteria, criteriaKey) in acmgRanking.userSelected" :key="criteriaKey">
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
