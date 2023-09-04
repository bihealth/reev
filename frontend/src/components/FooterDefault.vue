<script setup lang="ts">
import { onMounted } from 'vue'
import { useMiscStore } from '@/stores/misc'

const miscStore = useMiscStore()

onMounted(() => {
  if (miscStore?.initialize) {
    miscStore?.initialize()
  }
})
</script>

<template>
  <v-footer app>
    {{ miscStore?.appVersion }}
  </v-footer>
</template>
