<script setup lang="ts">
import _ from 'lodash'
import { onMounted, ref } from 'vue'

import { Ethnicity, Inheritance, Sex, Zygosity, useCaseStore } from '@/stores/case'
import { useHpoTermsStore } from '@/stores/hpoTerms'
import { StoreState } from '@/stores/misc'

const caseStore = useCaseStore()
const hpoTermsStore = useHpoTermsStore()

const form = ref(null)

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

const isLoading = ref(false)
const searchQuery = ref()

// Debounced fetchTerms function
const debouncedFetchTerms = _.debounce(async (query: string) => {
  if (!query) return
  isLoading.value = true
  try {
    await hpoTermsStore.fetchHpoTerms(query)
  } finally {
    isLoading.value = false
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
          <v-text-field label="Pseudonym" v-model="caseStore.caseInfo.pseudonym"></v-text-field>

          <!-- Diseases -->
          <v-autocomplete
            v-model="caseStore.caseInfo.diseases"
            v-model:search="searchQuery"
            :items="hpoTermsStore.hpoTerms"
            :loading="isLoading"
            @update:search="debouncedFetchTerms"
            label="Disease"
            item-title="name"
            :item-value="(item) => item"
            multiple
            chips
            clearable
            deletable-chips
            auto-select-first
            prepend-icon="mdi-database-search"
            hint="Select one or more diseases"
          >
          </v-autocomplete>

          <!-- HPO Terms -->
          <v-autocomplete
            v-model="caseStore.caseInfo.hpoTerms"
            v-model:search="searchQuery"
            :items="hpoTermsStore.hpoTerms"
            :loading="isLoading"
            @update:search="debouncedFetchTerms"
            label="HPO Terms"
            item-title="name"
            :item-value="(item) => item"
            multiple
            chips
            clearable
            deletable-chips
            auto-select-first
            prepend-icon="mdi-database-search"
            hint="Select one or more HPO terms"
          >
          </v-autocomplete>

          <!-- Inheritance -->
          <v-select
            label="Inheritance"
            :items="Object.values(Inheritance)"
            v-model="caseStore.caseInfo.inheritance"
          ></v-select>

          <!-- Affected Family Members -->
          <v-switch
            label="Affected Family Members"
            v-model="caseStore.caseInfo.affectedFamilyMembers"
            color="primary"
          ></v-switch>

          <!-- Sex -->
          <v-select
            label="Sex"
            :items="Object.values(Sex)"
            v-model="caseStore.caseInfo.sex"
          ></v-select>

          <!-- Age of Onset -->
          <v-text-field
            label="Age of Onset"
            v-model.number="caseStore.caseInfo.ageOfOnsetMonths"
          ></v-text-field>

          <!-- Ethnicity -->
          <v-select
            label="Ethnicity"
            :items="Object.values(Ethnicity)"
            v-model="caseStore.caseInfo.ethnicity"
          ></v-select>

          <!-- Zygosity -->
          <v-select
            label="Zygosity"
            :items="Object.values(Zygosity)"
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
