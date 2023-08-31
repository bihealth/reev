<script setup lang="ts">
import { watch, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { StoreState, useVariantInfoStore } from '@/stores/variantInfo'

import HeaderDetailPage from '@/components/HeaderDetailPage.vue'
import VariantDetailsGene from '@/components/VariantDetails/VariantGene.vue'
import BeaconNetwork from '@/components/VariantDetails/BeaconNetwork.vue'
import VariantDetailsClinvar from '@/components/VariantDetails/ClinVar.vue'
import VariantDetailsFreqs from '@/components/VariantDetails/VariantFreqs.vue'
import VariantDetailsVariantTools from '@/components/VariantDetails/VariantTools.vue'
import VariantDetailsTxCsq from '@/components/VariantDetails/TxCsq.vue'
import VariantDetailsConservation from '@/components/VariantDetails/VariantConservation.vue'
import VariantDetailsVariantValidator from '@/components/VariantDetails/VariantValidator.vue'

export interface Props {
  searchTerm?: string
  genomeRelease?: string
}

const props = withDefaults(defineProps<Props>(), {
  searchTerm: '',
  genomeRelease: 'grch37'
})

const router = useRouter()
const route = useRoute()

const variantInfoStore = useVariantInfoStore()

const scrollToSection = async () => {
  const sectionId = route.hash.slice(1)
  const elem = document.getElementById(sectionId)
  elem?.scrollIntoView()
}

const loadDataToStore = async () => {
  await variantInfoStore.loadData(props.searchTerm, props.genomeRelease)
  await scrollToSection()
}

// When the component is mounted or the search term is changed through
// the router then we need to fetch the variant information from the backend
// through the store.
onMounted(loadDataToStore)

watch(() => props.searchTerm, loadDataToStore)
watch(() => route.hash, scrollToSection)

// If variantInfoStore.storeState is StoreState.Error then redirect to the
// home page.
watch(
  () => variantInfoStore.storeState,
  (storeState) => {
    if (storeState == StoreState.Error) {
      variantInfoStore.clearData()
      router.push({ name: 'home' })
    }
  }
)

const SECTIONS = [
  { id: 'gene', title: 'Gene' },
  { id: 'beacon-network', title: 'Beacon Network' },
  { id: 'clinvar', title: 'ClinVar' },
  { id: 'freqs', title: 'Population Frequencies' },
  { id: 'variant-tools', title: 'Variant Tools' },
  { id: 'tx-csq', title: 'Consequences' },
  { id: 'conservation', title: 'Conservation' },
  { id: 'variant-validator', title: 'VariantValidator' }
]

// We need to use refs here because of props mutations in the parent
const searchTermRef = ref(props.searchTerm)
const genomeReleaseRef = ref(props.genomeRelease)
</script>

<template>
  <HeaderDetailPage v-model:search-term="searchTermRef" v-model:genome-release="genomeReleaseRef" />
  <v-navigation-drawer location="right" class="overflow-auto">
    <div v-if="variantInfoStore.storeState == StoreState.Active" class="variant-info">
      <v-list density="compact" nav>
        <v-list-item
          v-for="section in SECTIONS"
          :key="section.id"
          @click="router.push({ hash: `#${section.id}` })"
        >
          <v-list-item-title>{{ section.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
  <v-layout>
    <v-main style="min-height: 300px">
      <div v-if="variantInfoStore.storeState == StoreState.Active" class="variant-info">
        <div id="gene" class="variant-item">
          <h2>Gene</h2>
          <router-link
            :to="{
              name: 'gene',
              params: {
                searchTerm: `HGNC:1100`,
                genomeRelease: genomeReleaseRef
              }
            }"
          >
            <h3>
              Link to {{ variantInfoStore.varAnnos?.result?.cadd.GeneName }}
              <v-icon>mdi-open-in-new</v-icon>
            </h3>
          </router-link>
          <v-divider />
          <VariantDetailsGene :gene="variantInfoStore.geneInfo" />
        </div>

        <div id="beacon-network" class="variant-item">
          <h2>Beacon Network</h2>
          <v-divider />
          <BeaconNetwork :small-variant="variantInfoStore.smallVariant" />
        </div>

        <div id="clinvar" class="variant-item">
          <h2>ClinVar</h2>
          <v-divider />
          <VariantDetailsClinvar :clinvar="variantInfoStore.varAnnos.clinvar" />
        </div>

        <div id="freqs" class="variant-item">
          <h2>Population Frequencies</h2>
          <v-divider />
          <VariantDetailsFreqs
            :small-var="variantInfoStore.smallVariant"
            :var-annos="variantInfoStore.varAnnos"
          />
        </div>

        <div id="variant-tools" class="variant-item">
          <h2>Variant Tools</h2>
          <v-divider />
          <VariantDetailsVariantTools
            :small-var="variantInfoStore.smallVariant"
            :var-annos="variantInfoStore.varAnnos"
          />
        </div>

        <div id="tx-csq" class="variant-item">
          <h2>Consequences</h2>
          <v-divider />
          <VariantDetailsTxCsq :tx-csq="variantInfoStore.txCsq" />
        </div>

        <div id="conservation" class="variant-item">
          <h2>Conservation</h2>
          <v-divider />
          <VariantDetailsConservation :var-annos="variantInfoStore.varAnnos" />
        </div>

        <div id="variant-validator" class="variant-item">
          <h2>Variant Validator</h2>
          <v-divider />
          <VariantDetailsVariantValidator :small-variant="variantInfoStore.smallVariant" />
        </div>
      </div>

      <div v-else>
        <div class="d-flex align-center justify-center" style="min-height: 300px">
          <h1>Loading variant information</h1>
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
      </div>
    </v-main>
  </v-layout>
</template>

<style scoped>
.variant-info {
  width: 95%;
  margin: 20px;
}

.variant-item {
  margin-bottom: 20px;
  border: 2px solid rgb(111, 100, 210);
  border-radius: 10px;
  padding: 5px 10px;
}
</style>
