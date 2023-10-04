<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import SearchBar from '@/components/SearchBar.vue'
import UserProfileButton from '@/components/UserProfileButton.vue'
import { search } from '@/lib/utils'

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
      <v-btn id="about" to="/about"> About </v-btn>
      <v-btn id="contact" to="/contact"> Contact </v-btn>
      <UserProfileButton />
    </v-toolbar-items>
  </v-app-bar>
</template>

<style scoped>
.top-bar {
  background-color: white;
  border-bottom: 2px solid rgb(229, 85, 64);
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
