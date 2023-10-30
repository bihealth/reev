<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { Ethnicity, Inheritance, Sex, Zygosity, useCaseStore } from '@/stores/case'
import { StoreState } from '@/stores/misc'

const caseStore = useCaseStore()

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
          <v-text-field
            v-for="(disease, index) in caseStore.caseInfo.diseases"
            :key="index"
            label="Disease"
            v-model="caseStore.caseInfo.diseases[index]"
          ></v-text-field>

          <!-- HPO Terms -->
          <v-text-field
            v-for="(term, index) in caseStore.caseInfo.hpoTerms"
            :key="index"
            label="HPO Term"
            v-model="caseStore.caseInfo.hpoTerms[index]"
          ></v-text-field>

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
          <v-btn class="ml-2" @click="caseStore.clearData">Clear Data</v-btn>
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
