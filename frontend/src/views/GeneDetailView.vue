<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BookmarkListItem from '@/components/BookmarkListItem.vue'
import { useCaseStore } from '@/stores/case'
import { useGeneInfoStore } from '@/stores/geneInfo'
import { StoreState } from '@/stores/misc'

// Components
const HeaderDetailPage = defineAsyncComponent(() => import('@/components/HeaderDetailPage.vue'))
const OverviewCard = defineAsyncComponent(() => import('@/components/GeneDetails/OverviewCard.vue'))
const PathogenicityCard = defineAsyncComponent(
  () => import('@/components/GeneDetails/PathogenicityCard.vue')
)
const ConditionsCard = defineAsyncComponent(
  () => import('@/components/GeneDetails/ConditionsCard.vue')
)
const ExpressionCard = defineAsyncComponent(
  () => import('@/components/GeneDetails/ExpressionCard.vue')
)
const ClinvarCard = defineAsyncComponent(() => import('@/components/GeneDetails/ClinvarCard.vue'))

export interface Props {
  searchTerm?: string
  genomeRelease?: 'grch37' | 'grch38'
}

const props = withDefaults(defineProps<Props>(), {
  searchTerm: '',
  genomeRelease: 'grch37'
})

const router = useRouter()
const route = useRoute()

const geneInfoStore = useGeneInfoStore()
const caseStore = useCaseStore()

const scrollToSection = async () => {
  const sectionId = route.hash.slice(1)
  if (sectionId) {
    const elem = document.getElementById(sectionId)
    elem?.scrollIntoView()
  }
}

const loadDataToStore = async () => {
  await geneInfoStore.loadData(props.searchTerm, props.genomeRelease)
  await caseStore.loadCase()
  await scrollToSection()
}

// When the component is mounted or the search term is changed through
// the router then we need to fetch the gene information from the backend
// through the store.
onMounted(loadDataToStore)

watch(() => props.searchTerm, loadDataToStore)
watch(() => route.hash, scrollToSection)

// If geneInfoStore.storeState is StoreState.Error then redirect to the
// home page.
watch(
  () => geneInfoStore.storeState,
  (storeState) => {
    if (storeState == StoreState.Error) {
      geneInfoStore.clearData()
      router.push({ name: 'home' })
    }
  }
)

const SECTIONS = [
  { id: 'gene-overview', title: 'Overview' },
  { id: 'gene-pathogenicity', title: 'Pathogenicity' },
  { id: 'gene-conditions', title: 'Conditions' },
  { id: 'gene-expression', title: 'Expression' },
  { id: 'gene-clinvar', title: 'ClinVar' }
]

// We need to use refs here because of props mutations in the parent
const searchTermRef = ref(props.searchTerm)
const genomeReleaseRef = ref<'grch37' | 'grch38'>(props.genomeRelease)

// The `v-list-group` API needs this here so we can enable sections by default.
const openedSection = ref<string[]>(['gene'])
</script>

<template>
  <v-app>
    <HeaderDetailPage
      v-model:search-term="searchTermRef"
      v-model:genome-release="genomeReleaseRef"
    />

    <v-navigation-drawer :elevation="3" :permanent="true">
      <div v-if="geneInfoStore.storeState == StoreState.Active">
        <v-list v-model:opened="openedSection">
          <v-list-subheader> GENE </v-list-subheader>

          <BookmarkListItem :type="'gene'" :id="searchTermRef" />

          <v-list-group value="gene">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-dna" title="Gene"></v-list-item>
            </template>

            <v-list-item
              v-for="section in SECTIONS"
              :key="section.id"
              :id="`${section.id}-nav`"
              density="compact"
              @click="router.push({ hash: `#${section.id}` })"
            >
              <v-list-item-title>
                {{ section.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list>
      </div>
    </v-navigation-drawer>
    <v-main class="my-3 mx-3">
      <div id="gene-overview">
        <OverviewCard :geneInfo="geneInfoStore.geneInfo" />
      </div>

      <div id="gene-pathogenicity">
        <PathogenicityCard :gene-info="geneInfoStore.geneInfo" />
      </div>

      <div id="phenotype">
        <div id="gene-conditions">
          <ConditionsCard :geneInfo="geneInfoStore.geneInfo" :hpo-terms="geneInfoStore.hpoTerms" />
        </div>
      </div>

      <div id="gene-expression">
        <ExpressionCard
          :gene-symbol="geneInfoStore.geneInfo?.hgnc?.symbol"
          :expression-records="geneInfoStore.geneInfo?.gtex?.records"
          :ensembl-gene-id="geneInfoStore.geneInfo?.gtex?.ensemblGeneId"
        />
      </div>

      <div id="gene-clinvar">
        <ClinvarCard
          :gene-clinvar="geneInfoStore.geneClinvar"
          :transcripts="geneInfoStore.transcripts"
          :genome-release="genomeReleaseRef"
          :gene-info="geneInfoStore?.geneInfo"
          :per-freq-counts="geneInfoStore?.geneClinvar?.perFreqCounts"
        />
      </div>
    </v-main>
  </v-app>
</template>
