<!--
View for running the search for gene or variants.

The home page and search bars redirect here when the user executes the query.
-->

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

import FooterDefault from '@/components/FooterDefault.vue'
import PageHeader from '@/components/PageHeader.vue'
import { type GenomeBuild, guessGenomeBuild } from '@/lib/genomeBuilds'
import { InvalidPos } from '@/lib/genomicVars'
import { NotOneGeneInfo, type ScoredGeneInfo, performQuery } from '@/lib/query'

/** The global Router instance. */
const router = useRouter()

/** The global theme. */
const theme = useTheme()

/** Component state; Warning or error message to display to user. */
const errorMessage = ref<string>('')
/** Component state; Resulting genes if we fell through to gene query and count was not 1. */
const scoredGeneInfos = ref<ScoredGeneInfo[] | null>(null)

/** Executes the query resolution, to be called on mounted. */
const queryExecutionOnMounted = async () => {
  const query = router.currentRoute.value.query

  // Check genome release and obtain as `GenomeBuild`.
  let genomeBuild: GenomeBuild
  try {
    genomeBuild = guessGenomeBuild(query.genomeBuild)
  } catch (err) {
    errorMessage.value = String(err)
    return
  }

  // Now try to resolve the query to a gene or variant and redirect to the
  // appropriate view.
  try {
    const loc = await performQuery((query.q ?? '') as string, genomeBuild)
    router.push(loc)
  } catch (err) {
    if (err instanceof InvalidPos) {
      errorMessage.value = `Invalid position in "${query.q}": ${err}`
    } else if (err instanceof NotOneGeneInfo) {
      scoredGeneInfos.value = err.entries
    } else {
      errorMessage.value = `Query for "${query.q}" failed: ${err}`
    }
  }
}

/** Return backgorund color for v-main based on current theme. */
const mainBackgroundColor = computed(() => {
  return theme.global.current.value.dark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3'
})

// Execute the query resolution logic after the component has been mounted.
onMounted(queryExecutionOnMounted)
</script>

<template>
  <v-app>
    <PageHeader :hide-search-bar="true" />
    <v-main :class="mainBackgroundColor">
      <v-container>
        <div>
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

          <div v-if="scoredGeneInfos === null" class="text-center">
            <v-progress-circular indeterminate :size="125" :width="12"></v-progress-circular>
            <div class="text-h5 mt-3">Loading...</div>
          </div>

          <v-card v-else>
            <v-card-title> Gene Search Results </v-card-title>
            <template v-if="scoredGeneInfos.length !== 0">
              <v-card-subtitle class="text-overline">
                Found more than one gene for
                <span class="font-italic">{{ router.currentRoute.value.query.q }}</span>
              </v-card-subtitle>
              <v-card-text>
                <v-sheet
                  v-for="{ data: geneInfo } in scoredGeneInfos"
                  :key="geneInfo.symbol"
                  class="bg-grey-lighten-2 pa-3 mb-2"
                >
                  <div>
                    <v-btn
                      class="text-h6 px-0"
                      variant="text"
                      append-icon="mdi-arrow-right-circle-outline"
                      :to="{
                        name: 'gene-details',
                        params: { gene: geneInfo.symbol }
                      }"
                    >
                      {{ geneInfo.symbol }}
                    </v-btn>
                  </div>
                  <div>
                    <template v-if="geneInfo.alias_symbol?.length">
                      {{ geneInfo.alias_symbol.join(', ') }} |
                    </template>
                    {{ geneInfo.name }}
                    <template v-if="geneInfo.alias_name?.length">
                      |
                      {{ geneInfo.alias_name.join(', ') }}
                    </template>
                  </div>
                </v-sheet>
              </v-card-text>
            </template>
            <template v-else>
              <v-card-text>
                <div class="text-center color-grey-darken-2">
                  No results for query "<span class="font-italic">{{
                    router.currentRoute.value.query.q
                  }}</span
                  >". Do you have a typo in your HGVS description?
                </div>
              </v-card-text>
            </template>
          </v-card>
        </div>
      </v-container>
    </v-main>
    <FooterDefault />
  </v-app>
</template>
