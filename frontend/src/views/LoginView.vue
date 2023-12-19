<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

import { AuthClient, type OAuth2Provider } from '@/api/auth'
import { useUserStore } from '@/stores/user'

/** The global theme. */
const theme = useTheme()

const userStore = useUserStore()
userStore.initialize()

const failure = ref<boolean>(false)
const message = ref<string>('')

const showLoginForm = ref<boolean>(userStore.oauth2Providers.length === 0)

const visible = ref<boolean>(false)
const username = ref<string>('')
const password = ref<string>('')

const router = useRouter()

const handleProviderLogin = async (provider: OAuth2Provider) => {
  const redirectTo = new URLSearchParams(window.location.search).get('redirectTo')

  const authClient = new AuthClient()
  const redirectUrl = await authClient.fetchOAuth2LoginUrl(provider, redirectTo)
  message.value = 'Redirecting to external provider....'
  failure.value = false
  window.location.href = redirectUrl
}

const handlePasswordLogin = async () => {
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

const goToProfileIfAuthenticated = async () => {
  if (userStore.isAuthenticated) {
    router.push('/profile')
  }
}

/** Return backgorund color for v-main based on current theme. */
const mainBackgroundColor = computed(() => {
  return theme.global.current.value.dark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3'
})

watch(
  () => userStore.isAuthenticated,
  () => goToProfileIfAuthenticated()
)

onMounted(async () => {
  goToProfileIfAuthenticated()
})
</script>

<template>
  <v-main :class="mainBackgroundColor">
    <v-container fill-height fluid>
      <v-row class="align-center fill-height" justify="center">
        <v-card
          class="mx-auto pa-12 pb-8 mt-12"
          elevation="8"
          max-width="600"
          @dblclick="showLoginForm = !showLoginForm"
        >
          <div class="mb-8">
            <img
              id="logo"
              style="vertical-align: middle"
              src="@/assets/reev-logo.svg"
              alt="logo"
              width="70"
            />
            REEV Explains and Evaluates Variants
          </div>

          <v-card
            v-if="message.length"
            class="mb-5 mt-5"
            :color="failure ? 'error' : 'success'"
            variant="tonal"
          >
            <v-card-text class="text-medium-emphasis text-caption">
              {{ message }}
            </v-card-text>
          </v-card>

          <v-sheet class="mb-5 mt-5 pa-3 bg-grey-lighten-2">
            By logging in, you agree to our
            <router-link to="/info#terms-of-use">
              terms of use
              <small> <v-icon>mdi-arrow-right-circle-outline</v-icon> </small> </router-link
            >.
          </v-sheet>

          <v-card v-if="userStore.oauth2Providers.length > 0" class="mb-5 mt-5" variant="tonal">
            <v-card-title> Login with... </v-card-title>
            <v-card-text class="text-medium-emphasis text-caption mt-3">
              <template v-for="provider in userStore.oauth2Providers" :key="provider.name">
                <v-hover
                  v-if="provider.name.startsWith('lifescience_ri')"
                  v-slot="{ isHovering, props }"
                >
                  <v-card
                    block
                    rounded="xs"
                    size="large"
                    class="text-center mb-6"
                    :variant="isHovering ? 'flat' : 'tonal'"
                    :class="{ 'on-hover': isHovering }"
                    v-bind="props"
                    @click="handleProviderLogin(provider)"
                  >
                    <v-card-title class="mt-3"> LifeSciene Research Infrastructure </v-card-title>
                    <v-card-text>
                      <div class="mb-3">
                        Members of European Union Academia can login with their organizational
                        account...
                      </div>
                      <div>
                        <img
                          style="vertical-align: middle; width: 150px"
                          src="@/assets/lifescience-ri-login.svg"
                        />
                      </div>
                    </v-card-text>
                  </v-card>
                </v-hover>
                <v-hover
                  v-else-if="provider.name.startsWith('orcid')"
                  v-slot="{ isHovering, props }"
                >
                  <v-card
                    block
                    rounded="xs"
                    size="large"
                    class="text-center mb-6"
                    :variant="isHovering ? 'flat' : 'tonal'"
                    :class="{ 'on-hover': isHovering }"
                    v-bind="props"
                    @click="handleProviderLogin(provider)"
                  >
                    <v-card-title class="mt-3"> OrcID </v-card-title>
                    <v-card-text>
                      <div class="mb-3">Sign in with your OrcID account...</div>
                      <div>
                        <img style="vertical-align: middle; width: 50px" src="@/assets/orcid.svg" />
                      </div>
                    </v-card-text>
                  </v-card>
                </v-hover>
                <v-btn
                  v-else
                  block
                  size="large"
                  variant="tonal"
                  color="green"
                  class="mb-3"
                  @click="handleProviderLogin(provider)"
                >
                  Login With {{ provider.label }}
                </v-btn>
              </template>
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
            </v-card-text>
          </v-card>

          <div v-if="showLoginForm">
            <div class="text-subtitle-1 text-medium-emphasis">Account</div>

            <v-text-field
              id="email"
              v-model="username"
              density="compact"
              placeholder="Email address"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
            />

            <div
              class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
            >
              Password
            </div>

            <v-text-field
              id="password"
              v-model="password"
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              density="compact"
              placeholder="Enter your password"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              @click:append-inner="visible = !visible"
            />

            <v-card class="mb-12" color="surface-variant" variant="tonal">
              <v-card-text class="text-medium-emphasis text-caption">
                We only create local accounts for in special cases. Most likely, you will need to
                login using OrcID above.
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
                <v-btn
                  block
                  color="blue"
                  size="large"
                  variant="tonal"
                  @click="handlePasswordLogin()"
                >
                  Log In
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-row>
    </v-container>
  </v-main>
</template>
