<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// Components
const HeaderDefault = defineAsyncComponent(() => import('@/components/HeaderDefault.vue'))

type AcknowledgementsType = {
  [key: string]: {
    name: string
    url: string
    description: string
    doi?: string
  }
}

const Acknowledgements: AcknowledgementsType = {
  ClinVar: {
    name: 'ClinVar',
    url: 'https://www.ncbi.nlm.nih.gov/clinvar/',
    description:
      'ClinVar is a freely accessible, public archive ' +
      'of reports of the relationships among human variations ' +
      'and phenotypes, with supporting evidence.',
    doi: 'DOI: 10.1093/nar/gkx1153'
  },
  Coral: {
    name: 'Coral emoji',
    url: 'https://openmoji.org/library/emoji-1FAB8/',
    description: 'Coral emoji from OpenMoji',
    doi: ''
  }
}
</script>

<template>
  <HeaderDefault />
  <v-container class="about-view">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>About REEV</v-card-title>
          <v-divider />
          <v-card-text>
            <p class="description">
              REEV (REEV Explains and Evaluates Variants) is a web-based tool designed to assist
              clinicians and researchers in the field of rare disease genetics. This tool empowers
              users by providing comprehensive and aggregated information on genomic variants.
            </p>
            <p class="description">
              Whether you're a medical professional seeking insights into genetic variations or a
              researcher investigating rare diseases, REEV is here to streamline your workflow. Our
              platform combines cutting-edge technology with user-friendly interfaces to ensure that
              you have the resources you need to make informed decisions.
            </p></v-card-text
          ></v-card
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Acknowledgements:</v-card-title>
          <v-divider />
          <v-card-text>
            <p class="description">
              <v-list lines="two">
                <v-list-item v-for="ack in Object.values(Acknowledgements)" :key="ack.name">
                  <v-list-item-title>
                    <a :href="ack.url" target="_blank">{{ ack.name }}</a>
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ ack.description }}</v-list-item-subtitle>
                  <!-- If there is a doi, then display it -->
                  <v-list-item-subtitle v-if="ack.doi">
                    <a :href="'https://doi.org/' + ack.doi" target="_blank">{{ ack.doi }}</a>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </p></v-card-text
          ></v-card
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.about-view {
  padding: 40px;
}

.description {
  font-size: 16px;
  margin-bottom: 20px;
}
</style>
