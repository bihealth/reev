<script setup lang="ts">
import { ref } from 'vue'

/** The component for the Acmg Criteria Card. */
import {
  ACMG_CRITERIA_DEFS,
  AcmgCriteria,
  AcmgEvidenceLevel,
  type CriteriaState,
  Presence,
  StateSource
} from '@/lib/acmgSeqvar'

interface Props {
  /** The acmg rating. */
  acmgRating: any
  /** The acmg criteria. */
  criteria: AcmgCriteria
  /** The acmg criteria state. */
  criteriaState: CriteriaState
}

const props = withDefaults(defineProps<Props>(), {
  acmgRating: undefined,
  criteria: undefined,
  criteriaState: undefined
})

const showSummary = ref(false)

const toggleSummary = () => {
  showSummary.value = !showSummary.value
}

const findSwitchColor = (): string => {
  const evidence = props.criteriaState.evidenceLevel
  if (evidence === AcmgEvidenceLevel.PathogenicVeryStrong) {
    return 'red-accent-4'
  } else if (evidence === AcmgEvidenceLevel.PathogenicStrong) {
    return 'orange-darken-4'
  } else if (evidence === AcmgEvidenceLevel.PathogenicModerate) {
    return 'amber-darken-4'
  } else if (evidence === AcmgEvidenceLevel.PathogenicSupporting) {
    return 'yellow-darken-3'
  } else if (evidence === AcmgEvidenceLevel.BenignStandalone) {
    return 'green-darken-4'
  } else if (evidence === AcmgEvidenceLevel.BenignStrong) {
    return 'light-green'
  } else if (evidence === AcmgEvidenceLevel.BenignSupporting) {
    return 'lime'
  } else {
    return 'primary'
  }
}

const switchCriteria = (criteria: AcmgCriteria, presence: Presence) => {
  if (presence === Presence.Present) {
    props.acmgRating.setPresence(StateSource.User, criteria, Presence.Absent)
  } else {
    props.acmgRating.setPresence(StateSource.User, criteria, Presence.Present)
  }
}
</script>

<template>
  <v-card class="mx-auto compact-form" width="180" style="margin: 10px">
    <div class="d-flex justify-content-between">
      <v-switch
        :color="findSwitchColor()"
        :label="props.criteria"
        :model-value="props.criteriaState.presence === Presence.Present"
        hide-details="auto"
        density="compact"
        class="switch"
        @update:model-value="switchCriteria(props.criteria, props.criteriaState.presence)"
      />
      <v-tooltip :text="ACMG_CRITERIA_DEFS.get(props.criteria)!.hint">
        <template #activator="{ props: vProps }">
          <v-icon style="margin: 10px" v-bind="vProps"> mdi-information </v-icon>
        </template>
      </v-tooltip>
      <v-menu v-if="props.criteriaState.summary" offset-y>
        <template #activator="{ props: vProps }">
          <v-btn icon variant="plain" v-bind="vProps" size="small" @click="toggleSummary">
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-card width="500">
          <v-card-text>
            {{ props.criteriaState.summary }}
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
    <v-select
      :model-value="props.criteriaState.evidenceLevel"
      :items="ACMG_CRITERIA_DEFS.get(props.criteria)!.evidenceLevels"
      hide-details="auto"
      density="compact"
      class="select"
      @update:model-value="props.acmgRating.setEvidenceLevel(StateSource.User, criteria, $event)"
    />
  </v-card>
</template>

<style scoped>
.switch {
  margin-left: 10px;
  padding: 0px;
}
.select {
  margin: 0px;
}

.compact-form {
  transform: scale(0.9);
  transform-origin: left;
}
</style>
