<template>
  <main>
    <!-- Search Bar -->
    <div class="search-container">
      <v-card class="search-card">
        <v-card-title>Search</v-card-title>
        <v-card-text>
          <v-text-field v-model="searchQuery" label="Enter your search query"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="performSearch">Search</v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <!-- Examples -->
    <div class="examples-container">
      <v-card>
        <v-card-title>Examples</v-card-title>
        <v-card-text>
          <v-btn @click="searchQuery = 'BRCA1'">Search for BRCA1</v-btn>
          <v-btn @click="searchQuery = 'CHROM:POS:REF:ALT'">Search for CHROM:POS:REF:ALT</v-btn>
        </v-card-text>
      </v-card>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

const performSearch = () => {
  // Implement your search logic here using the searchQuery value
  console.log(`Performing search for: ${searchQuery.value}`)
}
</script>

<style scoped>
/* ... (existing styles) ... */

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  padding: 2rem;
}

.search-card {
  max-width: 400px;
  width: 100%;
}

.examples-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}
</style>
