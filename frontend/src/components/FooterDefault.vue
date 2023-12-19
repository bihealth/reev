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
      Developed by BIH CUBI. For support and feedback, please contact
      <a href="mailto:cubi-helpdesk@bih-charite.de">cubi-helpdesk@bih-charite.de</a>. REEV Explains
      and Evaluates Variants {{ miscStore?.appVersion }}.
      <router-link to="/info#terms-of-use">
        Terms of use
        <small> <v-icon>mdi-arrow-right-circle-outline</v-icon> </small> </router-link
      >.
    </small>
  </v-footer>
</template>
