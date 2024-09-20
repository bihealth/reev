<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'

import { classColor } from '@/lib/utils'

interface Props {
  calculatedAcmgClass?: string
  autoacmgAvailable?: boolean
  interVarAvailable?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  calculatedAcmgClass: 'N/A',
  interVarAvailable: false,
  autoacmgAvailable: false
})

const theme = useTheme()

const emit = defineEmits(['clearAll', 'resetToAutoacmg', 'resetToInterVar'])

/** Return font color for genome build based on current theme. */
const fontColor = computed(() => {
  return theme.global.current.value.dark ? 'white' : 'black'
})
</script>

<template>
  <v-sheet rounded="lg" class="border pa-3">
    <div class="text-overline mb-2">Semi-Automated ACMG Pathogenicity Prediction</div>

    <div class="text-center text-h4 mt-6 mb-8">
      <span density="compact" :class="`px-3 py-1 rounded-xl bg-${classColor(calculatedAcmgClass)}`">
        {{ calculatedAcmgClass }}
      </span>
    </div>

    <div class="mt-3 d-flex flex-row">
      <v-btn
        :color="fontColor"
        variant="text"
        rounded="sm"
        prepend-icon="mdi-file-outline"
        @click="emit('clearAll')"
      >
        Clear
      </v-btn>
      <v-btn
        :color="fontColor"
        variant="text"
        rounded="sm"
        prepend-icon="mdi-file-restore-outline"
        :disabled="!autoacmgAvailable"
        @click="emit('resetToAutoacmg')"
      >
        Reset to AutoACMG
      </v-btn>
      <v-btn
        :color="fontColor"
        variant="text"
        rounded="sm"
        prepend-icon="mdi-file-restore-outline"
        :disabled="!interVarAvailable"
        @click="emit('resetToInterVar')"
      >
        Reset to InterVar
      </v-btn>
      <v-btn
        href="/docs/acmg-docs"
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
