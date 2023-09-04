<script setup lang="ts">
import HeaderDetailPage from '@/components/HeaderDetailPage.vue'

import { watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { StoreState } from '@/stores/misc'
import { useGenesListStore } from '@/stores/genesList'

const router = useRouter()

const genesListStore = useGenesListStore()

const loadDataToStore = async () => {
  await genesListStore.loadData(router.currentRoute.value.query)
}

// When the component is mounted or the search term is changed through
// the router then we need to fetch the gene information from the backend
// through the store.
onMounted(loadDataToStore)

watch(() => router.currentRoute.value.query, loadDataToStore)

// If geneInfoStore.storeState is StoreState.Error then redirect to the
// home page.
// watch(
//   () => genesListStore.storeState,
//   (storeState) => {
//     if (storeState == StoreState.Error) {
//         genesListStore.clearData()
//       router.push({ name: 'home' })
//     }
//   }
// )
</script>

<template>
  <HeaderDetailPage />
  <v-container class="about-view">
    <div v-if="genesListStore.storeState == StoreState.Active">
      <h2>HGNC</h2>
    </div>
    <div v-else-if="genesListStore.storeState == StoreState.Loading">
      <div class="d-flex align-center justify-center" style="min-height: 300px">
        <h1>Searching for genes</h1>
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
    </div>
    <div v-else-if="genesListStore.storeState == StoreState.Error">
      <h2>
        <v-icon color="red">mdi-alert-circle</v-icon> There was an error loading the gene
        information.
      </h2>
      <h2>Searched query:</h2>
      {{ $route.query }}
    </div>
  </v-container>
</template>
