<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue'
import { search } from '@/api/utils'
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
const performSearch = async () => {
  const routeLocation: any = search(searchTermRef.value, genomeReleaseRef.value)
  if (routeLocation) {
    router.push(routeLocation)
  } else {
    console.error(`no route found for ${searchTermRef.value}`)
  }
}
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
      v-model:search-term="searchTermRef"
      v-model:genome-release="genomeReleaseRef"
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
