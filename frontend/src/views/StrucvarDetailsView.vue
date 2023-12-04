<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// -- local components ------------------------------------------------------
import BookmarkListItem from '@/components/BookmarkListItem.vue'
import { useCaseStore } from '@/stores/case'
import { useGeneInfoStore } from '@/stores/geneInfo'
import { StoreState } from '@/stores/misc'
import { type SvRecord, useSvInfoStore } from '@/stores/svInfo'

const HeaderDetailPage = defineAsyncComponent(() => import('@/components/HeaderDetailPage.vue'))
const GeneListCard = defineAsyncComponent(
  () => import('@/components/StrucvarDetails/GeneListCard.vue')
)
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
const GeneClinvarCard = defineAsyncComponent(
  () => import('@/components/GeneDetails/ClinvarCard.vue')
)

const StrucvarClinvarCard = defineAsyncComponent(
  () => import('@/components/StrucvarDetails/ClinvarCard.vue')
)
const VariantToolsCard = defineAsyncComponent(
  () => import('@/components/StrucvarDetails/VariantToolsCard.vue')
)

const GenomeBrowser = defineAsyncComponent(() => import('@/components/GenomeBrowser.vue'))

const AcmgRatingCard = defineAsyncComponent(
  () => import('@/components/StrucvarDetails/AcmgRatingCard.vue')
)

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

/** Information about the SV.  We load almost all the information directly through it. */
const svInfoStore = useSvInfoStore()

/**
 * However, for the gene-wise ClinVar information, we load through the gene store.
 *
 * In the future, we should slim down on the gene information in svInfoStore and load
 * it on demand only.
 */
const geneInfoStore = useGeneInfoStore()
/** Currently active case - for HPO terms. */
const caseStore = useCaseStore()

/** Helper that scrolls to section requested in router. */
const scrollToSection = async () => {
  const sectionId = route.hash.slice(1)
  const elem = document.getElementById(sectionId)
  elem?.scrollIntoView()
}

/**
 * Load data to svInfoStore on page load.
 *
 * Thsi is done **once** when the page is loaded.
 */
const loadDataToSvInfoStore = async () => {
  await Promise.all([
    svInfoStore.loadData(props.searchTerm, props.genomeRelease),
    caseStore.loadCase()
  ])
  await scrollToSection()
}

/**
 * Load data for the given gene into the gene info store.
 *
 * This is done every time the user selects a new gene.
 */
const loadGeneToStore = async (hgncId: string) => {
  await geneInfoStore.loadData(hgncId, props.genomeRelease)
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
onMounted(loadDataToSvInfoStore)

watch(() => props.searchTerm, loadDataToSvInfoStore)
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
  TOP: [{ id: 'gene-list', title: 'List' }],
  GENE: [
    { id: 'gene-overview', title: 'Overview' },
    { id: 'gene-pathogenicity', title: 'Pathogenicity' },
    { id: 'gene-conditions', title: 'Conditions' },
    { id: 'gene-expression', title: 'Expression' },
    { id: 'gene-clinvar', title: 'ClinVar' }
  ],
  STRUCVAR: [
    { id: 'strucvar-clinvar', title: 'ClinVar' },
    { id: 'strucvar-tools', title: 'Tools' },
    { id: 'strucvar-acmg', title: 'ACMG' },
    { id: 'strucvar-genomebrowser', title: 'Genome Browser' }
  ]
}

// We need to use refs here because of props mutations in the parent
const searchTermRef = ref<string>(props.searchTerm)
const genomeReleaseRef = ref<'grch37' | 'grch38'>(props.genomeRelease)

// The `v-list-group` API needs this here so we can enable sections by default.
const openedSection = ref<string[]>(['gene', 'strucvar'])

/** HGNC identifier of selected gene. */
const selectedGeneHgncId = ref<string | null>(null)

// Watch changes of selected HGNC ID and load gene.
watch(
  () => selectedGeneHgncId.value,
  (newHgncId: string | null) => {
    if (newHgncId !== null) {
      loadGeneToStore(newHgncId)
      router.push({ hash: '#gene-overview' })
    }
  }
)

/** Selected gene information. */
const selectedGeneInfo = computed<any | null>(() => {
  return (svInfoStore.genesInfos || []).find((geneInfo) => {
    return geneInfo.hgnc.agr === selectedGeneHgncId.value
  })
})
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
          <v-list-item
            v-for="section in SECTIONS.TOP"
            :id="`${section.id}-nav`"
            :key="section.id"
            density="compact"
            prepend-icon="mdi-table-filter"
            @click="router.push({ hash: `#${section.id}` })"
          >
            <v-list-item-title>
              {{ section.title }}
            </v-list-item-title>
          </v-list-item>

          <v-list-group value="gene">
            <template #activator="{ props: vProps }">
              <v-list-item :value="vProps" prepend-icon="mdi-dna" v-bind="vProps">
                Gene
                <span class="font-italic">
                  {{ selectedGeneInfo?.hgnc?.symbol || selectedGeneInfo?.hgnc?.agr }}
                </span>
              </v-list-item>
            </template>

            <v-list-item
              v-for="section in SECTIONS.GENE"
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
              <v-list-item
                :value="vProps"
                prepend-icon="mdi-magnify-expand"
                v-bind="vProps"
                title="Variant Details"
              />
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
      <div id="gene-list">
        <GeneListCard
          v-model:selected-gene-hgnc-id="selectedGeneHgncId"
          :current-sv-record="svInfoStore.currentSvRecord"
          :genes-infos="svInfoStore.genesInfos"
          :store-state="svInfoStore.storeState"
          :genome-release="genomeRelease"
        />
      </div>

      <template v-if="selectedGeneInfo">
        <div id="gene-overview" class="mt-3">
          <OverviewCard :gene-info="selectedGeneInfo" />
        </div>
        <div id="gene-pathogenicity">
          <PathogenicityCard :gene-info="selectedGeneInfo" />
        </div>
        <div id="gene-conditions">
          <ConditionsCard :gene-info="selectedGeneInfo" :hpo-terms="[]" />
        </div>
        <div id="gene-expression">
          <ExpressionCard
            :gene-symbol="selectedGeneInfo?.hgnc?.symbol"
            :expression-records="selectedGeneInfo?.gtex?.records"
            :ensembl-gene-id="selectedGeneInfo?.gtex?.ensemblGeneId"
          />
        </div>
        <div id="gene-clinvar">
          <GeneClinvarCard
            :gene-clinvar="geneInfoStore.geneClinvar"
            :transcripts="geneInfoStore.transcripts"
            :genome-release="genomeReleaseRef"
            :gene-info="geneInfoStore?.geneInfo"
            :per-freq-counts="geneInfoStore?.geneClinvar?.perFreqCounts"
          />
        </div>
      </template>

      <div>
        <div class="text-h4 mt-6 mb-3 ml-1">Variant Details</div>

        <div id="strucvar-clinvar">
          <StrucvarClinvarCard :genome-release="genomeReleaseRef" />
        </div>
        <div id="strucvar-tools">
          <VariantToolsCard
            :genome-release="genomeReleaseRef"
            :sv-record="svInfoStore.currentSvRecord"
          />
        </div>
        <div id="strucvar-acmg">
          <AcmgRatingCard :sv-record="svInfoStore.currentSvRecord" />
        </div>
        <div id="strucvar-genomebrowser">
          <GenomeBrowser
            :genome-release="genomeRelease"
            :locus="svLocus(svInfoStore.currentSvRecord) as string"
          />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped></style>
