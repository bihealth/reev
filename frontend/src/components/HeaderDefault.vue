<template>
  <v-app-bar app class="top-bar">
    <v-toolbar-title>
      <router-link to="/">
        <img src="@/assets/reev-logo.png" id="logo" alt="logo" width="100" />
        Explanation and Evaluation of Variants
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="topbar-links">
      <v-btn to="/about"> About </v-btn>
      <v-btn to="/contact"> Contact </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>
