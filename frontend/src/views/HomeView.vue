<!--
View for the homepage.

Implements the search bar for variants and genes.
-->

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FooterDefault from '@/components/FooterDefault.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import { type GenomeBuild } from '@/lib/genomeBuilds'
import { performSearch } from '@/lib/utils'
import { EXAMPLES, type Example } from '@/views/HomeView.c'

/** The current router. */
const router = useRouter()

/** Component state; current search term. */
const searchTerm = ref<string>('')
/** Component state; currently selected genome build. */
const genomeBuild = ref<GenomeBuild>('grch37')
/** Component state; whether or not to show case information. */
const showCaseInformation = ref(false)

/** Launches a search for one of the examples. */
const performExampleSearch = (example: Example) => {
  searchTerm.value = example.query
  genomeBuild.value = example.genomeBuild ?? 'grch37'
  performSearch(router, searchTerm.value, genomeBuild.value)
}
</script>

<template>
  <v-app>
    <PageHeader v-model:case-information="showCaseInformation" :hide-search-bar="true" />
    <v-main>
      <v-container class="home-view">
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="12" lg="6">
            <div class="text-h6">Enter a variant or gene to query for</div>

            <SearchBar
              v-model:search-term="searchTerm"
              v-model:genome-release="genomeBuild"
              @click-search="() => performSearch(router, searchTerm, genomeBuild)"
            />
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="12" lg="6">
            <v-card id="examples">
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
                      v-for="example in section.examples"
                      :key="example.query"
                      class="mr-1 mb-1 example"
                      variant="text"
                      prepend-icon="mdi-arrow-right-circle-outline"
                      @click="performExampleSearch(example)"
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
      </v-container>
    </v-main>
    <FooterDefault />
  </v-app>
</template>
