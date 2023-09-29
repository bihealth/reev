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
  <template v-if="!userStore.currentUser">
    <v-btn prepend-icon="mdi-key-variant" id="login" to="/login"> Login </v-btn>
  </template>
  <template v-else>
    <v-btn
      prepend-icon="mdi-account"
      id="profile"
      to="/profile"
      variant="flat"
      :color="userStore.currentUser?.is_superuser ? 'red-darken-4' : ''"
    >
      Profile
    </v-btn>
  </template>
</template>
