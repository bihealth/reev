<!--
View that displays the details for a single gene.

As done in all detail views, the component loads the information through
the stores in a function `loadDataToStore`.  This is called both on
mounted and when the props change.

This view will attempt to obtain the genome build from the query string,
falling back to 'grch37'.  In case that the genome build value is not
valid, an error message is displayed.

Note that the HGNC symbol is pushed into the component by  the router.
The backend uses HGNC IDs, however.  The `geneInfo` store will take care
of this resolution.
-->

<script setup lang="ts">
import { type GenomeBuild, guessGenomeBuild } from '@bihealth/reev-frontend-lib/lib/genomeBuilds'
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { useGeneInfoStore } from '@bihealth/reev-frontend-lib/stores/geneInfo'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

import BookmarkListItem from '@/components/BookmarkListItem/BookmarkListItem.vue'
import FooterDefault from '@/components/FooterDefault/FooterDefault.vue'
import { lookupGene } from '@/lib/query'
import { scrollToSection } from '@/lib/utils'
import { useCaseInfoStore } from '@/stores/caseInfo'

// Define the async components to use in this view.
const PageHeader = defineAsyncComponent(() => import('@/components/PageHeader/PageHeader.vue'))
const GeneOverviewCard = defineAsyncComponent(
  () => import('@bihealth/reev-frontend-lib/components/GeneOverviewCard/GeneOverviewCard.vue')
)
const GenePathogenicityCard = defineAsyncComponent(
  () =>
    import('@bihealth/reev-frontend-lib/components/GenePathogenicityCard/GenePathogenicityCard.vue')
)
const GeneLiteratureCard = defineAsyncComponent(
  () => import('@bihealth/reev-frontend-lib/components/GeneLiteratureCard/GeneLiteratureCard.vue')
)
const GeneConditionsCard = defineAsyncComponent(
  () => import('@bihealth/reev-frontend-lib/components/GeneConditionsCard/GeneConditionsCard.vue')
)
const CadaRanking = defineAsyncComponent(() => import('@/components/CadaRanking/CadaRanking.vue'))
const GeneExpressionCard = defineAsyncComponent(
  () => import('@bihealth/reev-frontend-lib/components/GeneExpressionCard/GeneExpressionCard.vue')
)
const GeneClinvarCard = defineAsyncComponent(
  () => import('@bihealth/reev-frontend-lib/components/GeneClinvarCard/GeneClinvarCard.vue')
)

/** Type for this component's props. */
export interface Props {
  /** The HGNC gene symbol to display for. */
  hgncSymbol: string
}

/** The component's props; no need for defaults. */
const props = defineProps<Props>()

/** The global Router objects. */
const router = useRouter()
/** The global Route object. */
const route = useRoute()

/** The global theme. */
const theme = useTheme()

/** Detailed information about the currently selected gene. */
const geneInfoStore = useGeneInfoStore()
/** Information about the current case, used for HPO terms and phenotypes. */
const caseStore = useCaseInfoStore()

/** Component state; used genome build. */
const genomeBuild = ref<GenomeBuild>('grch37')
/** Component state; use for opening sections by default. */
const openedSection = ref<string[]>(['gene'])
/** Component state; any error message. */
const errorMessage = ref<string>('')

/** Helper that reads the props and initializes the stores. */
const loadDataToStore = async () => {
  const query = router.currentRoute.value.query

  // Check genome release and obtain as `GenomeBuild`.
  if (query.genomeBuild) {
    try {
      genomeBuild.value = guessGenomeBuild(query.genomeBuild)
    } catch (err) {
      errorMessage.value = String(err)
      return
    }
  }

  let hgncId
  try {
    hgncId = await lookupGene(props.hgncSymbol, 'hgncId')
  } catch (err) {
    errorMessage.value = `${err}`
    return
  }
  await geneInfoStore.initialize(hgncId, genomeBuild.value)
  await caseStore.initialize()
  await scrollToSection(route)
}

/** Return backgorund color for v-main based on current theme. */
const mainBackgroundColor = computed(() => {
  return theme.global.current.value.dark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3'
})

// When the component is mounted or the gene symbol or genome release are
// changed through the router then we need to fetch the gene information
// from the backend through the store.
onMounted(loadDataToStore)
// Watch change of HGNC symbol and hash and update store or scroll to
// selected section.
watch(() => [props.hgncSymbol, genomeBuild.value], loadDataToStore)
watch(
  () => route.hash,
  async () => scrollToSection(route)
)

/** Data type for `SECTIONS` below. */
interface Section {
  id: string
  title: string
}

/** Sections in the navigation. */
const SECTIONS: Section[] = [
  { id: 'gene-overview', title: 'Overview' },
  { id: 'gene-pathogenicity', title: 'Pathogenicity' },
  { id: 'gene-conditions', title: 'Conditions' },
  { id: 'gene-expression', title: 'Expression' },
  { id: 'gene-clinvar', title: 'ClinVar' },
  { id: 'gene-literature', title: 'Literature' }
]
</script>

<template>
  <v-app>
    <PageHeader />
    <v-main :class="mainBackgroundColor">
      <v-container fluid>
        <v-row>
          <v-col cols="2">
            <div
              v-if="geneInfoStore.storeState == StoreState.Active"
              style="position: sticky; top: 20px"
            >
              <v-list v-model:opened="openedSection" rounded="lg">
                <BookmarkListItem :id="geneInfoStore.hgncId ?? ''" :type="'gene'" />

                <v-list-group value="gene">
                  <template #activator="{ props: vProps }">
                    <v-list-item v-bind="vProps" prepend-icon="mdi-dna" title="Gene" />
                  </template>

                  <v-list-item
                    v-for="section in SECTIONS"
                    :id="`${section.id}-nav`"
                    :key="section.id"
                    density="compact"
                    @click="
                      router.push({
                        query: { genomeBuild: genomeBuild },
                        hash: `#${section.id}`
                      })
                    "
                  >
                    <v-list-item-title>
                      {{ section.title }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list-group>
              </v-list>
            </div>
          </v-col>

          <v-col cols="10">
            <v-alert v-if="errorMessage?.length" type="warning" class="mb-6">
              <div>
                {{ errorMessage }}
              </div>
              <v-btn
                :to="{ name: 'home' }"
                prepend-icon="mdi-arrow-left-circle-outline"
                class="mt-3"
                variant="outlined"
                color="white"
              >
                Back to home
              </v-btn>
            </v-alert>

            <div id="gene-overview">
              <GeneOverviewCard
                :gene-info="geneInfoStore.geneInfo"
                :show-gene-details-link="false"
              />
            </div>

            <div id="gene-pathogenicity" class="mt-3">
              <GenePathogenicityCard :gene-info="geneInfoStore.geneInfo">
                <CadaRanking :hgnc-id="geneInfoStore.geneInfo?.hgnc!.hgncId" />
              </GenePathogenicityCard>
            </div>

            <div id="gene-conditions" class="mt-3">
              <GeneConditionsCard
                :gene-info="geneInfoStore.geneInfo"
                :hpo-terms="geneInfoStore.hpoTerms"
              />
            </div>

            <div id="gene-expression" class="mt-3">
              <GeneExpressionCard
                :gene-symbol="geneInfoStore.geneInfo?.hgnc?.symbol"
                :expression-records="geneInfoStore.geneInfo?.gtex?.records"
                :ensembl-gene-id="geneInfoStore.geneInfo?.gtex?.ensemblGeneId"
              />
            </div>

            <div v-if="geneInfoStore?.geneClinvar" id="gene-clinvar" class="mt-3">
              <GeneClinvarCard
                :clinvar-per-gene="geneInfoStore.geneClinvar"
                :transcripts="geneInfoStore.transcripts"
                :genome-build="genomeBuild"
                :gene-info="geneInfoStore.geneInfo"
                :per-freq-counts="geneInfoStore?.geneClinvar?.perFreqCounts"
              />
            </div>

            <div id="gene-literature" class="mt-3">
              <GeneLiteratureCard :gene-info="geneInfoStore.geneInfo" />
            </div>
          </v-col>
        </v-row>
        <FooterDefault />
      </v-container>
    </v-main>
  </v-app>
</template>
