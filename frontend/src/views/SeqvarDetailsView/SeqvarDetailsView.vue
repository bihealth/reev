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
import { type GenomeBuild, guessGenomeBuild } from '@bihealth/reev-frontend-lib/lib/genomeBuilds'
import { type Seqvar } from '@bihealth/reev-frontend-lib/lib/genomicVars'
import {
  useAnnonarsGenesClinvarQuery,
  useAnnonarsGenesInfoQuery
} from '@bihealth/reev-frontend-lib/queries/annonars/genes'
import { useAnnonarsSeqvarsAnnosQuery } from '@bihealth/reev-frontend-lib/queries/annonars/seqvars'
import { useMehariGeneTranscriptsListQuery } from '@bihealth/reev-frontend-lib/queries/mehari/geneTranscripts'
import { useMehariSeqvarsCsqQuery } from '@bihealth/reev-frontend-lib/queries/mehari/seqvars'
import { useVigunoHpoGenesQuery } from '@bihealth/reev-frontend-lib/queries/viguno/genes'
import { useGeneInfoStore } from '@bihealth/reev-frontend-lib/stores/geneInfo'
import { useSeqvarInfoStore } from '@bihealth/reev-frontend-lib/stores/seqvarInfo'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

import BookmarkListItem from '@/components/BookmarkListItem/BookmarkListItem.vue'
import FooterDefault from '@/components/FooterDefault/FooterDefault.vue'
import { resolveSeqvar } from '@/lib/query'
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
const GeneLiteratureCard = defineAsyncComponent(
  () => import('@bihealth/reev-frontend-lib/components/GeneLiteratureCard/GeneLiteratureCard.vue')
)

const SeqvarClinsigCard = defineAsyncComponent(
  () => import('@/components/SeqvarClinsigCard/SeqvarClinsigCard.vue')
)
const ClinvarsubCard = defineAsyncComponent(
  () => import('@/components/ClinvarsubCard/ClinvarsubCard.vue')
)
const SeqvarBeaconNetworkCard = defineAsyncComponent(
  () =>
    import(
      '@bihealth/reev-frontend-lib/components/SeqvarBeaconNetworkCard/SeqvarBeaconNetworkCard.vue'
    )
)
const SeqvarClinvarCard = defineAsyncComponent(
  () => import('@bihealth/reev-frontend-lib/components/SeqvarClinvarCard/SeqvarClinvarCard.vue')
)
const SeqvarConsequencesCard = defineAsyncComponent(
  () =>
    import(
      '@bihealth/reev-frontend-lib/components/SeqvarConsequencesCard/SeqvarConsequencesCard.vue'
    )
)
const SeqvarFreqsCard = defineAsyncComponent(
  () => import('@bihealth/reev-frontend-lib/components/SeqvarFreqsCard/SeqvarFreqsCard.vue')
)
const SeqvarToolsCard = defineAsyncComponent(
  () => import('@bihealth/reev-frontend-lib/components/SeqvarToolsCard/SeqvarToolsCard.vue')
)
const SeqvarScoresCard = defineAsyncComponent(
  () => import('@bihealth/reev-frontend-lib/components/SeqvarScoresCard/SeqvarScoresCard.vue')
)
const SeqvarVariantValidatorCard = defineAsyncComponent(
  () =>
    import(
      '@bihealth/reev-frontend-lib/components/SeqvarVariantValidatorCard/SeqvarVariantValidatorCard.vue'
    )
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
const seqvarInfoStore = useSeqvarInfoStore()
/** Information about the affected gene, used to fetch information on load. */
const geneInfoStore = useGeneInfoStore()
/** Currently active case - for HPO terms. */
const caseStore = useCaseInfoStore()

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

/** Parameters for the annonars/mehari seqvars query. */
const seqvarQueryParams = {
  genome_release: () => seqvar.value?.genomeBuild,
  chromosome: () => seqvar.value?.chrom,
  position: () => seqvar.value?.pos,
  reference: () => seqvar.value?.del,
  alternative: () => seqvar.value?.ins
} as const
/** Sequence variant annotations from Annonars. */
const annonarsSeqvarsAnnosQuery = useAnnonarsSeqvarsAnnosQuery(seqvarQueryParams)
/** Query for consequences via Mehari. */
const mehariSeqvarCsqQuery = useMehariSeqvarsCsqQuery({ ...seqvarQueryParams, hgnc_id: undefined })
/** HGNC ID as `ComputedRef` */
const hgncId = computed(() => mehariSeqvarCsqQuery.data.value?.result?.[0]?.gene_id)
/** Query for annonars general gene information. */
const annonarsGenesInfoQuery = useAnnonarsGenesInfoQuery({
  hgnc_id: hgncId
})
/** Query for annonars ClinVar gene information. */
const annonarsGenesClinvarQuery = useAnnonarsGenesClinvarQuery({
  hgnc_id: hgncId
})
/** Query for HPO terms via viguno. */
const vigunoHpoTermsQuery = useVigunoHpoGenesQuery({
  gene_id: hgncId
})
/** Query for gene transcripts. */
const mehariGenesTranscriptsListQuery = useMehariGeneTranscriptsListQuery({
  genome_build: () => seqvar.value?.genomeBuild,
  hgnc_id: hgncId
})

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
    seqvarInfoStore.initialize(seqvar.value).then(() => {
      // If we have gene information, load the gene information.  Otherwise,
      // clear the gene info store.
      if (seqvarInfoStore.geneInfo?.hgnc?.agr) {
        return geneInfoStore.initialize(seqvarInfoStore.geneInfo?.hgnc?.agr, genomeBuild)
      } else {
        geneInfoStore.clearData()
        return Promise.resolve()
      }
    }),
    caseStore.initialize()
  ])
  // Once all data has been loaded, scroll to the given section.
  await scrollToSection(route)
}

/**
 * Jump to the locus in the local IGV.
 */
const jumpToLocus = async () => {
  const chrPrefixed = seqvarInfoStore.seqvar?.chrom.startsWith('chr')
    ? seqvarInfoStore.seqvar?.chrom
    : `chr${seqvarInfoStore.seqvar?.chrom}`
  // NB: we allow the call to fetch here as it goes to local IGV.
  await fetch(
    `http://127.0.0.1:60151/goto?locus=${chrPrefixed}:${seqvarInfoStore.seqvar?.pos}-${
      (seqvarInfoStore.seqvar?.pos ?? 0) + (seqvarInfoStore.seqvar?.del?.length ?? 0)
    }`
  ).catch((e) => {
    const msg = "Couldn't connect to IGV. Please make sure IGV is running and try again."
    alert(msg)
    console.error(msg, e)
  })
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
    { id: 'gene-clinvar', title: 'ClinVar' },
    { id: 'gene-literature', title: 'Literature' }
  ],
  SEQVAR: [
    { id: 'seqvar-clinsig', title: 'Clinical Significance' },
    { id: 'seqvar-csq', title: 'Consequences' },
    { id: 'seqvar-clinvar', title: 'ClinVar' },
    { id: 'seqvar-scores', title: 'Scores' },
    { id: 'seqvar-freqs', title: 'Frequencies' },
    { id: 'seqvar-tools', title: 'Tools' },
    { id: 'seqvar-ga4ghbeacon', title: 'Beacon Network' },
    { id: 'seqvar-variantvalidator', title: 'VariantValidator' },
    { id: 'seqvar-clinvarsub', title: 'ClinVar Submission' }
  ]
}
</script>

<template>
  <div>
    <v-app>
      <PageHeader />
      <v-main :class="mainBackgroundColor">
        <v-container fluid>
          <v-row>
            <v-col cols="2">
              <div
                v-if="mehariSeqvarCsqQuery.data.value?.result?.length ?? 0"
                style="position: sticky; top: 20px"
              >
                <v-list v-model:opened="openedSection" density="compact" rounded="lg">
                  <BookmarkListItem :id="idForBookmark" type="seqvar" />

                  <v-btn
                    color=""
                    variant="outlined"
                    class="ma-2"
                    prepend-icon="mdi-launch"
                    @click.prevent="jumpToLocus()"
                  >
                    Jump in Local IGV
                  </v-btn>

                  <template v-if="mehariSeqvarCsqQuery.data.value?.result?.[0]?.gene_id?.length">
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
                              annonarsGenesInfoQuery.data.value?.genes?.[0]?.hgnc?.symbol ||
                              annonarsGenesInfoQuery.data.value?.genes?.[0]?.hgnc?.agr
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

              <template v-if="!!annonarsGenesInfoQuery.data.value">
                <!-- <div id="gene-overview">
                  <GeneOverviewCard :gene-info="annonarsGenesInfoQuery.data.value?.genes?.[0]" />
                </div>
                <div id="gene-pathogenicity" class="mt-3">
                  <GenePathogenicityCard :gene-info="annonarsGenesInfoQuery.data.value?.genes?.[0]">
                    <CadaRanking :hgnc-id="mehariSeqvarCsqQuery.data.value?.result?.[0]?.gene_id" />
                  </GenePathogenicityCard>
                </div>
                <div id="gene-conditions" class="mt-3">
                  <GeneConditionsCard
                    :gene-info="annonarsGenesInfoQuery.data.value?.genes?.[0]"
                    :hpo-terms="vigunoHpoTermsQuery.data.value?.hpo_terms"
                  />
                </div>
                <div id="gene-expression" class="mt-3">
                  <GeneExpressionCard
                    :gene-symbol="annonarsGenesInfoQuery.data.value?.genes?.[0]?.hgnc?.symbol"
                    :expression-records="annonarsGenesInfoQuery.data.value?.genes?.[0]?.gtex?.records"
                    :ensembl-gene-id="annonarsGenesInfoQuery.data.value?.genes?.[0]?.gtex?.ensembl_gene_id"
                  />
                </div>
                <div
                  v-if="geneInfoStore.geneClinvar && seqvar?.genomeBuild"
                  id="gene-clinvar"
                  class="mt-3"
                >
                  <GeneClinvarCard
                    :clinvar-per-gene="annonarsGenesClinvarQuery.data.value.genes?.[0].record"
                    :gene-info="annonarsGenesInfoQuery.data.value?.genes?.[0]"
                    :genome-build="seqvar.genomeBuild"
                    :transcripts="mehariGenesTranscriptsListQuery.data.value?.transcripts"
                  />
                </div>
                <div id="gene-literature" class="mt-3">
                  <GeneLiteratureCard :gene-info="geneInfoStore.geneInfo" />
                </div>
                 -->
              </template>
              <!--
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
                  <SeqvarClinsigCard
                    :seqvar="seqvarInfoStore.seqvar"
                    @error-display="handleDisplayError"
                  />
                </div>
                <div id="seqvar-csq" class="mt-3">
                  <SeqvarConsequencesCard :consequences="mehariSeqvarCsqQuery.data.value?.result" />
                </div>
                <div id="seqvar-clinvar" class="mt-3">
                  <SeqvarClinvarCard :clinvar-records="seqvarInfoStore.varAnnos?.clinvar" />
                </div>
                <div id="seqvar-scores" class="mt-3">
                  <SeqvarScoresCard :var-annos="seqvarInfoStore.varAnnos" />
                </div>
                <div id="seqvar-freqs" class="mt-3">
                  <SeqvarFreqsCard
                    :seqvar="seqvarInfoStore.seqvar"
                    :var-annos="seqvarInfoStore.varAnnos"
                  />
                </div>
                <div id="seqvar-tools" class="mt-3">
                  <SeqvarToolsCard
                    :seqvar="seqvarInfoStore.seqvar"
                    :var-annos="seqvarInfoStore.varAnnos"
                  />
                </div>
                <div id="seqvar-ga4ghbeacons" class="mt-3">
                  <SeqvarBeaconNetworkCard :seqvar="seqvarInfoStore.seqvar" />
                </div>
                <div id="seqvar-variantvalidator" class="mt-3">
                  <SeqvarVariantValidatorCard :seqvar="seqvarInfoStore.seqvar" />
                </div>
                <div id="seqvar-clinvarsub" class="mt-3">
                  <ClinvarsubCard :seqvar="seqvarInfoStore.seqvar" />
                </div>
              </div>
              -->
            </v-col>
          </v-row>
          <FooterDefault />
        </v-container>

        <v-snackbar v-model="errSnackbarShow" multi-line>
          {{ errSnackbarMsg }}

          <template #actions>
            <v-btn color="red" variant="text" @click="errSnackbarShow = false"> Close </v-btn>
          </template>
        </v-snackbar>
      </v-main>
    </v-app>
    <VueQueryDevtools />
  </div>
</template>
