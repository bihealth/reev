<template>
  <v-app-bar app class="top-bar">
    <v-toolbar-title>
      <router-link to="/">
        <img src="@/assets/reev-logo.svg" id="logo" class="nav" alt="logo" width="100" />
      </router-link>
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
  border-bottom: 2px solid rgb(111, 100, 210);
}

.topbar-links {
  display: flex;
  margin: 0 10px;
}

#logo {
  margin-left: 25px;
  margin-right: 10px;
  margin-top: 10px;
}
</style>
