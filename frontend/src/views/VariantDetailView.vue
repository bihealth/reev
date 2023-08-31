<script setup lang="ts">
import { watch, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { StoreState, useVariantInfoStore } from '@/stores/variantInfo'

import HeaderDetailPage from '@/components/HeaderDetailPage.vue'
// import VariantDetailsGene from '@/components/VariantDetails/Gene.vue'
// import VariantDetailsClinvar from '@/components/VariantDetails/Clinvar.vue'
// import VariantDetailsFreqs from '@/components/VariantDetails/Freqs.vue'
// import VariantDetailsComments from '@/components/VariantDetails/Comments.vue'
// import VariantDetailsFlags from '@/components/VariantDetails/Flags.vue'
// import VariantDetailsCallDetails from '@/components/VariantDetails/CallDetails.vue'
// import VariantDetailsConservation from '@/components/VariantDetails/Conservation.vue'
// import VariantDetailsVariantTools from '@/components/VariantDetails/VariantTools.vue'
// import VariantDetailsGa4ghBeacons from '@/components/VariantDetails/Ga4ghBeacons.vue'
// import VariantDetailsTxCsq from '@/components/VariantDetails/TxCsq.vue'
// import VariantDetailsVariantValidator from '@/components/VariantDetails/VariantValidator.vue'
// import VariantDetailsAcmgRating from '@/components/VariantDetails/AcmgRating.vue'

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
  { id: 'external-resources', title: 'External Resources' },
  { id: 'variant-tools', title: 'Variant Tools' },
  { id: 'tx-csq', title: 'Consequences' },
  { id: 'call-details', title: 'Call Details' },
  { id: 'conservation', title: 'Conservation' },
  { id: 'flags', title: 'Flags' },
  { id: 'comments', title: 'Comments' },
  { id: 'acmg-rating', title: 'ACMG Rating' },
  { id: 'second-hit', title: 'Second Hit' },
  { id: 'other-carriers', title: 'OtherCarriers' },
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
        <h2>Variant</h2>
        {{ variantInfoStore.smallVariant }}
        <v-divider />
        <h2>VariantInfo</h2>
        {{ variantInfoStore.variantInfo }}

        <div id="gene" class="variant-item" title="Gene">
          <h3>Gene</h3>
        </div>
        <!-- <div
          id="beacon-network"
          class="variant-item"
          title="Beacon Network"
          v-if="queryStore.ga4ghBeaconNetworkWidgetEnabled"
        >
          <VariantDetailsGa4ghBeacons :small-variant="variantInfoStore.smallVariant" />
        </div>
        <div id="clinvar" class="variant-item" title="ClinVar">
          <VariantDetailsClinvar />
        </div>
        <div id="freqs" class="variant-item" title="Population Frequencies">
          <VariantDetailsFreqs
            :small-var="variantInfoStore.smallVariant"
            :var-annos="variantInfoStore.varAnnos"
          />
        </div>
        <div id="variant-tools" class="variant-item" title="Variant Tools">
          <VariantDetailsVariantTools
            :small-var="variantInfoStore.smallVariant"
            :var-annos="variantInfoStore.varAnnos"
            :umd-predictor-api-token="queryStore.umdPredictorApiToken"
          />
        </div>
        <div id="tx-csq" class="variant-item" title="Consequences">
          <VariantDetailsTxCsq :tx-csq="variantInfoStore.txCsq" />
        </div>
        <div id="call-details" class="variant-item" title="Call Details">
          <VariantDetailsCallDetails
            :case-description="caseDetailsStore.caseObj"
            :small-variant="variantInfoStore.smallVariant?.payload"
          />
        </div>
        <div id="conservation" class="variant-item" title="Conservation">
          <VariantDetailsConservation :var-annos="variantInfoStore.varAnnos" />
        </div>
        <div id="flags" class="variant-item" title="Flags">
          <VariantDetailsFlags
            :flags-store="variantFlagsStore"
            :variant="variantInfoStore.smallVariant"
          />
        </div>
        <div id="comments" class="variant-item" title="Comments">
          <VariantDetailsComments
            :comments-store="variantCommentsStore"
            :variant="variantInfoStore.smallVariant"
          />
        </div>
        <div id="acmg-rating" class="variant-item" title="ACMG Rating">
          <VariantDetailsAcmgRating :small-variant="variantInfoStore.smallVariant" />
        </div>
        <div id="second-hit" class="variant-item" title="Second Hit">
          <div class="alert alert-secondary">
            <i-mdi-clock />
            Work in progress ...
          </div>
        </div>
        <div id="other-carriers" class="variant-item" title="OtherCarriers">
          <div class="alert alert-secondary">
            <i-mdi-clock />
            Work in progress ...
          </div>
        </div>
        <div id="variant-validator" class="variant-item" title="VariantValidator">
          <VariantDetailsVariantValidator :small-variant="variantInfoStore.smallVariant" />
        </div> -->
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
