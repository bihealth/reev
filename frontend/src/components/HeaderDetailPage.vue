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

/** Genome release string values. */
type GenomeRelease = 'grch37' | 'grch38'

export interface Props {
  searchTerm?: string
  genomeRelease?: GenomeRelease
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
          id="logo"
          style="vertical-align: middle"
          src="@/assets/reev-logo.svg"
          alt="logo"
          width="70"
        />
      </router-link>
    </v-toolbar-title>
    <SearchBar
      v-model:search-term="searchTermRef"
      v-model:genome-release="genomeReleaseRef"
      class="top-search-bar"
      density="compact"
      @click-search="performSearch"
    />
    <v-spacer></v-spacer>
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
