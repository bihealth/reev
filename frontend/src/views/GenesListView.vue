<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useGenesListStore } from '@/stores/genesList'
import { StoreState } from '@/stores/misc'

// Components
const HeaderDetailPage = defineAsyncComponent(() => import('@/components/HeaderDetailPage.vue'))

export interface Props {
  genomeRelease?: string
}

const props = withDefaults(defineProps<Props>(), {
  genomeRelease: 'grch38'
})

const router = useRouter()

const genesListStore = useGenesListStore()

const searchTermRef = ref(String(router.currentRoute.value.query.q))
const genomeReleaseRef = ref(props.genomeRelease)

const loadDataToStore = async () => {
  await genesListStore.loadData(router.currentRoute.value.query)
}

// When the component is mounted or the search term is changed through
// the router then we need to fetch the gene information from the backend
// through the store.
onMounted(loadDataToStore)

watch(() => router.currentRoute.value.query, loadDataToStore)

// If variantInfoStore.storeState is StoreState.Error then redirect to the
// home page.
watch(
  () => genesListStore.storeState,
  (storeState) => {
    if (storeState == StoreState.Redirect) {
      router.replace({
        name: 'gene',
        params: { searchTerm: genesListStore.redirectHgncId, genomeRelease: genomeReleaseRef.value }
      })
      genesListStore.clearData()
    }
  }
)

const examples = ['BRCA', 'BRAF', 'EMP', 'TP53']

const useExample = (example: string) => {
  searchTermRef.value = example
}
</script>

<template>
  <HeaderDetailPage v-model:search-term="searchTermRef" v-model:genome-release="genomeReleaseRef" />
  <v-container class="about-view">
    <v-card v-if="genesListStore.storeState == StoreState.Active">
      <v-card-title>Search results for:</v-card-title>
      <v-card-text>
        Search term: <strong>{{ $router.currentRoute.value.query.q }}</strong>
      </v-card-text>

      <v-card-item v-for="gene in genesListStore.genesList" :key="gene.data.hgnc_id">
        <v-card variant="outlined" class="gene-item">
          <v-card-title>
            <h2>{{ gene.data.symbol }}</h2>
            <router-link
              :to="{
                name: 'gene',
                params: { searchTerm: gene.data.hgnc_id, genomeRelease: 'grch38' }
              }"
            >
              {{ gene.data.hgnc_id }} <v-icon>mdi-launch</v-icon>
            </router-link>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div><strong>Name:</strong> {{ gene.data?.name }}</div>
            <div><strong>Symbol:</strong> {{ gene.data?.symbol }}</div>
            <div><strong>Full name:</strong> {{ gene.data?.name }}</div>
            <div><strong>Alias symbol:</strong> {{ gene.data?.alias_symbol }}</div>
            <div><strong>Alias name:</strong> {{ gene.data?.alias_name }}</div>
            <div><strong>Ensembl id:</strong> {{ gene.data?.ensembl_gene_id }}</div>
            <div><strong>NCBI id:</strong> {{ gene.data?.ncbi_gene_id }}</div>
          </v-card-text>
        </v-card>
      </v-card-item>
    </v-card>

    <v-card v-else-if="genesListStore.storeState == StoreState.Loading">
      <div class="d-flex align-center justify-center" style="min-height: 300px">
        <v-card-title>Searching for genes</v-card-title>
        <v-progress-circular indeterminate />
      </div>
    </v-card>

    <v-card v-else-if="genesListStore.storeState == StoreState.Error">
      <v-card-title>
        <v-icon color="red"> mdi-alert-circle </v-icon>
        There was an error while searching for
        <strong>{{ $router.currentRoute.value.query.q }}</strong>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-card-title>Try this examples:</v-card-title>
        <v-card-text class="examples">
          <div v-for="example in examples" :key="example">
            <v-btn class="example" @click="useExample(example)">
              {{ example }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.examples {
  display: flex;
  flex-direction: column;
}

.example {
  width: 150px;
  margin-top: 10px;
  cursor: pointer;
  /* border: 2px solid rgb(229, 85, 64);
  border-radius: 10px; */
  padding: 5px 10px;
}

.gene-item {
  margin-top: 20px;
  /* border: 2px solid rgb(229, 85, 64);
  border-radius: 10px; */
  padding: 5px 10px;
}
</style>
