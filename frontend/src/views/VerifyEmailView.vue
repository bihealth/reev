<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { AuthClient } from '@/api/auth'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const isVerifying = ref<boolean>(false)

const route = useRoute()
const router = useRouter()

const sendVerifyPost = async () => {
  const token = route.query.token

  isVerifying.value = true
  const authClient = new AuthClient()
  await authClient.sendVerifyRequest(`${token}`)
  await userStore.loadCurrentUser()

  router.push('/')
}

onMounted(() => {
  sendVerifyPost()
})
</script>

<template>
  <PageHeader />
  <v-container fill-height fluid>
    <v-row v-if="isVerifying" class="align-center fill-height" justify="center">
      <v-progress-circular indeterminate size="64" />
    </v-row>
    <v-row v-else>
      <div>Waiting for page load...</div>
    </v-row>
  </v-container>
</template>
