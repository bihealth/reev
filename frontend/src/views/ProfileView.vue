<script setup lang="ts">
import { useRouter } from 'vue-router'

import { AuthClient } from '@/api/auth'
import HeaderDefault from '@/components/HeaderDefault.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
userStore.initialize()

const router = useRouter()

const logout = async () => {
  const authClient = new AuthClient()
  await authClient.logout()

  userStore.loadCurrentUser()

  router.push('/')
}
</script>

<template>
  <HeaderDefault />
  <v-container fill-height fluid>
    <v-row class="align-center fill-height" justify="center">
      <v-card
        class="mx-auto pa-4 pb-8 mt-12"
        elevation="8"
        min-width="400"
        max-width="448"
        rounded="lg"
        v-if="userStore.currentUser"
      >
        <v-card-item>
          <v-card-title>User Profile</v-card-title>

          <v-card-subtitle> You are currently logged in... </v-card-subtitle>
        </v-card-item>

        <v-card-text>
          <v-form class="mt-3">
            <v-text-field v-model="userStore.currentUser.email" label="Email" readonly />
            <v-checkbox
              label="is superuser"
              readonly
              v-model="userStore.currentUser.is_superuser"
              v-if="userStore.currentUser.is_superuser"
            />
            <v-checkbox
              label="verified email"
              readonly
              v-model="userStore.currentUser.is_verified"
            />
            <v-checkbox label="active user" readonly v-model="userStore.currentUser.is_active" />
          </v-form>

          <v-row class="pt-6" justify="center">
            <v-btn prepend-icon="mdi-key-variant" id="login" @click="logout"> Logout </v-btn>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card
        class="mx-auto pa-4 pb-8 mt-12"
        elevation="8"
        min-width="400"
        max-width="448"
        rounded="lg"
        v-else
      >
        <v-card-item>
          <v-card-title>User Profile</v-card-title>

          <v-card-subtitle>You are not logged in</v-card-subtitle>
        </v-card-item>

        <v-card-text>
          <v-row class="pt-6" justify="center">
            <v-btn prepend-icon="mdi-key-variant" id="login" color="success" to="/login">
              Login
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>
