<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import { roundIt } from '@/lib/utils'
import { useCadaPrioStore } from '@/stores/cadaprio'
import { useCaseStore } from '@/stores/case'
import { StoreState } from '@/stores/misc'

const caseStore = useCaseStore()
const cadaPrioStore = useCadaPrioStore()
const cadaPrioRankingFields = ref([
  { title: '#', key: 'rank' },
  { title: 'Gene Symbol', key: 'gene_symbol' },
  { title: 'Score', key: 'score' }
])

const loadDataToStore = async () => {
  await caseStore.loadCase()
  if (caseStore.caseInfo.hpoTerms.length > 0) {
    const hpoTermsList: string[] = caseStore.caseInfo.hpoTerms.map((term) => term.term_id)
    await cadaPrioStore.loadData(hpoTermsList)
  }
}

onMounted(async () => {
  loadDataToStore()
})

watch(
  () => caseStore.caseInfo.hpoTerms,
  async () => {
    if (caseStore.caseInfo.hpoTerms.length > 0) {
      const hpoTermsList: string[] = caseStore.caseInfo.hpoTerms.map((term) => term.term_id)
      await cadaPrioStore.loadData(hpoTermsList)
    }
  }
)
</script>

<template>
  <v-card id="gene-ranking" class="gene-item">
    <div v-if="cadaPrioStore.geneRanking">
      <v-card-title>Cada-prio gene ranking for current HPO:</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="cadaPrioRankingFields as any"
          :items="cadaPrioStore.geneRanking"
          :items-per-page="10"
          density="compact"
        >
          <template v-slot:[`item.gene_symbol`]="{ item }">
            <router-link
              :to="{ name: 'gene', params: { searchTerm: item.hgnc_id, genomeRelease: 'grch38' } }"
              target="_blank"
            >
              {{ item.gene_symbol }}
            </router-link>
          </template>

          <template v-slot:[`item.score`]="{ item }">
            <span v-html="roundIt(item.score, 2)" />
          </template>
        </v-data-table>
      </v-card-text>
    </div>
    <div v-else-if="cadaPrioStore.storeState === StoreState.Loading">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <div v-else>
      <v-card-text>
        <p>No gene ranking for current phenotype was found. Did you specify HPO terms?</p>
      </v-card-text>
    </div>
  </v-card>
</template>
