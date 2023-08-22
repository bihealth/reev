<script setup lang="ts">
import Header from '@/components/HeaderDefault.vue'
</script>

<template>
  <Header />
  <v-container class="about-view">
    <v-row>
      <v-col cols="12">
        <h2 class="title">About REEV</h2>
        <p class="description">
          REEV (REEV: Explanation and Evaluation of Variants) is a web-based tool designed to assist
          clinicians and researchers in the field of rare disease genetics. This tool empowers users
          by providing comprehensive and aggregated information on genomic variants.
        </p>
        <p class="description">
          Whether you're a medical professional seeking insights into genetic variations or a
          researcher investigating rare diseases, REEV is here to streamline your workflow. Our
          platform combines cutting-edge technology with user-friendly interfaces to ensure that you
          have the resources you need to make informed decisions.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.about-view {
  padding: 40px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.description {
  font-size: 16px;
  margin-bottom: 20px;
}
</style>
