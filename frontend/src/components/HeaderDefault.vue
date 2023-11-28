<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const CaseInformationCard = defineAsyncComponent(
  () => import('@/components/CaseInformationCard.vue')
)
const UserProfileButton = defineAsyncComponent(() => import('@/components/UserProfileButton.vue'))
</script>

<template>
  <v-app-bar app class="top-bar">
    <v-toolbar-title>
      <router-link to="/">
        <img
          id="logo"
          style="vertical-align: middle"
          src="@/assets/reev-logo.svg"
          alt="logo"
          width="70"
        />
      </router-link>
      <router-link to="/"> REEV Explains and Evaluates Variants </router-link>
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items class="topbar-links">
      <v-dialog scrollable width="auto" location="top">
        <template #activator="{ props }">
          <v-btn class="mr-4" prepend-icon="mdi-information-outline" v-bind="props">
            Show Case Information
          </v-btn>
        </template>
        <v-card>
          <CaseInformationCard />
        </v-card>
      </v-dialog>

      <UserProfileButton />
      <v-menu id="menu">
        <template #activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props" />
        </template>

        <v-list>
          <v-list-item id="about" to="/about">
            <v-list-item-title> About </v-list-item-title>
          </v-list-item>
          <v-list-item id="contact" to="/contact">
            <v-list-item-title> Contact </v-list-item-title>
          </v-list-item>
          <v-list-item id="privacy" to="/privacy">
            <v-list-item-title> Privacy Policy </v-list-item-title>
          </v-list-item>
          <v-list-item id="terms" to="/terms">
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
  border-bottom: 2px solid #455a64;
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
