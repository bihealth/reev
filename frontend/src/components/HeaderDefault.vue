<script setup lang="ts">
import UserProfileButton from '@/components/UserProfileButton.vue'
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
          width="50"
        />
        REEV: Explanation and Evaluation of Variants
      </router-link>
      <strong style="font-size: 130%; color: indigo">EXPERIMENTAL</strong>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="topbar-links">
      <UserProfileButton />
      <v-menu id="menu">
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>

        <v-list>
          <v-list-item to="/about" id="about">
            <v-list-item-title> About </v-list-item-title>
          </v-list-item>
          <v-list-item to="/contact" id="contact">
            <v-list-item-title> Contact </v-list-item-title>
          </v-list-item>
          <v-list-item to="/privacy" id="privacy">
            <v-list-item-title> Privacy Policy </v-list-item-title>
          </v-list-item>
          <v-list-item to="/terms" id="terms">
            <v-list-item-title> Terms of Use </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
