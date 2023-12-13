<!--
This view displays the details for one structural variant.

As done in all detail views, the component loads the information through
the stores in a function `loadDataToStore`.  This is called both on
mounted and when the props change.

A canonical variant description will be given by the `strucvarDesc` prop.
Optionally, a query parameter `orig` can be given that is the user's
original input which will be displayed rather than the genome variant.

Note that the view first needs to resolve the strucvar description which
may fail in which case the view will display an error.
-->

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

import BookmarkListItem from '@/components/BookmarkListItem.vue'
import FooterDefault from '@/components/FooterDefault.vue'
import { type GenomeBuild, guessGenomeBuild } from '@/lib/genomeBuilds'
import { type Strucvar } from '@/lib/genomicVars'
import { resolveStrucvar } from '@/lib/query'
import { scrollToSection } from '@/lib/utils'
import { useCaseStore } from '@/stores/case'
import { usegeneInfoStore as useGeneInfoStore } from '@/stores/geneInfo'
import { StoreState } from '@/stores/misc'
import { useStrucVarInfoStore } from '@/stores/strucVarInfo'

// Define the async components to use in this view.
const PageHeader = defineAsyncComponent(() => import('@/components/PageHeader.vue'))

const GeneListCard = defineAsyncComponent(
  () => import('@/components/StrucvarDetails/GeneListCard.vue')
)
const GeneOverviewCard = defineAsyncComponent(
  () => import('@/components/GeneDetails/OverviewCard.vue')
)
const GenePathogenicityCard = defineAsyncComponent(
  () => import('@/components/GeneDetails/PathogenicityCard.vue')
)
const GeneConditionsCard = defineAsyncComponent(
  () => import('@/components/GeneDetails/ConditionsCard.vue')
)
const GeneExpressionCard = defineAsyncComponent(
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
const ClinsigCard = defineAsyncComponent(
  () => import('@/components/StrucvarDetails/ClinsigCard.vue')
)

/** Type for this component's props. */
export interface Props {
  /** Description of the seqvar to display for.
   *
   * This will be a canonical hyphen-separated description with a prefix of
   * the genome build, for example `grch37-17-1000-2000`.
   */
  strucvarDesc: string
}

/** The component's props; no need for defaults. */
const props = defineProps<Props>()

/** The global Router objects. */
const router = useRouter()
/** The global Route object. */
const route = useRoute()

/** The global theme. */
const theme = useTheme()

/** Information about the strucvar, used to fetch information on load. */
const strucvarInfoStore = useStrucVarInfoStore()
/** Information about the genes. */
const geneInfoStore = useGeneInfoStore()
/** Currently active case - for HPO terms. */
const caseStore = useCaseStore()

const strucvar = ref<Strucvar | undefined>(undefined)
/** Component state; use for opening sections by default. */
const openedSection = ref<string[]>(['gene', 'strucvar'])
/** Component state; HGNC identifier of selected gene. */
const selectedGeneHgncId = ref<string | undefined>(undefined)
/** Component state; any error message. */
const errorMessage = ref<string>('')
/** Component state; control snackbar display. */
const errSnackbarShow = ref<boolean>(false)
/** Component state; error message for snack bar. */
const errSnackbarMsg = ref<string>('')

/**
 * Handler for `@display-error` event.
 */
const handleDisplayError = async (msg: string) => {
  errSnackbarMsg.value = msg
  errSnackbarShow.value = true
}

/** Return backgorund color for v-main based on current theme. */
const mainBackgroundColor = computed(() => {
  return theme.global.current.value.dark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3'
})

/** The user's original input from the query, if given. */
const orig = computed<string | undefined>(() => (route.query.orig as string) || undefined)
/** The variant identifier for the bookmark. */
const idForBookmark = computed<string | undefined>(() => {
  const strucvar = strucvarInfoStore.strucvar
  if (strucvar) {
    return `${strucvar.svType}-${strucvar.genomeBuild}-${strucvar.chrom}-${strucvar.start}-${strucvar.stop}`
  } else {
    return undefined
  }
})
/** Selected gene information. */
const selectedGeneInfo = computed<any | undefined>(() => {
  return (strucvarInfoStore.genesInfos || []).find((geneInfo) => {
    return geneInfo.hgnc.agr === selectedGeneHgncId.value
  })
})

/**
 * Load data to strucvarInfoStore on page load.
 *
 * This is done when the page is loaded or `props.strucvarDesc` changes.
 */
const loadDataToStore = async () => {
  const query = router.currentRoute.value.query

  // Obtain `?genomeBuild=`, fallback to 'grch37', and obtain as `GenomeBuild`.
  let genomeBuild: GenomeBuild
  try {
    genomeBuild = guessGenomeBuild(query.genomeBuild ?? 'grch37')
  } catch (err) {
    errorMessage.value = String(err)
    return
  }

  // Resolve the strucvar description to a `Seqvar` object, or fail with parsing.
  try {
    strucvar.value = resolveStrucvar(props.strucvarDesc, genomeBuild)
  } catch (err) {
    errorMessage.value = `Invalid structural variant description "${props.strucvarDesc}": ${err}`
    return
  }

  // Also, resolve the original input of the user so we don't display arbitrary
  // strings.
  if (orig.value) {
    try {
      resolveStrucvar(orig.value, genomeBuild)
    } catch (err) {
      errorMessage.value = `Invalid original input "${orig.value}".`
      return
    }
  }

  // Finally, load structural variant and case information.
  await Promise.all([strucvarInfoStore.loadData(strucvar.value), caseStore.loadCase()])
  await scrollToSection(route)
}

/**
 * Load data for the given gene into the gene info store.
 *
 * This is done every time the user selects a new gene.
 */
const loadGeneToStore = async (hgncId: string) => {
  if (strucvar.value !== undefined) {
    await geneInfoStore.loadData(hgncId, strucvar.value.genomeBuild)
    await scrollToSection(route)
  }
}

// Pretty display of coordinates.
const svLocus = (strucvar: Strucvar | undefined): string | undefined => {
  if (strucvar === undefined) {
    return undefined
  }

  let locus: string = ''
  switch (strucvar.svType) {
    // case 'INS':
    //   locus = `${strucvar.chrom}:${strucvar.start}-${strucvar.start}`
    case 'DEL':
    case 'DUP':
      // case 'INV':
      locus = `${strucvar.chrom}:${strucvar.start - 1000}-${strucvar.stop + 1000}`
    // case 'BND':
    //   locus = `${strucvar.chrom}:${strucvar.start - 1000}-${strucvar.start + 1000}`
  }
  if (locus === '') {
    return undefined
  }

  if (strucvar.genomeBuild === 'grch38') {
    locus = `chr${locus}`
  }
  return locus
}

// When the component is mounted or the search term is changed through
// the router then we need to fetch the variant information from the backend
// through the store.
onMounted(loadDataToStore)
// Watch change of HGNC symbol and hash and update store or scroll to
// selected section.
watch(() => props.strucvarDesc, loadDataToStore)
watch(
  () => route.hash,
  () => scrollToSection(route)
)

// Watch changes of selected HGNC ID and load gene.
watch(
  () => selectedGeneHgncId.value,
  (newHgncId: string | undefined) => {
    if (newHgncId !== undefined) {
      loadGeneToStore(newHgncId)
      router.push({ hash: '#gene-overview' })
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
    { id: 'strucvar-clinsig', title: 'Clinical Significance' },
    { id: 'strucvar-genomebrowser', title: 'Genome Browser' }
  ]
}
</script>

<template>
  <v-app>
    <PageHeader />
    <v-main :class="mainBackgroundColor">
      <v-container>
        <v-row>
          <v-col cols="2">
            <div v-if="strucvarInfoStore.storeState == StoreState.Active">
              <v-list v-model:opened="openedSection" density="compact" rounded="lg">
                <BookmarkListItem :id="idForBookmark" type="strucvar" />

                <v-list-item
                  v-for="section in SECTIONS.TOP"
                  :id="`${section.id}-nav`"
                  :key="section.id"
                  density="compact"
                  prepend-icon="mdi-table-filter"
                  @click="router.push({ hash: `#${section.id}` })"
                >
                  <v-list-item-title class="text-no-break">
                    {{ section.title }}
                  </v-list-item-title>
                </v-list-item>

                <v-list-group value="gene">
                  <template #activator="{ props: vProps }">
                    <v-list-item
                      :value="vProps"
                      prepend-icon="mdi-dna"
                      v-bind="vProps"
                      class="text-no-break"
                    >
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
                    <v-list-item-title class="text-no-break">
                      {{ section.title }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list-group>

                <v-list-group value="strucvar">
                  <template #activator="{ props: vProps }">
                    <v-list-item :value="vProps" prepend-icon="mdi-magnify-expand" v-bind="vProps">
                      <v-list-item-title class="text-no-break"> Variant Details </v-list-item-title>
                    </v-list-item>
                  </template>

                  <v-list-item
                    v-for="section in SECTIONS.STRUCVAR"
                    :id="`${section.id}-nav`"
                    :key="section.id"
                    density="compact"
                    @click="router.push({ hash: `#${section.id}` })"
                  >
                    <v-list-item-title class="text-no-break">
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

            <div id="gene-list">
              <GeneListCard
                v-model:selected-gene-hgnc-id="selectedGeneHgncId"
                :current-strucvar-record="strucvarInfoStore.strucvar"
                :csq="strucvarInfoStore.csq"
                :genes-infos="strucvarInfoStore.genesInfos"
                :store-state="strucvarInfoStore.storeState"
              />
            </div>

            <template v-if="selectedGeneInfo">
              <div id="gene-overview" class="mt-3">
                <GeneOverviewCard :gene-info="selectedGeneInfo" />
              </div>
              <div id="gene-pathogenicity">
                <GenePathogenicityCard :gene-info="selectedGeneInfo" />
              </div>
              <div id="gene-conditions">
                <GeneConditionsCard :gene-info="selectedGeneInfo" :hpo-terms="[]" />
              </div>
              <div id="gene-expression">
                <GeneExpressionCard
                  :gene-symbol="selectedGeneInfo?.hgnc?.symbol"
                  :expression-records="selectedGeneInfo?.gtex?.records"
                  :ensembl-gene-id="selectedGeneInfo?.gtex?.ensemblGeneId"
                />
              </div>
              <div v-if="geneInfoStore?.geneClinvar" id="gene-clinvar">
                <GeneClinvarCard
                  :gene-clinvar="geneInfoStore.geneClinvar"
                  :transcripts="geneInfoStore.transcripts"
                  :genome-build="strucvar?.genomeBuild"
                  :gene-info="geneInfoStore?.geneInfo"
                  :per-freq-counts="geneInfoStore?.geneClinvar?.perFreqCounts"
                />
              </div>
            </template>

            <div>
              <div class="text-h4 mt-6 mb-3 ml-1">Variant Details</div>

              <div id="strucvar-clinvar">
                <StrucvarClinvarCard :strucvar="strucvar" />
              </div>
              <div id="strucvar-tools">
                <VariantToolsCard :strucvar="strucvar" />
              </div>
              <div id="strucvar-clinsig">
                <ClinsigCard :strucvar="strucvar" @error-display="handleDisplayError" />
              </div>
              <div id="strucvar-genomebrowser">
                <GenomeBrowser
                  :genome-build="strucvar?.genomeBuild"
                  :locus="svLocus(strucvar) as string"
                />
              </div>
            </div>
          </v-col>
        </v-row>
        <FooterDefault />
      </v-container>

      <!-- VSnackbar for displaying errors -->
      <v-snackbar v-model="errSnackbarShow" multi-line>
        {{ errSnackbarMsg }}

        <template #actions>
          <v-btn color="red" variant="text" @click="errSnackbarShow = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<style scoped></style>
