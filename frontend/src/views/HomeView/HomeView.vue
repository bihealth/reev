<!--
View for the homepage.

Implements the search bar for variants and genes.
-->

<script setup lang="ts">
import { type GenomeBuild } from '@bihealth/reev-frontend-lib/lib/genomeBuilds'
import { computed, ref } from 'vue'
import { type RouteLocationRaw, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

import FooterDefault from '@/components/FooterDefault/FooterDefault.vue'
import PageHeader from '@/components/PageHeader/PageHeader.vue'
import SearchBar from '@/components/SearchBar/SearchBar.vue'
import { performSearch, searchTo } from '@/lib/utils'

import { EXAMPLES } from './constants'
import { type Example } from './types'

/** The current router. */
const router = useRouter()

/** The global theme. */
const theme = useTheme()

/** Component state; current search term. */
const searchTerm = ref<string>('')
/** Component state; currently selected genome build. */
const genomeBuild = ref<GenomeBuild>('grch37')

/** Launches a search for one of the examples. */
const exampleSearchTo = (example: Example): RouteLocationRaw => {
  return searchTo(example.query, example.genomeBuild ?? genomeBuild.value)
}

/** Return backgorund color for v-main based on current theme. */
const mainBackgroundColor = computed(() => {
  return theme.global.current.value.dark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3'
})
</script>

<template>
  <v-app>
    <PageHeader :hide-search-bar="true" />
    <v-main :class="mainBackgroundColor">
      <v-container>
        <v-row class="justify-center align-center">
          <v-col cols="12" md="12" lg="10" xl="6" class="py-2">
            <v-sheet class="px-4 py-3 mx-auto">
              <p>
                <span class="font-weight-bold"> REEV evaluates and explains variants. </span>
              </p>
              <p>
                REEV is a tool to help you interpret genomic variants. You can enter your query for
                genes, small, and structural variants into the search bar below. If you are new to
                REEV, consider looking at our
                <a href="https://reev.readthedocs.io/en/latest/doc_quickstart.html" target="_blank">
                  quickstart instructions
                  <small><v-icon>mdi-launch</v-icon></small>
                </a>
                or our
                <a href="https://reev.readthedocs.io/en/latest/doc_tutorial.html" target="_blank">
                  tutorial
                  <small><v-icon>mdi-launch</v-icon></small> </a
                >. This website uses no cookies beyond session cookies for logged in users. REEV is
                free to use for all users (see
                <router-link to="/info#terms-of-use">
                  terms of use
                  <small> <v-icon>mdi-arrow-right-circle-outline</v-icon> </small> </router-link
                >). The software itself open source and can be found at
                <a href="https://github.com/bihealth/reev" target="_blank">
                  GitHub <small><v-icon>mdi-launch</v-icon></small> </a
                >.
              </p>
            </v-sheet>
          </v-col>
        </v-row>

        <v-row class="justify-center align-center">
          <v-col cols="12" md="12" lg="10" xl="6" class="py-2">
            <v-sheet class="px-4 py-3 mx-auto">
              <div class="text-h6">Enter variant/gene to query for</div>

              <SearchBar
                v-model:search-term="searchTerm"
                v-model:genome-release="genomeBuild"
                @click-search="() => performSearch(router, searchTerm, genomeBuild)"
              />
            </v-sheet>
          </v-col>
        </v-row>

        <v-row class="justify-center align-center">
          <v-col cols="12" lg="10" xl="6" class="py-2">
            <v-sheet id="examples" class="px-3 py-3 mx-auto">
              <v-card-title class="px-1 pb-0"> Need some inspiration? </v-card-title>
              <v-card-text class="px-1">
                <div v-for="(section, idx) in EXAMPLES" :key="section.title">
                  <div class="text-overline" :class="{ 'mt-0': idx === 0, 'mt-3': idx !== 0 }">
                    {{ section.title }}
                  </div>
                  <div v-if="section.text">
                    {{ section.text }}
                  </div>
                  <div class="mt-2">
                    <template
                      v-for="(example, idxInner) in section.examples"
                      :key="`example-${idxInner}`"
                    >
                      <router-link
                        :to="exampleSearchTo(example)"
                        class="mr-2 px-2 py-1 d-block d-sm-inline-block router-link example"
                      >
                        <v-icon class="pr-2">mdi-arrow-right-circle-outline</v-icon>
                        <span style="text-wrap: wrap !important">{{ example.query }}</span>
                        <span v-if="example.hint" class="d-none d-md-inline"
                          >({{ example.hint }})</span
                        >
                      </router-link>
                    </template>
                  </div>
                </div>
              </v-card-text>
            </v-sheet>
          </v-col>
        </v-row>
        <FooterDefault />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-main {
  background-color: #f5f5f5;
}
</style>
