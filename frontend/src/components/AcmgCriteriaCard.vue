<script setup lang="ts">
import { defineComponent } from 'vue'
import {
  Presence,
  type CriteriaState,
  ACMG_CRITERIA_DEFS,
  ACMG_EVIDENCE_LEVELS_PATHOGENIC,
  ACMG_EVIDENCE_LEVELS_BENIGN,
  AcmgCriteria,
  AcmgEvidenceLevel,
  StateSource
} from '@/lib/acmgSeqVar'

export interface Props {
  acmgRating: any
  criteria: AcmgCriteria
  criteriaState: CriteriaState
}

const props = withDefaults(defineProps<Props>(), {
  acmgRating: undefined,
  criteria: undefined,
  criteriaState: undefined
})

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

defineComponent({
  name: 'AcmgCriteriaCard'
})
</script>

<template>
  <v-card class="mx-auto" width="150" style="margin: 10px">
    <div class="d-flex justify-content-between">
      <v-switch
        :color="findSwitchColor()"
        :label="props.criteria"
        :model-value="props.criteriaState.presence === Presence.Present"
        @update:model-value="switchCriteria(props.criteria, props.criteriaState.presence)"
        class="switch"
      />
      <v-tooltip :text="ACMG_CRITERIA_DEFS.get(props.criteria)?.hint">
        <template v-slot:activator="{ props }">
          <v-icon style="margin: 10px" v-bind="props">mdi-information</v-icon>
        </template>
      </v-tooltip>
    </div>
    <v-select
      :model-value="props.criteriaState.evidenceLevel"
      @update:model-value="props.acmgRating.setEvidenceLevel(StateSource.User, criteria, $event)"
      :items="
        ACMG_EVIDENCE_LEVELS_PATHOGENIC.includes(props.criteriaState.evidenceLevel)
          ? ACMG_EVIDENCE_LEVELS_PATHOGENIC
          : ACMG_EVIDENCE_LEVELS_BENIGN
      "
      hide-details="auto"
      class="select"
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
</style>
