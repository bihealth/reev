<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BookmarkButton from '@/components/BookmarkButton.vue'
import AlternativeIdentifiers from '@/components/GeneDetails/AlternativeIdentifiers.vue'
import ClinvarFreqPlot from '@/components/GeneDetails/ClinVarFreqPlot.vue'
import ClinvarImpact from '@/components/GeneDetails/ClinvarImpact.vue'
import ConstraintsCard from '@/components/GeneDetails/ConstraintsCard.vue'
import DiseaseAnnotation from '@/components/GeneDetails/DiseaseAnnotation.vue'
import ExternalResouces from '@/components/GeneDetails/ExternalResources.vue'
import GeneRifs from '@/components/GeneDetails/GeneRifs.vue'
import GtexGenePlot from '@/components/GeneDetails/GtexGenePlot.vue'
import HgncCard from '@/components/GeneDetails/HgncCard.vue'
import LocusDatabases from '@/components/GeneDetails/LocusDatabases.vue'
import NcbiSummary from '@/components/GeneDetails/NcbiSummary.vue'
import SupplementaryList from '@/components/GeneDetails/SupplementaryList.vue'
import VariationLandscape from '@/components/GeneDetails/VariationLandscape.vue'
import HeaderDetailPage from '@/components/HeaderDetailPage.vue'
import { useGeneInfoStore } from '@/stores/geneInfo'
import { StoreState } from '@/stores/misc'

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

const geneInfoStore = useGeneInfoStore()

const scrollToSection = async () => {
  const sectionId = route.hash.slice(1)
  if (sectionId) {
    const elem = document.getElementById(sectionId)
    elem?.scrollIntoView()
  }
}

const loadDataToStore = async () => {
  await geneInfoStore.loadData(props.searchTerm, props.genomeRelease)
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
  { id: 'hgnc', title: 'HGNC' },
  { id: 'variation-landscape', title: 'Variation Landscape' },
  { id: 'constraints-scores', title: 'Constraints / Scores' },
  { id: 'ncbi-summary', title: 'NCBI Summary' },
  { id: 'alternative-identifiers', title: 'Alternative Identifiers' },
  { id: 'external-resources', title: 'External Resources' },
  { id: 'disease-annotation', title: 'Disease Annotation' },
  { id: 'acmg-list', title: 'ACMG Supplementary Findings List' },
  { id: 'gene-rifs', title: 'Gene RIFs' },
  { id: 'locus-specific-databases', title: 'Locus-Specific Databases' },
  { id: 'clinvar-impact', title: 'Clinvar By Impact' },
  { id: 'clinvar-frequency', title: 'Clinvar By Frequency' },
  { id: 'gtex', title: 'GTEx Expression' }
]

// We need to use refs here because of props mutations in the parent
const searchTermRef = ref(props.searchTerm)
const genomeReleaseRef = ref(props.genomeRelease)
</script>

<template>
  <HeaderDetailPage v-model:search-term="searchTermRef" v-model:genome-release="genomeReleaseRef" />
  <v-navigation-drawer location="right" class="overflow-auto">
    <div v-if="geneInfoStore.storeState == StoreState.Active" class="gene-info">
      <BookmarkButton :type="'gene'" :id="searchTermRef" />
      Sections:
      <v-list density="compact" nav>
        <v-list-item
          v-for="section in SECTIONS"
          :key="section.id"
          :id="`${section.id}-nav`"
          @click="router.push({ hash: `#${section.id}` })"
        >
          <v-list-item-title>{{ section.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
  <v-layout>
    <v-main style="min-height: 300px">
      <div v-if="geneInfoStore.storeState == StoreState.Active" class="gene-info">
        <div id="hgnc" class="gene-item">
          <HgncCard :hgnc="geneInfoStore.geneInfo?.hgnc" />
        </div>

        <div id="variation-landscape" class="gene-item">
          <VariationLandscape
            :clinvar="geneInfoStore.geneClinvar"
            :transcripts="geneInfoStore.transcripts"
            :genome-release="genomeReleaseRef"
            :hgnc="geneInfoStore.geneInfo?.hgnc?.hgnc_id"
          />
        </div>

        <div id="constraints-scores" class="gene-item">
          <ConstraintsCard :gnomad-constraints="geneInfoStore.geneInfo?.gnomad_constraints" />
        </div>

        <div id="ncbi-summary" class="gene-item">
          <NcbiSummary
            :ncbi-summary="geneInfoStore.geneInfo?.ncbi?.summary"
            :gene-id="geneInfoStore.geneInfo?.ncbi?.gene_id"
          />
        </div>

        <div id="alternative-identifiers" class="gene-item">
          <AlternativeIdentifiers :hgnc="geneInfoStore.geneInfo?.hgnc" />
        </div>

        <div id="external-resources" class="gene-item">
          <ExternalResouces :hgnc="geneInfoStore.geneInfo?.hgnc" />
        </div>

        <div id="disease-annotation" class="gene-item">
          <DiseaseAnnotation :dbnsfp="geneInfoStore.geneInfo.dbnsfp" />
        </div>

        <div id="acmg-list" class="gene-item">
          <SupplementaryList :acmg-sf="geneInfoStore.geneInfo?.acmg_sf" />
        </div>

        <div id="gene-rifs" class="gene-item">
          <GeneRifs :ncbi="geneInfoStore.geneInfo?.ncbi" />
        </div>

        <div id="locus-specific-databases" class="gene-item">
          <LocusDatabases :hgnc="geneInfoStore.geneInfo?.hgnc" />
        </div>

        <div id="clinvar-impact" class="gene-item">
          <ClinvarImpact :gene-clinvar="geneInfoStore.geneClinvar" />
        </div>

        <div id="clinvar-frequency" class="gene-item">
          <ClinvarFreqPlot
            :gene-symbol="geneInfoStore.geneInfo?.hgnc?.hgnc_id"
            :per-freq-counts="geneInfoStore.geneClinvar?.per_freq_counts"
          />
        </div>

        <div id="gtex" class="gene-item">
          <GtexGenePlot
            :gene-symbol="geneInfoStore.geneInfo?.hgnc?.hgnc_id"
            :expression-records="geneInfoStore.geneInfo?.gtex?.records"
            :ensembl-gene-id="geneInfoStore.geneInfo?.gtex?.ensembl_gene_id"
          />
        </div>
      </div>
    </v-main>
  </v-layout>
</template>

<style scoped>
.gene-info {
  width: 95%;
  margin: 20px;
}

.gene-item {
  margin-bottom: 20px;
  /* border: 2px solid rgb(229, 85, 64);
  border-radius: 10px; */
  padding: 5px 10px;
}
</style>
