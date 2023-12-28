<!--
View for the homepage.

Implements the search bar for variants and genes.
-->

<script setup lang="ts">
import { computed, ref } from 'vue'
import { type RouteLocationRaw, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

import FooterDefault from '@/components/FooterDefault.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import { type GenomeBuild } from '@/lib/genomeBuilds'
import { performSearch, searchTo } from '@/lib/utils'
import { EXAMPLES, type Example } from '@/views/HomeView.c'

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
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="12" lg="6" class="py-2">
            <v-sheet class="px-6 py-3">
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
          <v-spacer></v-spacer>
        </v-row>

        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="12" lg="6" class="py-2">
            <v-sheet class="px-6 py-3">
              <div class="text-h6">Enter a variant or gene to query for</div>

              <SearchBar
                v-model:search-term="searchTerm"
                v-model:genome-release="genomeBuild"
                @click-search="() => performSearch(router, searchTerm, genomeBuild)"
              />
            </v-sheet>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="12" lg="6" class="py-2">
            <v-card id="examples" class="px-3 py-3">
              <v-card-title> Need some inspiration? </v-card-title>
              <v-card-text>
                <div v-for="section in EXAMPLES" :key="section.title">
                  <div class="text-overline mt-3">
                    {{ section.title }}
                  </div>
                  <div v-if="section.text">
                    {{ section.text }}
                  </div>
                  <div class="mt-2">
                    <v-btn
                      v-for="(example, idx) in section.examples"
                      :key="idx"
                      class="mx-1 mb-1 example text-none px-2"
                      variant="text"
                      :rounded="false"
                      prepend-icon="mdi-arrow-right-circle-outline"
                      :to="exampleSearchTo(example)"
                    >
                      {{ example.query }}
                      <template v-if="example.hint">({{ example.hint }})</template>
                    </v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-spacer></v-spacer>
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
