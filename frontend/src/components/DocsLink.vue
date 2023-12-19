<script setup lang="ts">
interface Props {
  anchor: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<Props>()
</script>

<template>
  <a
    class="d-block text-body-2 float-right text-primary"
    :href="`https://reev.readthedocs.io/en/latest/doc_manual.html#${anchor}`"
    target="_blank"
  >
    <v-icon>mdi-help-circle-outline</v-icon>
  </a>
</template>
