<script setup lang="ts">
const rawAppVersion = __APP_VERSION__;
const arr = rawAppVersion.split("@");
const appVersion = arr[arr.length - 1];
</script>

<template>
  <v-footer app>
    <small>
      Developed by BIH CUBI. For support and feedback, please contact
      <a href="mailto:cubi-helpdesk@bih-charite.de">cubi-helpdesk@bih-charite.de</a>. REEV Explains
      and Evaluates Variants {{ appVersion }}.
      <router-link to="/info#terms-of-use">
        Terms of use
        <small> <v-icon>mdi-arrow-right-circle-outline</v-icon> </small> </router-link
      >.
    </small>
  </v-footer>
</template>
