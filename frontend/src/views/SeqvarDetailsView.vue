<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Components
import BookmarkListItem from '@/components/BookmarkListItem.vue'
import { useGeneInfoStore } from '@/stores/geneInfo'
import { StoreState } from '@/stores/misc'
import { useVariantAcmgRatingStore } from '@/stores/variantAcmgRating'
import { useVariantInfoStore } from '@/stores/variantInfo'
import { type SmallVariant } from '@/stores/variantInfo'

const HeaderDetailPage = defineAsyncComponent(() => import('@/components/HeaderDetailPage.vue'))

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

/** Information about the sequence variant, used to fetch information on load. */
const variantInfoStore = useVariantInfoStore()
/** Information about the affected gene, used to fetch information on load. */
const geneInfoStore = useGeneInfoStore()
/** ACMG criteria store. */
const acmgRatingStore = useVariantAcmgRatingStore()

const scrollToSection = async () => {
  const sectionId = route.hash.slice(1)
  if (!sectionId) {
    return
  }
  const elem = document.getElementById(sectionId)
  elem?.scrollIntoView()
}

const loadDataToStore = async () => {
  await variantInfoStore.loadData(props.searchTerm, props.genomeRelease)
  if (variantInfoStore.geneInfo?.hgnc?.agr) {
    await geneInfoStore.loadData(variantInfoStore.geneInfo?.hgnc?.agr, props.genomeRelease)
  } else {
    await geneInfoStore.clearData()
  }
  acmgRatingStore.fetchAcmgRating(variantInfoStore.smallVariant as SmallVariant)
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

// We need to use refs here because of props mutations in the parent
const searchTermRef = ref(props.searchTerm)
const genomeReleaseRef = ref(props.genomeRelease)

// The `v-list-group` API needs this here so we can enable sections by default.
const openedSection = ref<string[]>(['gene', 'seqvar'])
</script>

<template>
  <v-app>
    <HeaderDetailPage
      v-model:search-term="searchTermRef"
      v-model:genome-release="genomeReleaseRef"
    />
    <v-navigation-drawer :elevation="3" :permanent="true">
      <div v-if="variantInfoStore.storeState == StoreState.Active">
        <v-list v-model:opened="openedSection">
          <BookmarkListItem :id="searchTermRef" type="seqvar" />

          <v-list-subheader> GENE </v-list-subheader>

          <template v-if="geneInfoStore.geneSymbol?.length">
            <v-list-group value="gene">
              <template #activator="{ props: vProps }">
                <v-list-item :value="vProps" prepend-icon="mdi-dna">
                  Gene
                  <span class="font-italic">
                    {{
                      variantInfoStore?.geneInfo?.hgnc?.symbol ||
                      variantInfoStore?.geneInfo?.hgnc?.agr
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
                <v-list-item-title>
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
                prepend-icon="mdi-magnify-expand"
                title="Variant Details"
              />
            </template>

            <v-list-item
              v-for="section in SECTIONS.SEQVAR"
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

    <v-main class="mb-3 mx-3">
      <template v-if="variantInfoStore?.geneInfo">
        <div id="gene-overview" class="mt-3">
          <GeneOverviewCard :gene-info="variantInfoStore?.geneInfo" />
        </div>
        <div id="gene-pathogenicity">
          <GenePathogenicityCard :gene-info="variantInfoStore?.geneInfo" />
        </div>
        <div id="gene-conditions">
          <GeneConditionsCard :gene-info="variantInfoStore?.geneInfo" :hpo-terms="[]" />
        </div>
        <div id="gene-expression">
          <GeneExpressionCard
            :gene-symbol="variantInfoStore?.geneInfo?.hgnc?.symbol"
            :expression-records="variantInfoStore?.geneInfo?.gtex?.records"
            :ensembl-gene-id="variantInfoStore?.geneInfo?.gtex?.ensemblGeneId"
          />
        </div>
        <div v-if="geneInfoStore?.geneClinvar" id="gene-clinvar">
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

        <div id="sevar-clinsig">
          <ClinsigCard :small-variant="variantInfoStore.smallVariant" />
        </div>

        <div id="seqvar-csq" class="mt-3">
          <VariantDetailsTxCsq :tx-csq="variantInfoStore.txCsq" />
        </div>

        <div id="seqvar-clinvar" class="mt-3">
          <VariantDetailsClinvar :clinvar="variantInfoStore.varAnnos?.clinvar" />
        </div>

        <div id="seqvar-freqs" class="mt-3">
          <VariantDetailsFreqs
            :small-var="variantInfoStore.smallVariant as SmallVariant"
            :var-annos="variantInfoStore.varAnnos"
          />
        </div>

        <div id="seqvar-scores" class="mt-3">
          <VariantScoresCard
            :small-var="variantInfoStore.smallVariant"
            :var-annos="variantInfoStore.varAnnos"
          />
        </div>

        <div id="seqvar-tools" class="mt-3">
          <VariantToolsCard
            :small-var="variantInfoStore.smallVariant"
            :var-annos="variantInfoStore.varAnnos"
          />
        </div>

        <div id="seqvar-ga4ghbeacons" class="mt-3">
          <BeaconNetworkCard :small-variant="variantInfoStore.smallVariant" />
        </div>

        <div id="seqvar-variantvalidator" class="mt-3">
          <VariantValidatorCard :small-variant="variantInfoStore.smallVariant" />
        </div>
      </div>
    </v-main>
  </v-app>
</template>
