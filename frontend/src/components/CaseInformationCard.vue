<script setup lang="ts">
import _ from 'lodash'
import { computed, onMounted, ref } from 'vue'

import {
  Ethnicity,
  Inheritance,
  InheritanceLabels,
  Sex,
  SexLabels,
  Zygosity,
  ZygosityLabels,
  ethinicityLabels,
  useCaseStore
} from '@/stores/case'
import { StoreState } from '@/stores/misc'
import { useTermsStore } from '@/stores/terms'

const caseStore = useCaseStore()
const termsStore = useTermsStore()

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
      text: ethinicityLabels.get(value),
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
  await caseStore.loadCase()
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
</script>

<template>
  <div v-if="caseStore.storeState === StoreState.Active">
    <v-card class="case-card">
      <v-card-title>Case Information</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            variant="outlined"
            label="Pseudonym"
            v-model="caseStore.caseInfo.pseudonym"
          ></v-text-field>

          <!-- Diseases -->
          <v-autocomplete
            v-model="caseStore.caseInfo.diseases"
            v-model:search="omimSearchQuery"
            :items="termsStore.omimTerms"
            :loading="omimIsLoading"
            @update:search="debouncedOmimFetchTerms"
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
          >
          </v-autocomplete>

          <!-- HPO Terms -->
          <v-autocomplete
            v-model="caseStore.caseInfo.hpoTerms"
            v-model:search="hpoSearchQuery"
            :items="termsStore.hpoTerms"
            :loading="hpoIsLoading"
            @update:search="debouncedHpoFetchTerms"
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
          >
          </v-autocomplete>

          <!-- Inheritance -->
          <v-select
            variant="outlined"
            label="Inheritance"
            :items="inheritanceOptions"
            item-title="text"
            item-value="value"
            v-model="caseStore.caseInfo.inheritance"
          ></v-select>

          <!-- Affected Family Members -->
          <v-switch
            variant="outlined"
            label="Affected Family Members"
            v-model="caseStore.caseInfo.affectedFamilyMembers"
            color="primary"
          ></v-switch>

          <!-- Sex -->
          <v-select
            variant="outlined"
            label="Sex"
            :items="sexOptions"
            item-title="text"
            item-value="value"
            v-model="caseStore.caseInfo.sex"
          ></v-select>

          <!-- Age of Onset -->
          <v-text-field
            variant="outlined"
            label="Age of Onset"
            v-model.number="caseStore.caseInfo.ageOfOnsetMonths"
            :rules="[validateAgeOfOnset]"
          ></v-text-field>

          <!-- Ethnicity -->
          <v-select
            variant="outlined"
            label="Ethnicity"
            :items="ethnicityOptions"
            item-title="text"
            item-value="value"
            v-model="caseStore.caseInfo.ethnicity"
          ></v-select>

          <!-- Zygosity -->
          <v-select
            variant="outlined"
            label="Zygosity"
            :items="zygosityOptions"
            item-title="text"
            item-value="value"
            v-model="caseStore.caseInfo.zygosity"
          ></v-select>

          <!-- Family Segregation -->
          <v-switch
            label="Family Segregation"
            v-model="caseStore.caseInfo.familySegregation"
            color="primary"
          ></v-switch>

          <!-- Buttons -->
          <v-btn class="ml-2" @click="saveChanges">Save Changes</v-btn>
          <v-btn class="ml-2" color="secondary" @click="deleteCaseInformation"
            >Delete Case info</v-btn
          >
        </v-form>
      </v-card-text>
    </v-card>
  </div>
  <div v-else-if="caseStore.storeState === StoreState.Loading">
    <v-card>
      <v-progress-circular indeterminate></v-progress-circular>
    </v-card>
  </div>
  <div v-else-if="caseStore.storeState === StoreState.Error">
    <v-card>
      <v-alert type="error">Error loading data.</v-alert>
    </v-card>
  </div>
  <div v-else>
    <v-card>
      <v-card-text>
        <p>Initial State</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.case-card {
  min-width: 600px;
}
</style>
