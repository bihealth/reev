<template>
  <v-container class="contact-view">
    <v-row>
      <v-col cols="12">
        <h2 class="title">Contact Us</h2>
        <p class="description">
          We'd love to hear from you! Feel free to reach out to us through any of the following
          channels:
        </p>
        <div class="contact-links">
          <v-btn text icon href="https://twitter.com/your_twitter_handle">
            <v-icon left>mdi-twitter</v-icon>
            Twitter
          </v-btn>
          <v-btn text icon href="https://github.com/your_github_username">
            <v-icon left>mdi-github</v-icon>
            GitHub
          </v-btn>
          <v-btn text icon @click="sendEmail">
            <v-icon left>mdi-email</v-icon>
            Email
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'ContactView',
  methods: {
    sendEmail() {
      window.location.href = 'mailto:your@email.com'
    }
  }
}
</script>

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
