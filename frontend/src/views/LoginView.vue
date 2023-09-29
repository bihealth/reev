<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { AuthClient } from '@/api/auth'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
userStore.initialize()

const failure = ref<boolean>(false)
const message = ref<string>('')

const visible = ref<boolean>(false)
const username = ref<string>('')
const password = ref<string>('')

const router = useRouter()

const handleLogin = async () => {
  const authClient = new AuthClient()
  const success = await authClient.login(username.value, password.value)
  if (success) {
    message.value = 'Login successful, redirecting....'
    userStore.loadCurrentUser()
    router.push('/')
  } else {
    message.value = 'Login failed, please try again.'
  }
  failure.value = !success
}
</script>

<template>
  <v-container fill-height fluid>
    <v-row class="align-center fill-height" justify="center">
      <v-card class="mx-auto pa-12 pb-8 mt-12" elevation="8" max-width="448" rounded="lg">
        <div class="mb-8">
          <img
            style="vertical-align: middle"
            src="@/assets/reev-logo.svg"
            id="logo"
            alt="logo"
            width="70"
          />
          REEV Explains and Evaluates Variants
        </div>

        <v-card
          class="mb-5 mt-5"
          :color="failure ? 'error' : 'success'"
          variant="tonal"
          v-if="message.length"
        >
          <v-card-text class="text-medium-emphasis text-caption">
            {{ message }}
          </v-card-text>
        </v-card>

        <div class="text-subtitle-1 text-medium-emphasis">Account</div>

        <v-text-field
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          v-model="username"
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password
        </div>

        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          v-model="password"
        ></v-text-field>

        <v-card class="mb-12" color="surface-variant" variant="tonal">
          <v-card-text class="text-medium-emphasis text-caption">
            We only create local accounts for in special cases. Most likely, you will need to login
            using OrcID above.
          </v-card-text>
        </v-card>

        <v-row>
          <v-col cols="5">
            <v-btn
              block
              prepend-icon="mdi-arrow-left"
              size="large"
              variant="tonal"
              color="gray"
              to="/"
            >
              Back
            </v-btn>
          </v-col>
          <v-col cols="7">
            <v-btn block color="blue" size="large" variant="tonal" @click="handleLogin()">
              Log In
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-row>
  </v-container>
</template>
