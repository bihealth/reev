<!--
Display Admin-Only "Send Test Email" Card
-->

<script setup lang="ts">
import { ref } from 'vue'
import { UtilsClient } from '@/api/utils'

/** Stores the email address for sending test email. */
const testEmailTo = ref<string>('')

/** Send out test email via API for superusers. */
const sendTestEmail = async () => {
  const utilsClient = new UtilsClient()
  await utilsClient.sendTestEmail(testEmailTo.value)
}
</script>

<template>
  <v-card>
    <v-card-title>Send test Email</v-card-title>

    <v-card-text class="mt-3">
      <v-text-field v-model="testEmailTo" label="Email Recipient" />

      <v-btn block prepend-icon="mdi-send" class="mt-2" @click="sendTestEmail">
        Send Test Email
      </v-btn>
    </v-card-text>
  </v-card>
</template>
