<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGeneInfoStore } from '@/stores/geneInfo'

import SearchBar from '@/components/SearchBar.vue'
import { search } from '@/api/utils'

const router = useRouter()

const geneInfoStore = useGeneInfoStore()

const searchTerm = ref('')
const genomeRelease = ref('grch37')

const performSearch = async () => {
  const routeLocation: any = search(searchTerm.value)
  console.log(routeLocation)
  if (routeLocation) {
    router.push(routeLocation)
  } else {
    console.error('no route found for {searchTerm.value}')
  }
}

// Load props search term and genome release from local storage on mount
onMounted(() => {
  searchTerm.value = localStorage.getItem('searchTerm') || ''
  genomeRelease.value = localStorage.getItem('genomeRelease') || 'grch37'

  if (geneInfoStore.geneInfo === null) {
    router.push({ name: 'home' })
  }
})
</script>

<template>
  <v-app-bar app class="top-bar">
    <v-toolbar-title>
      <router-link to="/">
        <img src="@/assets/reev-logo.svg" id="logo" alt="logo" width="100" />
      </router-link>
    </v-toolbar-title>
    <SearchBar
      class="top-search-bar"
      v-model:search-term="searchTerm"
      v-model:genome-release="genomeRelease"
      @click-search="performSearch"
    />
    <v-spacer></v-spacer>
    <v-toolbar-items class="topbar-links">
      <v-btn id="about" to="/about"> About </v-btn>
      <v-btn id="contact" to="/contact"> Contact </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<style scoped>
.top-bar {
  background-color: white;
  border-bottom: 2px solid rgb(111, 100, 210);
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
}
</style>
