<!--
View that displays the details for a single gene.

This view will attempt to obtain the genome build from the query string,
falling back to 'grch37'.  In case that the genome build value is not
valid, an error message is displayed.

Note that the HGNC symbol is pushed into the component by  the router.
The backend uses HGNC IDs, however.
-->

<script setup lang="ts">
import { type GenomeBuild, guessGenomeBuild } from '@bihealth/reev-frontend-lib/lib/genomeBuilds'
import {
  useAnnonarsGenesClinvarQuery,
  useAnnonarsGenesInfoQuery,
  useAnnonarsGenesLookupQuery
} from '@bihealth/reev-frontend-lib/queries/annonars/genes'
import { useMehariGeneTranscriptsListQuery } from '@bihealth/reev-frontend-lib/queries/mehari/geneTranscripts'
import { useVigunoHpoGenesQuery } from '@bihealth/reev-frontend-lib/queries/viguno/genes'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

import BookmarkListItem from '@/components/BookmarkListItem/BookmarkListItem.vue'
import FooterDefault from '@/components/FooterDefault/FooterDefault.vue'
import { scrollToSection } from '@/lib/utils'

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

/** The component's props. */
const { hgncSymbol, genomeBuild } = withDefaults(
  defineProps<{
    /** The HGNC gene symbol to display for. */
    hgncSymbol: string
    /** The genome build selected in the query. */
    genomeBuild?: string
  }>(),
  { genomeBuild: 'grch37' }
)

/** The global Router objects. */
const router = useRouter()
/** The global Route object. */
const route = useRoute()

/** The global theme. */
const theme = useTheme()

/** Component state; resolved genome build and error message. */
const resolvedGenomeBuild = computed<{ genomeBuild: GenomeBuild; errorMessage?: string }>(() => {
  try {
    return { genomeBuild: guessGenomeBuild(genomeBuild) }
  } catch (err) {
    return { genomeBuild: 'grch37', errorMessage: String(err) }
  }
})
/** Component state; use for opening sections by default. */
const openedSection = ref<string[]>(['gene'])

/** Parameter for `useAnnonarsGenesLookupQuery`. */
const annonarsGenesLookupQueryParam = computed(() => [hgncSymbol])
/** Query to resolve the HGNC symbol to HGNC ID. */
const annonarsGenesLookupQuery = useAnnonarsGenesLookupQuery({
  query: annonarsGenesLookupQueryParam
})
/** Gene's HGNC ID as `ComputedRef` for queries (as array for some API). */
const hgncIds = computed<string[] | undefined>(
  () => {
    const result = annonarsGenesLookupQuery.data.value?.genes?.[0]?.gene_names?.hgnc_id
    return !!result ? [result] : undefined
  }
)
/** Gene's HGNC ID as `ComputedRef` for queries. */
const hgncId = computed<string | undefined>(() => hgncIds.value?.[0])
/** Query for annonars general gene information. */
const annonarsGenesInfoQuery = useAnnonarsGenesInfoQuery({
  hgnc_ids: hgncIds
})
/** Query for annonars ClinVar gene information. */
const annonarsGenesClinvarQuery = useAnnonarsGenesClinvarQuery({
  hgnc_ids: hgncIds
})
/** Query for HPO terms via viguno. */
const vigunoHpoTermsQuery = useVigunoHpoGenesQuery({
  gene_id: hgncId,
  hpo_terms: true
})
/** Query for gene transcripts. */
const mehariGenesTranscriptsListQuery = useMehariGeneTranscriptsListQuery({
  genome_build: resolvedGenomeBuild.value.genomeBuild,
  hgnc_id: hgncId
})

/** Return background color for v-main based on current theme. */
const mainBackgroundColor = computed(() => {
  return theme.global.current.value.dark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3'
})

// Hook up scrolling to section when mounted or the relevant input changes.
onMounted(() => scrollToSection(route))
watch(
  () => [route.hash, hgncSymbol, resolvedGenomeBuild.value],
  async () => await scrollToSection(route)
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
  <div>
    <v-app>
      <PageHeader />
      <v-main :class="mainBackgroundColor">
        <v-container fluid>
          <v-row>
            <v-col cols="2">
              <div v-if="!!hgncIds" style="position: sticky; top: 20px">
                <v-list v-model:opened="openedSection" rounded="lg">
                  <BookmarkListItem :id="hgncId ?? ''" :type="'gene'" />

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
              <v-alert v-if="resolvedGenomeBuild.errorMessage?.length" type="warning" class="mb-6">
                <div>
                  {{ resolvedGenomeBuild.errorMessage }}
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
                  :gene-info="annonarsGenesInfoQuery.data.value?.genes?.[0]"
                  :show-gene-details-link="false"
                />
              </div>

              <div id="gene-pathogenicity" class="mt-3">
                <GenePathogenicityCard :gene-info="annonarsGenesInfoQuery.data.value?.genes?.[0]">
                  <CadaRanking :hgnc-id="hgncId" />
                </GenePathogenicityCard>
              </div>

              <div id="gene-conditions" class="mt-3">
                <GeneConditionsCard
                  :gene-info="annonarsGenesInfoQuery.data.value?.genes?.[0]"
                  :hpo-terms="vigunoHpoTermsQuery.data.value?.result?.[0]?.hpo_terms ?? undefined"
                />
              </div>

              <div id="gene-expression" class="mt-3">
                <GeneExpressionCard
                  :gene-symbol="annonarsGenesInfoQuery.data.value?.genes?.[0]?.hgnc?.symbol"
                  :expression-records="annonarsGenesInfoQuery.data.value?.genes?.[0]?.gtex?.records"
                  :ensembl-gene-id="
                    annonarsGenesInfoQuery.data.value?.genes?.[0]?.gtex?.ensembl_gene_id
                  "
                />
              </div>

              <div v-if="annonarsGenesClinvarQuery.data.value" id="gene-clinvar" class="mt-3">
                <GeneClinvarCard
                  :clinvar-per-gene="annonarsGenesClinvarQuery.data.value?.genes?.[0]?.record"
                  :gene-info="annonarsGenesInfoQuery.data.value?.genes?.[0]"
                  :genome-build="resolvedGenomeBuild.genomeBuild"
                  :transcripts="mehariGenesTranscriptsListQuery.data.value?.transcripts"
                />
              </div>

              <div id="gene-literature" class="mt-3">
                <GeneLiteratureCard
                  :hgnc-symbol="annonarsGenesInfoQuery.data.value?.genes?.[0]?.hgnc?.symbol"
                />
              </div>
            </v-col>
          </v-row>
          <FooterDefault />
        </v-container>
      </v-main>
    </v-app>
  </div>
  <VueQueryDevtools />
</template>
