<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// Components
const PageHeader = defineAsyncComponent(() => import('@/components/PageHeader.vue'))
</script>

<template>
  <PageHeader />
  <v-container class="contact-view">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Contact Us</v-card-title>
          <v-divider />
          <v-card-text>
            <p class="description">
              We'd love to hear from you! Feel free to reach out to us through any of the following
              channels:
            </p>
            <div class="contact-links">
              <v-btn
                href="https://github.com/bihealth/reev/discussions"
                target="_blank"
                class="button"
              >
                <v-icon left> mdi-github </v-icon>
                GitHub
              </v-btn>
              <v-btn href="mailto:cubi-helpdesk@bih-charite.de" class="button">
                <v-icon left> mdi-email </v-icon>
                Email
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.contact-view {
  padding: 40px;
}

.description {
  font-size: 16px;
  margin-bottom: 20px;
}

.contact-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 20px;
}

.button {
  margin-bottom: 10px;
}
</style>
