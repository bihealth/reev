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
const exampleData = {
  genes: [
    {
      score: 0.8,
      data: {
        hgnc_id: 'HGNC:1100',
        symbol: 'BRCA1',
        name: 'BRCA1 DNA repair associated',
        alias_symbol: ['RNF53', 'BRCC1', 'PPP1R53', 'FANCS'],
        alias_name: [
          'BRCA1/BRCA2-containing complex, subunit 1',
          'protein phosphatase 1, regulatory subunit 53',
          'Fanconi anemia, complementation group S'
        ],
        ensembl_gene_id: 'ENSG00000012048',
        ncbi_gene_id: '672'
      }
    },
    {
      score: 0.8,
      data: {
        hgnc_id: 'HGNC:1101',
        symbol: 'BRCA2',
        name: 'BRCA2 DNA repair associated',
        alias_symbol: ['FAD', 'FAD1', 'BRCC2', 'XRCC11'],
        alias_name: ['BRCA1/BRCA2-containing complex, subunit 2'],
        ensembl_gene_id: 'ENSG00000139618',
        ncbi_gene_id: '675'
      }
    },
    {
      score: 0.5714286,
      data: {
        hgnc_id: 'HGNC:28470',
        symbol: 'BRCA1P1',
        name: 'BRCA1 pseudogene 1',
        alias_symbol: ['LBRCA1', 'PsiBRCA1', 'pseudo-BRCA1'],
        alias_name: ['like-BRCA1'],
        ensembl_gene_id: 'ENSG00000267595',
        ncbi_gene_id: '394269'
      }
    }
  ]
}
</script>

<template>
  <HeaderDetailPage />
  <v-container class="about-view">
    <div v-if="genesListStore.storeState == StoreState.Active">
      <h2>Search results:</h2>

      <div v-for="gene in genesListStore.genesList" :key="gene.data.hgnc_id">
        <v-card class="gene-item">
          <v-card-title>
            <h2>{{ gene.data.symbol }}</h2>
            <router-link
              :to="{
                name: 'gene',
                params: { searchTerm: gene.data.hgnc_id, genomeRelease: 'grch37' }
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
      </div>
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
      <v-divider />
      <h2>Example data:</h2>

      <div v-for="gene in exampleData.genes" :key="gene.data.hgnc_id">
        <v-card class="gene-item">
          <v-card-title>
            <h2>{{ gene.data.symbol }}</h2>
            <router-link
              :to="{
                name: 'gene',
                params: { searchTerm: gene.data.hgnc_id, genomeRelease: 'grch37' }
              }"
            >
              {{ gene.data.hgnc_id }} <v-icon>mdi-launch</v-icon>
            </router-link>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div><strong>Name:</strong> {{ gene.data.name }}</div>
            <div><strong>Symbol:</strong> {{ gene.data.symbol }}</div>
            <div><strong>Full name:</strong> {{ gene.data.name }}</div>
            <div><strong>Alias symbol:</strong> {{ gene.data.alias_symbol }}</div>
            <div><strong>Alias name:</strong> {{ gene.data.alias_name }}</div>
            <div><strong>Ensembl id:</strong> {{ gene.data.ensembl_gene_id }}</div>
            <div><strong>NCBI id:</strong> {{ gene.data.ncbi_gene_id }}</div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.gene-item {
  margin-bottom: 20px;
  border: 2px solid rgb(229, 85, 64);
  border-radius: 10px;
  padding: 5px 10px;
}
</style>
