<script setup lang="ts">
import { classColor } from '@/lib/utils'

interface Props {
  calculatedAcmgClass?: string
  calculatedAcmgScore?: number
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  calculatedAcmgClass: 'N/A',
  calculatedAcmgScore: 0
})

const emit = defineEmits(['resetToAuto'])
</script>

<template>
  <v-sheet rounded="lg" class="border pa-3">
    <div class="text-overline mb-2">Semi-Automated ACMG Pathogenicity Prediction</div>

    <div class="text-center text-h4 mt-6 mb-8">
      <span density="compact" :class="`px-3 py-1 rounded-xl bg-${classColor(calculatedAcmgClass)}`">
        {{ calculatedAcmgClass }}
      </span>
      with score: {{ calculatedAcmgScore }}
    </div>

    <div class="mt-3 d-flex flex-row">
      <v-btn
        color="black"
        variant="text"
        rounded="sm"
        prepend-icon="mdi-file-restore-outline"
        @click="emit('resetToAuto')"
      >
        Reset to Auto
      </v-btn>
      <v-btn
        href="/docs/acmg-cnv"
        _target="_blank"
        variant="text"
        rounded="sm"
        prepend-icon="mdi-launch"
      >
        Documentation
      </v-btn>
    </div>
  </v-sheet>
</template>
