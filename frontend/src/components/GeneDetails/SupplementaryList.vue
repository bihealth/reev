<script setup lang="ts">
export interface Props {
  acmgSf: any
}

const props = withDefaults(defineProps<Props>(), {
  acmgSf: null
})
</script>

<template>
  <v-card>
    <v-card-title>ACMG Supplementary Findings List</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div v-if="props.acmgSf">
        <div>
          <strong>since ACMG SF:</strong>
          v{{ props.acmgSf.sf_list_version }}
        </div>
        <div><strong>inheritance:</strong> {{ props.acmgSf.inheritance }}</div>
        <div>
          <strong>phenotype:</strong>
          {{ props.acmgSf.phenotype_category }} /
          {{ props.acmgSf.disease_phenotype }}
        </div>
      </div>
      <div v-else>Gene is not on ACMG SF list.</div>
    </v-card-text>
  </v-card>
</template>
