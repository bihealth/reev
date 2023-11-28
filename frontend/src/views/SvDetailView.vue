<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { StoreState } from '@/stores/misc'
import { useSvInfoStore } from '@/stores/svInfo'
import { type SvRecord } from '@/stores/svInfo'

// Components
const BookmarkButton = defineAsyncComponent(() => import('@/components/BookmarkButton.vue'))
const GenomeBrowser = defineAsyncComponent(() => import('@/components/GenomeBrowser.vue'))
const HeaderDetailPage = defineAsyncComponent(() => import('@/components/HeaderDetailPage.vue'))
const AcmgRating = defineAsyncComponent(() => import('@/components/SvDetails/AcmgRating.vue'))
const SvDetailsClinvar = defineAsyncComponent(
  () => import('@/components/SvDetails/SvDetailsClinvar.vue')
)
const SvDetailsGenes = defineAsyncComponent(() => import('@/components/SvDetails/SvGenes.vue'))
const SvTools = defineAsyncComponent(() => import('@/components/SvDetails/SvTools.vue'))

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

const svInfoStore = useSvInfoStore()

const scrollToSection = async () => {
  const sectionId = route.hash.slice(1)
  const elem = document.getElementById(sectionId)
  elem?.scrollIntoView()
}

const loadDataToStore = async () => {
  await svInfoStore.loadData(props.searchTerm, props.genomeRelease)
  await scrollToSection()
}

// Pretty display of coordinates.
const svLocus = (record: SvRecord): string | undefined => {
  if (!record) {
    return undefined
  }

  let locus: string
  if (record.sv_type === 'BND' || record.sv_type === 'INS') {
    locus = `${record.chromosome}:${parseInt(record.start) - 1000}-${parseInt(record.start) + 1000}`
  } else {
    locus = `${record.chromosome}:${parseInt(record.start) - 1000}-${parseInt(record.end) + 1000}`
  }
  if (!locus.startsWith('chr') && record.release === 'GRCh38') {
    locus = `chr${locus}`
  } else if (locus.startsWith('chr') && record.release === 'GRCh37') {
    locus = locus.substring(3)
  }
  return locus
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
  () => svInfoStore.storeState,
  (storeState) => {
    if (storeState == StoreState.Error) {
      svInfoStore.clearData()
      router.push({ name: 'home' })
    }
  }
)

const SECTIONS = [
  { id: 'gene', title: 'Gene' },
  { id: 'clinvar', title: 'ClinVar' },
  { id: 'sv-tools', title: 'SV Tools' },
  { id: 'acmg', title: 'ACMG' },
  { id: 'genome-browser', title: 'Genome Browser' }
]

// We need to use refs here because of props mutations in the parent
const searchTermRef = ref(props.searchTerm)
const genomeReleaseRef = ref(props.genomeRelease)
</script>

<template>
  <HeaderDetailPage v-model:search-term="searchTermRef" v-model:genome-release="genomeReleaseRef" />
  <v-navigation-drawer location="right" class="overflow-auto">
    <div v-if="svInfoStore.storeState == StoreState.Active" class="sv-info">
      <BookmarkButton :id="searchTermRef" :type="'strucvar'" />
      Sections:
      <v-list density="compact" nav>
        <v-list-item
          v-for="section in SECTIONS"
          :id="`${section.id}-nav`"
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
      <div v-if="svInfoStore.storeState == StoreState.Active" class="sv-info">
        <div id="gene" class="sv-item">
          <SvDetailsGenes :genes-infos="svInfoStore.genesInfos" />
        </div>

        <div id="clinvar" class="sv-item">
          <SvDetailsClinvar />
        </div>

        <div id="sv-tools" class="sv-item">
          <SvTools :sv-record="svInfoStore.currentSvRecord" />
        </div>

        <div id="acmg" class="sv-item">
          <AcmgRating :sv-record="svInfoStore.currentSvRecord" />
        </div>

        <div id="genome-browser" class="sv-item">
          <GenomeBrowser
            :genome="genomeRelease === 'grch37' ? 'hg19' : 'hg38'"
            :locus="svLocus(svInfoStore.currentSvRecord) as string"
          />
        </div>
      </div>

      <div v-else>
        <v-card class="d-flex align-center justify-center" style="min-height: 300px">
          <v-card-title>Loading SV information</v-card-title>
          <v-divider />
          <v-progress-circular indeterminate />
        </v-card>
      </div>
    </v-main>
  </v-layout>
</template>

<style scoped>
.sv-info {
  width: 95%;
  margin: 20px;
}

.sv-item {
  margin-bottom: 20px;
  /* border: 2px solid rgb(229, 85, 64);
  border-radius: 10px; */
  padding: 5px 10px;
}
</style>
