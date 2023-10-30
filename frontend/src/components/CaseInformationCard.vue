<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useCaseStore } from '@/stores/case'
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
  console.log('form', form.value)
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

          <v-text-field
            v-for="(disease, index) in caseStore.caseInfo.diseases"
            :key="index"
            label="Disease"
            v-model="caseStore.caseInfo.diseases[index]"
          ></v-text-field>

          <v-text-field
            v-for="(term, index) in caseStore.caseInfo.hpoTerms"
            :key="index"
            label="HPO Term"
            v-model="caseStore.caseInfo.hpoTerms[index]"
          ></v-text-field>

          <v-text-field label="Inheritance" v-model="caseStore.caseInfo.inheritance"></v-text-field>

          <v-text-field
            v-for="(member, index) in caseStore.caseInfo.affectedFamilyMembers"
            :key="index"
            label="Affected Family Member"
            v-model="caseStore.caseInfo.affectedFamilyMembers[index]"
          ></v-text-field>

          <v-select
            label="Sex"
            :items="['Male', 'Female']"
            v-model="caseStore.caseInfo.sex"
          ></v-select>

          <v-text-field label="Age of Onset" v-model="caseStore.caseInfo.ageOfOnset"></v-text-field>

          <v-text-field label="Ethnicity" v-model="caseStore.caseInfo.ethnicity"></v-text-field>

          <v-select
            label="Zygosity"
            :items="['Heterozygous', 'Homozygous', 'Compound Heterozygous']"
            v-model="caseStore.caseInfo.zygosity"
          ></v-select>

          <v-text-field
            label="Family Segregation"
            v-model="caseStore.caseInfo.familySegregation"
          ></v-text-field>

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
