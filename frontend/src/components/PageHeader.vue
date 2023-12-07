<!--
Component displayed as the page header.

By default, contains a search bar that allows to trigger search (by pushing
the query term through the router), but this can be disabled.
-->

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

import { type GenomeBuild } from '@/lib/genomeBuilds'
import { performSearch } from '@/lib/utils'

// Define the async components.
const SearchBar = defineAsyncComponent(() => import('@/components/SearchBar.vue'))
const UserProfileButton = defineAsyncComponent(() => import('@/components/UserProfileButton.vue'))
const CaseInformationCard = defineAsyncComponent(
  () => import('@/components/CaseInformationCard.vue')
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

/** Component state; search term */
const searchTermRef = ref<string>('')
/** Component state; genome build. */
const genomeBuildRef = ref<GenomeBuild>('grch37')
</script>

<template>
  <v-app-bar app class="top-bar">
    <v-toolbar-title>
      <router-link to="/">
        <img
          id="logo"
          style="vertical-align: middle"
          src="@/assets/reev-logo.svg"
          alt="logo"
          width="70"
        />
      </router-link>
    </v-toolbar-title>
    <template v-if="!hideSearchBar">
      <SearchBar
        v-model:search-term="searchTermRef"
        v-model:genome-release="genomeBuildRef"
        class="top-search-bar"
        density="compact"
        @click-search="() => performSearch(router, searchTermRef, genomeBuildRef)"
      />
      <v-spacer></v-spacer>
    </template>
    <v-toolbar-items class="topbar-links">
      <v-dialog scrollable width="auto" location="top">
        <template #activator="{ props: vProps }">
          <v-btn class="mr-4" prepend-icon="mdi-information-outline" v-bind="vProps">
            Show Case Information
          </v-btn>
        </template>
        <v-card>
          <CaseInformationCard />
        </v-card>
      </v-dialog>

      <UserProfileButton />
      <v-menu id="menu">
        <template #activator="{ props: vProps }">
          <v-btn icon="mdi-dots-vertical" v-bind="vProps" />
        </template>

        <v-list>
          <v-list-item id="about" to="/about">
            <v-list-item-title> About </v-list-item-title>
          </v-list-item>
          <v-list-item id="contact" to="/contact">
            <v-list-item-title> Contact </v-list-item-title>
          </v-list-item>
          <v-list-item id="privacy" to="/privacy">
            <v-list-item-title> Privacy Policy </v-list-item-title>
          </v-list-item>
          <v-list-item id="terms" to="/terms">
            <v-list-item-title> Terms of Use </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-app-bar>
</template>

<style scoped>
.top-bar {
  background-color: white;
  border-bottom: 2px solid #455a64;
}

.top-search-bar {
  display: flex;
  width: 50%;
}

.topbar-links {
  display: flex;
  margin: 0 10px;
}

#logo {
  margin-left: 25px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
