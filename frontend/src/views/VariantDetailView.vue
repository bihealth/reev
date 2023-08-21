<script setup lang="ts">
import { useGeneDataStore } from '@/stores/geneData'

import Header from '@/components/HeaderDetailPage.vue'

const geneDataStore = useGeneDataStore()
const geneData = geneDataStore.geneData
</script>

<template>
  <Header />
  <v-layout class="rounded rounded-md">
    <v-app-bar title="Application bar"></v-app-bar>

    <v-navigation-drawer>
      <v-list>
        <v-list-item title="Navigation drawer"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center" style="min-height: 300px">
      <div class="variant-details">
        <h1>Variant Detail View</h1>
        <pre>{{ geneData }}</pre>
      </div>
    </v-main>
  </v-layout>
</template>
