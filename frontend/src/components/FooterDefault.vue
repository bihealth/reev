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
    <small>
      Developed by BIH CUBI. For support and feedback, please contact cubi-helpdesk@bihealth.de.
      REEV: Explanation and Evaluation of Variants {{ miscStore?.appVersion }}
    </small>
  </v-footer>
</template>
