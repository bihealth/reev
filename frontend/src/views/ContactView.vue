<script setup lang="ts">
import Header from '@/components/Header.vue'
</script>

<template>
  <Header />
  <v-container class="contact-view">
    <v-row>
      <v-col cols="12">
        <h2 class="title">Contact Us</h2>
        <p class="description">
          We'd love to hear from you! Feel free to reach out to us through any of the following
          channels:
        </p>
        <div class="contact-links">
          <v-btn href="https://github.com/bihealth" target="_blank">
            <v-icon left>mdi-github</v-icon>
            GitHub
          </v-btn>
          <v-btn href="mailto:random.mail@adress.com" target="_blank">
            <v-icon left>mdi-email</v-icon>
            Email
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.contact-view {
  padding: 40px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
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

.v-btn {
  margin-bottom: 10px;
}
</style>
