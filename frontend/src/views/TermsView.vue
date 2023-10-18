<script setup lang="ts">
import HeaderDefault from '@/components/HeaderDefault.vue'
</script>

<template>
  <HeaderDefault />
  <v-container class="terms-view">
    <v-row>
      <v-col cols="12">
        <h2 class="title">Terms of Use</h2>
        <p class="description">REEV is for research use only software</p>
        <p class="description">
          The software is provided "as is," without warranty of any kind, express or implied,
          including but not limited to the warranties of merchantability, fitness for a particular
          purpose, and noninfringement. In no event shall the authors or copyright holders be liable
          for any claim, damages, or other liability, whether in an action of contract, tort, or
          otherwise, arising from, out of, or in connection with the software or the use or other
          dealings in the software.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.terms-view {
  padding: 40px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  margin-bottom: 20px;
}
</style>
