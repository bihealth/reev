<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useMiscStore } from '@/stores/misc'

const miscStore = useMiscStore()

/** Data version to display. */
const transformedDataVersions = ref<{ name: string; version: string }[]>([])

/** Define table headers */
const headers = ref([
  { text: 'Resource', value: 'name' },
  { text: 'Version', value: 'version' }
])

const initializeDataVersions = async () => {
  await miscStore.initialize()
  if (!miscStore.dataVersions) {
    transformedDataVersions.value = []
    return
  } else {
    const transformDataVersions = () => {
      return Object.entries(miscStore.dataVersions).map(([name, version]) => ({
        name,
        version: version ? String(version) : ''
      }))
    }

    transformedDataVersions.value = transformDataVersions()
  }
}

onMounted(initializeDataVersions)
</script>

<template>
  <v-card>
    <v-card-title>Data Sources</v-card-title>
    <v-card-subtitle>
      The following data sources and service versions are used in REEV application.
    </v-card-subtitle>
    <v-card-text>
      <div v-if="transformedDataVersions && transformedDataVersions.length > 0"></div>
      <v-table>
        <thead>
          <tr>
            <!-- Table Headers -->
            <th v-for="header in headers" :key="header.value">
              {{ header.text }}
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Table Rows -->
          <tr v-for="(item, index) in transformedDataVersions" :key="index">
            <td>{{ item.name }}</td>
            <td>{{ item.version }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
