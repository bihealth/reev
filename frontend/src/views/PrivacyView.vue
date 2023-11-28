<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// Components
const HeaderDefault = defineAsyncComponent(() => import('@/components/HeaderDefault.vue'))
</script>

<template>
  <HeaderDefault />
  <v-container class="privacy-view">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Privacy Policy</v-card-title>
          <v-divider />
          <v-card-text>
            <p class="description">
              See
              <a href="https://www.bihealth.org/en/privacy" target="_blank">
                privacy policy of the Berlin Institute of Health
              </a>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.privacy-view {
  padding: 40px;
}

p {
  font-size: 16px;
  margin-bottom: 20px;
}
</style>
