<template>
  <v-app>
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

    <v-main>
      <router-view />
    </v-main>

    <v-footer app class="footer">
      <!-- Content of the footer -->
    </v-footer>
  </v-app>
</template>

<script lang="ts">
export default {
  name: 'App'
}
</script>

<style>
.top-bar {
  background-color: rgb(22, 132, 144);
  color: white;
}

.footer {
  background-color: rgb(22, 132, 144);
  color: white;
  padding: 20px;
}

.topbar-links {
  display: flex;
}

.topbar-links v-btn {
  margin: 0 10px;
  color: white;
}

#logo {
  margin-left: 25px;
  margin-right: 10px;
  margin-top: 10px;
}
</style>
