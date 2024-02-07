<script setup lang="ts">
import { roundIt } from '@bihealth/reev-frontend-lib/lib/utils'
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { useCadaPrioStore } from '@bihealth/reev-frontend-lib/stores/cadaPrio'
import _ from 'lodash'
import { computed, onMounted, ref, watch } from 'vue'

import {
  Ethnicity,
  Inheritance,
  InheritanceLabels,
  Sex,
  SexLabels,
  Zygosity,
  ZygosityLabels,
  ethnicityLabels,
  useCaseInfoStore
} from '@/stores/caseInfo'
import { useTermsStore } from '@/stores/terms'

const caseStore = useCaseInfoStore()
const termsStore = useTermsStore()
const cadaPrioStore = useCadaPrioStore()
const cadaPrioRankingFields = ref([
  { title: '#', key: 'rank' },
  { title: 'Gene Symbol', key: 'gene_symbol' },
  { title: 'Score', key: 'score' }
])

const form = ref(null)

const inheritanceOptions = computed(() => {
  return Object.values(Inheritance).map((value) => {
    return {
      text: InheritanceLabels.get(value),
      value: value
    }
  })
})

const ethnicityOptions = computed(() => {
  return Object.values(Ethnicity).map((value) => {
    return {
      text: ethnicityLabels.get(value),
      value: value
    }
  })
})

const sexOptions = computed(() => {
  return Object.values(Sex).map((value) => {
    return {
      text: SexLabels.get(value),
      value: value
    }
  })
})

const zygosityOptions = computed(() => {
  return Object.values(Zygosity).map((value) => {
    return {
      text: ZygosityLabels.get(value),
      value: value
    }
  })
})

const loadDataToStore = async () => {
  await caseStore.initialize()
  if (caseStore.caseInfo.hpoTerms.length > 0) {
    const hpoTermsList: string[] = caseStore.caseInfo.hpoTerms.map((term) => term.termId)
    await cadaPrioStore.loadData(hpoTermsList)
  }
}

const saveChanges = () => {
  if (!form.value) {
    return
  }
  if ((form.value as any).validate()) {
    caseStore.updateCase(caseStore.caseInfo)
  }
}

const deleteCaseInformation = () => {
  caseStore.deleteCase()
}

const validateAgeOfOnset = (value: string) => {
  const pattern = /^[0-9]*$/
  return pattern.test(value) || 'Age of onset must be a number'
}

const hpoIsLoading = ref(false)
const omimIsLoading = ref(false)
const hpoSearchQuery = ref()
const omimSearchQuery = ref()

// Debounced fetchTerms functions
const debouncedHpoFetchTerms = _.debounce(async (query: string) => {
  if (!query) return
  hpoIsLoading.value = true
  try {
    await termsStore.fetchHpoTerms(query)
  } finally {
    hpoIsLoading.value = false
  }
}, 250)

const debouncedOmimFetchTerms = _.debounce(async (query: string) => {
  if (!query) return
  omimIsLoading.value = true
  try {
    await termsStore.fetchOmimTerms(query)
  } finally {
    omimIsLoading.value = false
  }
}, 250)

onMounted(async () => {
  loadDataToStore()
})

watch(
  () => caseStore.caseInfo.hpoTerms,
  async () => {
    if (caseStore.caseInfo.hpoTerms.length > 0) {
      const hpoTermsList: string[] = caseStore.caseInfo.hpoTerms.map((term) => term.termId)
      await cadaPrioStore.loadData(hpoTermsList)
    }
  }
)
</script>

<template>
  <div v-if="caseStore.storeState === StoreState.Active">
    <v-card class="pb-0 mt-3">
      <v-row no-gutters>
        <v-col>
          <v-card-title>Case Information</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                v-model="caseStore.caseInfo.pseudonym"
                variant="outlined"
                label="Pseudonym"
              />

              <!-- Diseases -->
              <v-autocomplete
                v-model="caseStore.caseInfo.diseases"
                v-model:search="omimSearchQuery"
                :items="termsStore.omimTerms"
                :loading="omimIsLoading"
                label="Disease"
                item-title="name"
                :item-value="(item) => item"
                multiple
                chips
                closable-chips
                deletable-chips
                variant="outlined"
                prepend-icon="mdi-database-search"
                hint="Select one or more diseases"
                @update:search="debouncedOmimFetchTerms"
              />

              <!-- HPO Terms -->
              <v-autocomplete
                v-model="caseStore.caseInfo.hpoTerms"
                v-model:search="hpoSearchQuery"
                :items="termsStore.hpoTerms"
                :loading="hpoIsLoading"
                label="HPO Terms"
                item-title="name"
                :item-value="(item) => item"
                multiple
                chips
                closable-chips
                deletable-chips
                variant="outlined"
                prepend-icon="mdi-database-search"
                hint="Select one or more HPO terms"
                @update:search="debouncedHpoFetchTerms"
              />

              <!-- Inheritance -->
              <v-select
                v-model="caseStore.caseInfo.inheritance"
                variant="outlined"
                label="Inheritance"
                :items="inheritanceOptions"
                item-title="text"
                item-value="value"
              />

              <!-- Affected Family Members -->
              <v-switch
                v-model="caseStore.caseInfo.affectedFamilyMembers"
                variant="outlined"
                label="Affected Family Members"
                color="primary"
              />

              <!-- Sex -->
              <v-select
                v-model="caseStore.caseInfo.sex"
                variant="outlined"
                label="Sex"
                :items="sexOptions"
                item-title="text"
                item-value="value"
              />

              <!-- Age of Onset -->
              <v-text-field
                v-model.number="caseStore.caseInfo.ageOfOnsetMonths"
                variant="outlined"
                label="Age of Onset"
                :rules="[validateAgeOfOnset]"
              />

              <!-- Ethnicity -->
              <v-select
                v-model="caseStore.caseInfo.ethnicity"
                variant="outlined"
                label="Ethnicity"
                :items="ethnicityOptions"
                item-title="text"
                item-value="value"
              />

              <!-- Zygosity -->
              <v-select
                v-model="caseStore.caseInfo.zygosity"
                variant="outlined"
                label="Zygosity"
                :items="zygosityOptions"
                item-title="text"
                item-value="value"
              />

              <!-- Family Segregation -->
              <v-switch
                v-model="caseStore.caseInfo.familySegregation"
                label="Family Segregation"
                color="primary"
              />

              <!-- Buttons -->
              <v-btn class="ml-2" @click="saveChanges"> Save Changes </v-btn>
              <v-btn class="ml-2" color="secondary" @click="deleteCaseInformation">
                Delete Case info
              </v-btn>
            </v-form>
          </v-card-text>
        </v-col>

        <v-col v-if="cadaPrioStore.geneRanking">
          <v-card-title>Cada-prio gene ranking for current HPO:</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="cadaPrioRankingFields as any"
              :items="cadaPrioStore.geneRanking"
              :items-per-page="10"
              density="compact"
            >
              <template #[`item.gene_symbol`]="{ item }">
                <router-link
                  :to="{
                    name: 'gene-details',
                    params: { gene: item.geneSymbol }
                  }"
                  target="_blank"
                >
                  {{ item.geneSymbol }}
                </router-link>
              </template>

              <template #[`item.score`]="{ item }">
                <!-- eslint-disable vue/no-v-html -->
                <span v-html="roundIt(item.score, 2)" />
                <!-- eslint-enable -->
              </template>
            </v-data-table>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </div>
  <div v-else-if="caseStore.storeState === StoreState.Loading">
    <v-card>
      <v-progress-circular indeterminate />
    </v-card>
  </div>
  <div v-else-if="caseStore.storeState === StoreState.Error">
    <v-card>
      <v-alert type="error"> Error loading data. </v-alert>
    </v-card>
  </div>
  <div v-else>
    <v-card>
      <v-card-text>
        <v-card-title>Initial State</v-card-title>
      </v-card-text>
    </v-card>
  </div>
</template>
