<script setup lang="ts">
/**
 * Display login link or user profile button depending on whether the user is logged in.
 */
import { onMounted } from 'vue'

import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  userStore.initialize()
})
</script>

<template>
  <template v-if="!userStore.isAuthenticated">
    <v-btn id="login" prepend-icon="mdi-key-variant" to="/login">
      <span class="d-none d-sm-inline"> Login </span>
    </v-btn>
  </template>
  <template v-else>
    <v-btn
      id="profile"
      prepend-icon="mdi-account"
      to="/profile"
      variant="flat"
      :color="userStore.currentUser?.is_superuser ? 'red-darken-4' : ''"
    >
      <span class="d-none d-sm-inline"> Profile </span>
    </v-btn>
  </template>
</template>
