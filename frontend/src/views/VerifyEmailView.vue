<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

import { AuthClient } from '@/api/auth'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const isVerifying = ref<boolean>(false)

const route = useRoute()
const router = useRouter()

/** The global theme. */
const theme = useTheme()

const sendVerifyPost = async () => {
  const token = route.query.token

  isVerifying.value = true
  const authClient = new AuthClient()
  await authClient.sendVerifyRequest(`${token}`)
  await userStore.loadCurrentUser()

  router.push('/')
}

/** Return backgorund color for v-main based on current theme. */
const mainBackgroundColor = computed(() => {
  return theme.global.current.value.dark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3'
})

onMounted(() => {
  sendVerifyPost()
})
</script>

<template>
  <PageHeader />
  <v-main :class="mainBackgroundColor">
    <v-container fill-height fluid>
      <v-row v-if="isVerifying" class="align-center fill-height" justify="center">
        <v-progress-circular indeterminate size="64" />
      </v-row>
      <v-row v-else>
        <div>Waiting for page load...</div>
      </v-row>
    </v-container>
  </v-main>
</template>
