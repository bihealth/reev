<!--
This component displays the `ClinvarsubThreadList` component for the profile.
-->
<script setup lang="ts">
import ClinvarsubThreadList from '../ClinvarsubCard/ClinvarsubThreadList.vue'
</script>

<template>
  <v-card>
    <v-card-title class="pb-0"> ClinVar Submission Activity </v-card-title>
    <v-card-subtitle class="text-overline"> Your ClinVar Submission Activity </v-card-subtitle>
    <v-card-text>
      <p class="text-body-1">
        Below, you can all of your submission activity. You can create new activity from the
        sequence and structural variant details pages.
      </p>

      <ClinvarsubThreadList :show-variant-links="true" />
    </v-card-text>
  </v-card>
</template>
