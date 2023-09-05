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
  <v-app-bar app class="top-bar">
    <v-toolbar-title>
      <router-link to="/">
        <img
          style="vertical-align: middle"
          src="@/assets/reev-logo.svg"
          id="logo"
          alt="logo"
          width="70"
        />
        REEV: Explanation and Evaluation of Variants
      </router-link>
      <strong style="font-size: 130%; color: indigo">EXPERIMENTAL</strong>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="topbar-links">
      <v-btn id="about" to="/about"> About </v-btn>
      <v-btn id="contact" to="/contact"> Contact </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<style scoped>
.top-bar {
  background-color: white;
  border-bottom: 2px solid rgb(229, 85, 64);
}

.topbar-links {
  display: flex;
  margin: 0 10px;
}

#logo {
  margin-left: 25px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
