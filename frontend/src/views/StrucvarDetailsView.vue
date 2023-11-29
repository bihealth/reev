<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VSkeletonLoader } from 'vuetify/components'

// -- local components ------------------------------------------------------
import BookmarkListItem from '@/components/BookmarkListItem.vue'
import { StoreState } from '@/stores/misc'
import { useSvInfoStore } from '@/stores/svInfo'
import { type SvRecord } from '@/stores/svInfo'

const GeneListCard = defineAsyncComponent(() => import('@/components/SvDetails/GeneListCard.vue'))
const GenomeBrowser = defineAsyncComponent(() => import('@/components/GenomeBrowser.vue'))
const HeaderDetailPage = defineAsyncComponent(() => import('@/components/HeaderDetailPage.vue'))
const AcmgRating = defineAsyncComponent(() => import('@/components/SvDetails/AcmgRating.vue'))
const SvDetailsClinvar = defineAsyncComponent(
  () => import('@/components/SvDetails/SvDetailsClinvar.vue')
)
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

/** Data type for `SECTIONS` below. */
interface Section {
  id: string
  title: string
}

/** Sections in the navigation. */
const SECTIONS: { [key: string]: Section[] } = {
  GENES: [
    { id: 'gene-list', title: 'List' },
    { id: 'gene-pathogenicity', title: 'Pathogenicity' },
    { id: 'gene-conditions', title: 'Conditions' },
    { id: 'gene-expression', title: 'Expression' },
    { id: 'gene-clinvar', title: 'ClinVar' }
  ],
  STRUCVAR: [
    { id: 'strucvar-clinvar', title: 'ClinVar' },
    { id: 'strucvar-tools', title: 'Tools' },
    { id: 'strucvar-acmg', title: 'ACMG' },
    { id: 'strucvar-genome-browser', title: 'Genome Browser' }
  ]
}

// We need to use refs here because of props mutations in the parent
const searchTermRef = ref(props.searchTerm)
const genomeReleaseRef = ref(props.genomeRelease)

// The `v-list-group` API needs this here so we can enable sections by default.
const openedSection = ref<string[]>(['genes', 'strucvar'])
</script>

<template>
  <v-app>
    <HeaderDetailPage
      v-model:search-term="searchTermRef"
      v-model:genome-release="genomeReleaseRef"
    />
    <v-navigation-drawer :elevation="3" :permanent="true">
      <div v-if="svInfoStore.storeState == StoreState.Active" class="sv-info">
        <v-list v-model:opened="openedSection">
          <BookmarkListItem :id="searchTermRef" :type="'strucvar'" />

          <v-list-subheader> STRUCTURAL VARIANT </v-list-subheader>
          <v-list-group value="genes">
            <template #activator="{ props: vProps }">
              <v-list-item v-bind="vProps" prepend-icon="mdi-dna" title="Genes" />
            </template>

            <v-list-item
              v-for="section in SECTIONS.GENES"
              :id="`${section.id}-nav`"
              :key="section.id"
              density="compact"
              @click="router.push({ hash: `#${section.id}` })"
            >
              <v-list-item-title>
                {{ section.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list-group>

          <v-list-group value="strucvar">
            <template #activator="{ props: vProps }">
              <v-list-item v-bind="vProps" prepend-icon="mdi-magnify-expand" title="SV Detail" />
            </template>

            <v-list-item
              v-for="section in SECTIONS.STRUCVAR"
              :id="`${section.id}-nav`"
              :key="section.id"
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
      <div id="strucvar-GeneListCard">
        <GeneListCard
          :current-sv-record="svInfoStore.currentSvRecord"
          :genes-infos="svInfoStore.genesInfos"
          :store-state="svInfoStore.storeState"
        />
      </div>

      <!-- <div id="strucvar-clinvar">
        <SvDetailsClinvar />
      </div>

      <div id="strucvar-tools">
        <SvTools :sv-record="svInfoStore.currentSvRecord" />
      </div>

      <div id="strucvar-acmg">
        <AcmgRating :sv-record="svInfoStore.currentSvRecord" />
      </div>

      <div id="strucvar-genomebrowser">
        <GenomeBrowser
          :genome="genomeRelease === 'grch37' ? 'hg19' : 'hg38'"
          :locus="svLocus(svInfoStore.currentSvRecord) as string"
        />
      </div> -->
    </v-main>
  </v-app>
</template>

<style scoped></style>
