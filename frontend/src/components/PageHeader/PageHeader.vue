<!--
Component displayed as the page header.

By default, contains a search bar that allows to trigger search (by pushing
the query term through the router), but this can be disabled.
-->

<script setup lang="ts">
import { type GenomeBuild } from '@bihealth/reev-frontend-lib/lib/genomeBuilds'
import { defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

import { performSearch } from '@/lib/utils'

// Define the async components.
const SearchBar = defineAsyncComponent(() => import('@/components/SearchBar/SearchBar.vue'))
const UserProfileButton = defineAsyncComponent(
  () => import('@/components/UserProfileButton/UserProfileButton.vue')
)
const CaseInformationCard = defineAsyncComponent(
  () => import('@/components/CaseInformationCard/CaseInformationCard.vue')
)

/** This component's props. */
export interface Props {
  /** Whether to hide the search bar. */
  hideSearchBar?: boolean
}

/** The component's props with defaults applied. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  hideSearchBar: false
})

/** The global Router instance. */
const router = useRouter()
/** The global Theme instance. */
const theme = useTheme()

/** Component state; search term */
const searchTermRef = ref<string>('')
/** Component state; genome build. */
const genomeBuildRef = ref<GenomeBuild>('grch37')

/** Whether to show the case info box. */
const showCaseInfo = ref<boolean>(false)

/** Helper function to between light and dark theme. */
function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'customLightTheme' : 'dark'
}
</script>

<template>
  <v-app-bar flat>
    <v-container class="mx-auto d-flex align-center justify-center">
      <router-link to="/" class="text-no-wrap">
        <img
          id="logo"
          class="ml-4 mr-3"
          style="vertical-align: middle"
          src="@/assets/reev-logo.svg"
          alt="logo"
          width="50"
        />
        <span class="text-h6 d-none d-sm-inline"> REEV </span>
      </router-link>

      <v-spacer></v-spacer>
      <template v-if="!hideSearchBar">
        <SearchBar
          v-model:search-term="searchTermRef"
          v-model:genome-release="genomeBuildRef"
          density="compact"
          @click-search="() => performSearch(router, searchTermRef, genomeBuildRef)"
        />
      </template>
      <v-spacer></v-spacer>

      <v-btn
        variant="text"
        title="Toggle between dark and light theme."
        class="d-none d-sm-inline-block"
        @click="toggleTheme"
      >
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>

      <v-btn class="mr-2" prepend-icon="mdi-account-group" @click="showCaseInfo = true">
        <span class="d-none d-sm-inline"> Case Info </span>
      </v-btn>

      <UserProfileButton />

      <v-menu id="menu">
        <template #activator="{ props: vProps }">
          <v-btn icon="mdi-dots-vertical" v-bind="vProps" />
        </template>

        <v-list>
          <v-list-item id="about" to="/info#about">
            <v-list-item-title> About </v-list-item-title>
          </v-list-item>
          <v-list-item id="contact" to="/info#contact">
            <v-list-item-title> Contact </v-list-item-title>
          </v-list-item>
          <v-list-item id="privacy" to="/info#privacy-policy">
            <v-list-item-title> Privacy Policy </v-list-item-title>
          </v-list-item>
          <v-list-item id="terms" to="/info#terms-of-use">
            <v-list-item-title> Terms of Use </v-list-item-title>
          </v-list-item>
          <v-list-item id="data-versions" to="/info#data-versions">
            <v-list-item-title> Data Versions </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-container>
  </v-app-bar>

  <v-dialog v-model="showCaseInfo" scrollable width="auto" location="top">
    <v-card>
      <CaseInformationCard @click-close="showCaseInfo = false" />
    </v-card>
  </v-dialog>
</template>
