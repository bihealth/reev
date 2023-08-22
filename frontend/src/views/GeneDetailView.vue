<script setup lang="ts">
import { watch, onMounted } from 'vue'

import { StoreState, useGeneInfoStore } from '@/stores/geneInfo'

import HeaderDetailPage from '@/components/HeaderDetailPage.vue'

export interface Props {
  searchTerm?: string
}

const props = withDefaults(defineProps<Props>(), {
  searchTerm: ''
})

const geneInfoStore = useGeneInfoStore()

const loadDataToStore = async () => geneInfoStore.loadData(props.searchTerm)

// When the component is mounted or the search term is changed through
// the router then we need to fetch the gene information from the backend
// through the store.

onMounted(loadDataToStore)

watch(() => props.searchTerm, loadDataToStore)
</script>

<template>
  <HeaderDetailPage />
  <v-layout class="rounded rounded-md">
    <v-app-bar title="Application bar"></v-app-bar>

    <v-navigation-drawer>
      <v-list>
        <v-list-item title="Navigation drawer"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center" style="min-height: 300px">
      <p>{{ xz }}</p>
      <div v-if="geneInfoStore.storeState == StoreState.Active" class="gene-details">
        <h1>Gene Detail View</h1>
        <pre>{{ JSON.stringify(geneInfoStore.geneInfo, null, 2).slice(0, 1000) }}</pre>
      </div>

      <div v-else>
        <h1>Loading gene information</h1>
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
    </v-main>
  </v-layout>
</template>
