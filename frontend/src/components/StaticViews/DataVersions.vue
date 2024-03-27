<script setup lang="ts">
import { onMounted } from 'vue'
import { useMiscStore } from '@/stores/misc'

const miscStore = useMiscStore()

onMounted(() => {
  miscStore.initialize()
})
</script>

<template>
  <v-card>
    <v-card-title>Data Versions</v-card-title>
    <v-divider />
    <v-card-text>
      <div class="text-h6">Data Versions</div>
      <v-divider />
      <div v-if="miscStore.dataVersions.length > 0">
        <v-for :key="version in miscStore.dataVersions">
          <div class="text-h6">{{ version.name }}</div>
          <v-divider />
          <div>{{ version.description }}</div>
          <v-divider />
        </v-for>
      </div>
    </v-card-text>
  </v-card>
</template>
