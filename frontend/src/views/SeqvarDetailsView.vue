<!--
This view displays the details for one sequence variants.

As done in all detail views, the component loads the information through
the stores in a function `loadDataToStore`.  This is called both on
mounted and when the props change.

A canonical variant description will be given by the `seqvarDesc` prop.
Optionally, a query parameter `orig` can be given that is the user's
original input which will be displayed rather than the genome variant.

Note that the view first needs to resolve the seqvar description which
may fail in which case the view will display an error.
-->

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

import BookmarkListItem from '@/components/BookmarkListItem.vue'
import FooterDefault from '@/components/FooterDefault.vue'
import { type GenomeBuild, guessGenomeBuild } from '@/lib/genomeBuilds'
import { type Seqvar } from '@/lib/genomicVars'
import { resolveSeqvar } from '@/lib/query'
import { scrollToSection } from '@/lib/utils'
import { useCaseStore } from '@/stores/case'
import { usegeneInfoStore } from '@/stores/geneInfo'
import { StoreState } from '@/stores/misc'
import { useSeqVarInfoStore } from '@/stores/seqVarInfo'

// Define the async components to use in this view.
const PageHeader = defineAsyncComponent(() => import('@/components/PageHeader.vue'))

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

const ClinsigCard = defineAsyncComponent(() => import('@/components/SeqvarDetails/ClinsigCard.vue'))
const BeaconNetworkCard = defineAsyncComponent(
  () => import('@/components/SeqvarDetails/BeaconNetworkCard.vue')
)
const VariantDetailsClinvar = defineAsyncComponent(
  () => import('@/components/SeqvarDetails/ClinvarCard.vue')
)
const VariantDetailsTxCsq = defineAsyncComponent(
  () => import('@/components/SeqvarDetails/TxCsqCard.vue')
)
const VariantDetailsFreqs = defineAsyncComponent(
  () => import('@/components/SeqvarDetails/FreqsCard.vue')
)
const VariantToolsCard = defineAsyncComponent(
  () => import('@/components/SeqvarDetails/VariantToolsCard.vue')
)
const VariantScoresCard = defineAsyncComponent(
  () => import('@/components/SeqvarDetails/VariantScoresCard.vue')
)
const VariantValidatorCard = defineAsyncComponent(
  () => import('@/components/SeqvarDetails/VariantValidatorCard.vue')
)

/** Type for this component's props. */
export interface Props {
  /** Description of the seqvar to display for.
   *
   * This will be a canonical hyphen-separated description with a prefix of
   * the genome build, for example `grch37-17-41215920-G-T`.
   */
  seqvarDesc: string
}

/** The component's props; no need for defaults. */
const props = defineProps<Props>()

/** The global Router objects. */
const router = useRouter()
/** The global Route object. */
const route = useRoute()

/** The global theme. */
const theme = useTheme()

/** Information about the sequence variant, used to fetch information on load. */
const seqvarInfoStore = useSeqVarInfoStore()
/** Information about the affected gene, used to fetch information on load. */
const geneInfoStore = usegeneInfoStore()
/** Currently active case - for HPO terms. */
const caseStore = useCaseStore()

/** The user's original input from the query, if given. */
const orig = computed<string | undefined>(() => (route.query.orig as string) || undefined)
/** The variant identifier for the bookmark. */
const idForBookmark = computed<string | undefined>(() => {
  const seqvar$ = seqvar.value
  if (seqvar$) {
    return `${seqvar$.genomeBuild}-${seqvar$.chrom}-${seqvar$.pos}-${seqvar$.del}-${seqvar$.ins}`
  } else {
    return undefined
  }
})

/** Component state; resolved seqvar, resolved in `loadDataToStore()`. */
const seqvar = ref<Seqvar | undefined>(undefined)
/** Component state; use for opening sections by default. */
const openedSection = ref<string[]>(['gene', 'seqvar'])
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

/**
 * Helper that reads the props and initializes the stores.
 *
 * The function will first resolve the sequence variant description
 * and display an error message if this fails.
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

  // Resolve the seqvar description to a `Seqvar` object, or fail with parsing.
  try {
    seqvar.value = await resolveSeqvar(props.seqvarDesc, genomeBuild)
  } catch (err) {
    errorMessage.value = `Invalid sequence variant description "${props.seqvarDesc}": ${err}`
    return
  }

  // Also, resolve the original input of the user so we don't display arbitrary
  // strings.
  if (orig.value) {
    try {
      await resolveSeqvar(orig.value, genomeBuild)
    } catch (err) {
      errorMessage.value = `Invalid original input "${orig.value}".`
      return
    }
  }

  // Finally, load sequence variant, ACMG rating information, and case info.
  await Promise.all([
    seqvarInfoStore.loadData(seqvar.value).then(() => {
      // If we have gene information, load the gene information.  Otherwise,
      // clear the gene info store.
      if (seqvarInfoStore.geneInfo?.hgnc?.agr) {
        return geneInfoStore.loadData(seqvarInfoStore.geneInfo?.hgnc?.agr, genomeBuild)
      } else {
        geneInfoStore.clearData()
        return Promise.resolve()
      }
    }),
    caseStore.loadCase()
  ])
  // Once all data has been loaded, scroll to the given section.
  await scrollToSection(route)
}

// When the component is mounted or the search term is changed through
// the router then we need to fetch the variant information from the backend
// through the store.
onMounted(loadDataToStore)
// Watch change of HGNC symbol and hash and update store or scroll to
// selected section.
watch(() => props.seqvarDesc, loadDataToStore)
watch(
  () => route.hash,
  () => scrollToSection(route)
)

/** Data type for `SECTIONS` below. */
interface Section {
  id: string
  title: string
}
/** Sections in the navigation. */
const SECTIONS: { [key: string]: Section[] } = {
  GENE: [
    { id: 'gene-overview', title: 'Overview' },
    { id: 'gene-pathogenicity', title: 'Pathogenicity' },
    { id: 'gene-conditions', title: 'Conditions' },
    { id: 'gene-expression', title: 'Expression' },
    { id: 'gene-clinvar', title: 'ClinVar' }
  ],
  SEQVAR: [
    { id: 'seqvar-clinsig', title: 'Clinical Significance' },
    { id: 'seqvar-csq', title: 'Consequences' },
    { id: 'seqvar-clinvar', title: 'ClinVar' },
    { id: 'seqvar-freqs', title: 'Frequencies' },
    { id: 'seqvar-scores', title: 'Scores' },
    { id: 'seqvar-tools', title: 'Tools' },
    { id: 'seqvar-ga4ghbeacon', title: 'Beacon Network' },
    { id: 'seqvar-variantvalidator', title: 'VariantValidator' }
  ]
}
</script>

<template>
  <v-app>
    <PageHeader />
    <v-main :class="mainBackgroundColor">
      <v-container fluid>
        <v-row>
          <v-col cols="2">
            <div v-if="seqvarInfoStore.storeState == StoreState.Active">
              <v-list v-model:opened="openedSection" density="compact" rounded="lg">
                <BookmarkListItem :id="idForBookmark" type="seqvar" />

                <template v-if="geneInfoStore.hgncId?.length">
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
                          {{
                            seqvarInfoStore?.geneInfo?.hgnc?.symbol ||
                            seqvarInfoStore?.geneInfo?.hgnc?.agr
                          }}
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
                </template>
                <template v-else>
                  <v-list-item prepend-icon="mdi-dna" class="font-italic text-grey-darken-2">
                    No Gene
                  </v-list-item>
                </template>

                <v-list-group value="seqvar">
                  <template #activator="{ props: vProps }">
                    <v-list-item
                      :value="vProps"
                      v-bind="vProps"
                      prepend-icon="mdi-magnify-expand"
                      class="text-no-wrap"
                    >
                      Variant
                    </v-list-item>
                  </template>

                  <v-list-item
                    v-for="section in SECTIONS.SEQVAR"
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

            <template v-if="seqvarInfoStore?.geneInfo">
              <div id="gene-overview">
                <GeneOverviewCard :gene-info="seqvarInfoStore?.geneInfo" />
              </div>
              <div id="gene-pathogenicity">
                <GenePathogenicityCard :gene-info="seqvarInfoStore?.geneInfo" />
              </div>
              <div id="gene-conditions">
                <GeneConditionsCard :gene-info="seqvarInfoStore?.geneInfo" :hpo-terms="[]" />
              </div>
              <div id="gene-expression">
                <GeneExpressionCard
                  :gene-symbol="seqvarInfoStore?.geneInfo?.hgnc?.symbol"
                  :expression-records="seqvarInfoStore?.geneInfo?.gtex?.records"
                  :ensembl-gene-id="seqvarInfoStore?.geneInfo?.gtex?.ensemblGeneId"
                />
              </div>
              <div v-if="geneInfoStore?.geneClinvar && seqvar?.genomeBuild" id="gene-clinvar">
                <GeneClinvarCard
                  :gene-clinvar="geneInfoStore.geneClinvar"
                  :transcripts="geneInfoStore.transcripts"
                  :genome-build="seqvar?.genomeBuild"
                  :gene-info="geneInfoStore?.geneInfo"
                  :per-freq-counts="geneInfoStore?.geneClinvar?.perFreqCounts"
                />
              </div>
            </template>
            <div>
              <div class="text-h4 mt-6 mb-3 ml-1">
                Variant Details
                <template v-if="orig">
                  <small class="font-italic">
                    {{ orig }}
                  </small>
                </template>
              </div>
              <div id="seqvar-clinsig">
                <ClinsigCard :seqvar="seqvarInfoStore.seqvar" @error-display="handleDisplayError" />
              </div>
              <div id="seqvar-csq" class="mt-3">
                <VariantDetailsTxCsq :tx-csq="seqvarInfoStore.txCsq" />
              </div>
              <div id="seqvar-clinvar" class="mt-3">
                <VariantDetailsClinvar :clinvar="seqvarInfoStore.varAnnos?.clinvar" />
              </div>
              <div id="seqvar-freqs" class="mt-3">
                <VariantDetailsFreqs
                  :seqvar="seqvarInfoStore.seqvar"
                  :var-annos="seqvarInfoStore.varAnnos"
                />
              </div>
              <div id="seqvar-scores" class="mt-3">
                <VariantScoresCard :var-annos="seqvarInfoStore.varAnnos" />
              </div>
              <div id="seqvar-tools" class="mt-3">
                <VariantToolsCard
                  :seqvar="seqvarInfoStore.seqvar"
                  :var-annos="seqvarInfoStore.varAnnos"
                />
              </div>
              <div id="seqvar-ga4ghbeacons" class="mt-3">
                <BeaconNetworkCard :seqvar="seqvarInfoStore.seqvar" />
              </div>
              <div id="seqvar-variantvalidator" class="mt-3">
                <VariantValidatorCard :seqvar="seqvarInfoStore.seqvar" />
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
