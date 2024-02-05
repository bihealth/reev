<script setup lang="ts">
import { defineComponent } from 'vue'

defineComponent({
  name: 'PathNotFound'
})
</script>

<template>
  <v-card class="not-found">
    <v-card-title>404 - Page Not Found</v-card-title>
    <v-card-text>
      <p>Oops! The page you are looking for does not exist.</p>
      <router-link to="/"> Go back to the home page </router-link>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 100px;
  font-size: 24px;
}
</style>
