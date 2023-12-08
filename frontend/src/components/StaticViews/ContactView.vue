<template>
  <v-card>
    <v-card-title>Contact Us</v-card-title>
    <v-divider />
    <v-card-text>
      <p>
        We'd love to hear from you! Feel free to reach out to us through any of the following
        channels:
      </p>
      <div class="contact-links mt-4">
        <v-btn href="https://github.com/bihealth/reev/discussions" target="_blank" class="button">
          <v-icon left> mdi-github </v-icon>
          GitHub
        </v-btn>
        <v-btn href="mailto:cubi-helpdesk@bih-charite.de" class="mt-2">
          <v-icon left> mdi-email </v-icon>
          Email
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.contact-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
