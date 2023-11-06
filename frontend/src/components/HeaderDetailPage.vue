<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { search } from '@/lib/utils'

// Components
const SearchBar = defineAsyncComponent(() => import('@/components/SearchBar.vue'))
const UserProfileButton = defineAsyncComponent(() => import('@/components/UserProfileButton.vue'))
const CaseInformationCard = defineAsyncComponent(
  () => import('@/components/CaseInformationCard.vue')
)

export interface Props {
  searchTerm?: string
  genomeRelease?: string
}

const props = withDefaults(defineProps<Props>(), {
  searchTerm: '',
  genomeRelease: 'grch37'
})

const router = useRouter()

const searchTermRef = ref(props.searchTerm)
const genomeReleaseRef = ref(props.genomeRelease)

/**
 * Perform a search based on the current search term and genome release.
 *
 * If a route is found for the search term then redirect to that route.
 * Otherwise log an error.
 */
const performSearch = async () => {
  const routeLocation: any = await search(searchTermRef.value, genomeReleaseRef.value)
  if (routeLocation) {
    router.push(routeLocation)
  } else {
    console.error(`no route found for ${searchTermRef.value}`)
  }
}

const updateTerms = async () => {
  searchTermRef.value = props.searchTerm
}

watch(() => props.searchTerm, updateTerms)
</script>

<template>
  <v-app-bar app class="top-bar">
    <v-toolbar-title>
      <router-link to="/">
        <img
          style="vertical-align: middle"
          src="@/assets/reev-logo.svg"
          id="logo"
          alt="logo"
          width="70"
        />
      </router-link>
    </v-toolbar-title>
    <SearchBar
      class="top-search-bar"
      v-model:search-term="searchTermRef"
      v-model:genome-release="genomeReleaseRef"
      @click-search="performSearch"
    />
    <v-spacer></v-spacer>
    <v-toolbar-items class="topbar-links">
      <v-dialog max-width="600">
        <template v-slot:activator="{ props }">
          <v-btn class="mr-4" prepend-icon="mdi-information-outline" v-bind="props">
            Show Case Information
          </v-btn>
        </template>
        <CaseInformationCard />
      </v-dialog>

      <UserProfileButton />
      <v-menu id="menu">
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>

        <v-list>
          <v-list-item to="/about" id="about">
            <v-list-item-title> About </v-list-item-title>
          </v-list-item>
          <v-list-item to="/contact" id="contact">
            <v-list-item-title> Contact </v-list-item-title>
          </v-list-item>
          <v-list-item to="/privacy" id="privacy">
            <v-list-item-title> Privacy Policy </v-list-item-title>
          </v-list-item>
          <v-list-item to="/terms" id="terms">
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
