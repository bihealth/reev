<script setup lang="ts">
import { defineComponent } from 'vue'

defineComponent({
  name: 'PathNotFound'
})
</script>

<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>Oops! The page you are looking for does not exist.</p>
    <router-link to="/">Go back to the home page</router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 100px;
  font-size: 24px;
}
</style>
