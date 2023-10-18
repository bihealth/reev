<script setup lang="ts">
import HeaderDefault from '@/components/HeaderDefault.vue'
</script>

<template>
  <HeaderDefault />
  <v-container class="privacy-view">
    <v-row>
      <v-col cols="12">
        <h2 class="title">Privacy Policy</h2>
        <p class="description">
          See
          <a href="https://www.bihealth.org/en/privacy" target="_blank">
            privacy policy of the Berlin Institute of Health
          </a>
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.privacy-view {
  padding: 40px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  margin-bottom: 20px;
}
</style>
