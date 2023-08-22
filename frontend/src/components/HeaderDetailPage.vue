<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGeneDataStore } from '@/stores/geneData'

// const props = defineProps<{
//   case?: any
//   smallVar?: any
// }>()

const router = useRouter()
const geneDataStore = useGeneDataStore()

if (geneDataStore.geneData === null) {
  router.push({ name: 'home' })
} else {
  // const { geneSymbol } = geneDataStore.geneData
}
</script>

<template>
  <v-app-bar app class="top-bar">
    <v-toolbar-title>
      <router-link to="/">
        <img src="@/assets/reev-logo.png" id="logo" alt="logo" width="100" />
      </router-link>
    </v-toolbar-title>
    <!-- Representation of searched prompt in square -->
    <v-text-field label="{geneSymbol}" class="gene-input"></v-text-field>
    <v-spacer></v-spacer>
    <v-toolbar-items class="topbar-links">
      <v-btn to="/about"> About </v-btn>
      <v-btn to="/contact"> Contact </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>
