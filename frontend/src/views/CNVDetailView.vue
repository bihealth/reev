<script setup lang="ts">
/**
 * Detailed display of CNV information.
 */

import { watch, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useCNVInfoStore } from '@/stores/cnvInfo'
import { StoreState } from '@/stores/misc'

import HeaderDetailPage from '@/components/HeaderDetailPage.vue'
import { type CNVRecord } from '@/stores/cnvInfo'
import CNVDetailsGenes from '@/components/CNVDetails/CNVGenes.vue'
import CNVDetailsClinvar from '@/components/CNVDetails/CNVDetailsClinvar.vue'
import CNVDetailsGenotypeCall from '@/components/CNVDetails/CNVDetailsGenotypeCall.vue'

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

const cnvInfoStore = useCNVInfoStore()

const scrollToSection = async () => {
  const sectionId = route.hash.slice(1)
  const elem = document.getElementById(sectionId)
  elem?.scrollIntoView()
}

const loadDataToStore = async () => {
  await cnvInfoStore.loadData(props.searchTerm, props.genomeRelease)
  await scrollToSection()
}

// Pretty display of coordinates.
const cnvLocus = (record: CNVRecord): string | null => {
  if (!record) {
    return null
  }

  let locus: string
  if (record.sv_type === 'BND' || record.sv_type === 'INS') {
    locus = `${record.chromosome}:${record.start - 1000}-${record.start + 1000}`
  } else {
    locus = `${record.chromosome}:${record.start - 1000}-${record.end + 1000}`
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
  () => cnvInfoStore.storeState,
  (storeState) => {
    if (storeState == StoreState.Error) {
      cnvInfoStore.clearData()
      router.push({ name: 'home' })
    }
  }
)

const SECTIONS = [
  { id: 'gene', title: 'Gene' },
  { id: 'clinvar', title: 'ClinVar' },
  { id: 'call-details', title: 'Genotype Call' },
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
    <div v-if="cnvInfoStore.storeState == StoreState.Active" class="variant-info">
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
      <div v-if="cnvInfoStore.storeState == StoreState.Active" class="cnv-info">
        <div id="gene" class="cnv-item">
          <h2>Genes</h2>
          <v-divider />
          <CNVDetailsGenes :genes-infos="cnvInfoStore.genesInfos" />
        </div>
        <div id="clinvar" class="cnv-item">
          <h2>ClinVar</h2>
          <v-divider />
          <CNVDetailsClinvar />
        </div>
        <div id="call-details" class="cnv-item">
          <h2>Genotype Call</h2>
          <v-divider />
          Precise coordinates:
          <code> {{ cnvLocus(cnvInfoStore.currentCNVRecord) }} </code>
          <CNVDetailsGenotypeCall :current-cnv-record="cnvInfoStore.currentCNVRecord" />
        </div>
        <div id="acmg" class="cnv-item">
          <h2>ACMG</h2>
          <v-divider />
          <!-- <CNVAcmgRating /> -->
        </div>
        <div id="genome-browser" class="cnv-item">
          <h2>Genome Browser</h2>
          <v-divider />
          <!-- <GenomeBrowser
                :case-uuid="cnvInfoStore.caseUuid"
                :genome="genomeRelease"
                :locus="cnvLocus(cnvInfoStore.currentCNVRecord)"
              /> -->
        </div>
      </div>

      <div v-else>
        <div class="d-flex align-center justify-center" style="min-height: 300px">
          <h1>Loading CNV information</h1>
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
      </div>
    </v-main>
  </v-layout>
</template>

<style scoped>
.cnv-info {
  width: 95%;
  margin: 20px;
}

.cnv-item {
  margin-bottom: 20px;
  border: 2px solid rgb(229, 85, 64);
  border-radius: 10px;
  padding: 5px 10px;
}
</style>
