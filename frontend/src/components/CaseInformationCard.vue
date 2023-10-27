<script setup lang="ts">
import { onMounted } from 'vue'

import { useCaseStore } from '@/stores/case'

// export interface Props {
//   caseId: string
// }

// const props = withDefaults(defineProps<Props>(), {
//   caseId: ''
// })

const caseStore = useCaseStore()

const loadDataToStore = async () => {
  await caseStore.loadCase()
}

onMounted(async () => {
  loadDataToStore()
})

const updateCaseField = (field: string, value: string) => {
  caseStore.updateCaseField(field, value)
}
</script>

<template>
  <v-card width="400">
    <v-card-title>
      Case Information
    </v-card-title>
    <v-card-text>
      <v-card-subtitle>Patient / Family specific settings</v-card-subtitle>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="caseStore.pseudonym"
            @input="$emit('update:updateCaseField', $event.target.value)"
            label="Case Pseudonym"
            outlined
            dense
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="caseStore.diseases"
            @input="$emit('update:caseStore.diseases', $event.target.value)"
            label="Case Diseases"
            outlined
            dense
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="caseStore.hpoTerms"
            @input="$emit('update:caseStore.hpoTerms', $event.target.value)"
            label="Case HPO Terms"
            outlined
            dense
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="caseStore.inheritance"
            @input="$emit('update:caseStore.inheritance', $event.target.value)"
            label="Case Inheritance"
            outlined
            dense
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="caseStore.affectedFamilyMembers"
            @input="$emit('update:caseStore.affectedFamilyMembers', $event.target.value)"
            label="Affected Family Members"
            outlined
            dense
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="caseStore.sex"
            @input="$emit('update:caseStore.sex', $event.target.value)"
            label="Sex"
            outlined
            dense
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="caseStore.ageOfOnset"
            @input="$emit('update:caseStore.ageOfOnset', $event.target.value)"
            label="Age of Onset"
            outlined
            dense
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="caseStore.ethnicity"
            @input="$emit('update:caseStore.ethinicity', $event.target.value)"
            label="Ethnicity"
            outlined
            dense
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
      <v-card-subtitle>Default settings for variant calls</v-card-subtitle>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="caseStore.zygosity"
            @input="$emit('update:caseStore.zygosity', $event.target.value)"
            label="Zygosity"
            outlined
            dense
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="caseStore.familySegregation"
            @input="$emit('update:caseStore.familySegregation', $event.target.value)"
            label="Family Segregation"
            outlined
            dense
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>