<script setup lang="ts">
/** The component for the Acmg Criteria Card. */
import {
  ACMG_CRITERIA_DEFS,
  ACMG_EVIDENCE_LEVELS_BENIGN,
  ACMG_EVIDENCE_LEVELS_PATHOGENIC,
  AcmgCriteria,
  AcmgEvidenceLevel,
  type CriteriaState,
  Presence,
  StateSource
} from '@/lib/acmgSeqVar'

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
  <v-card class="mx-auto compact-form" width="150" style="margin: 10px">
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
      <v-tooltip :text="ACMG_CRITERIA_DEFS.get(props.criteria)?.hint">
        <template #activator="{ props: vProps }">
          <v-icon style="margin: 10px" v-bind="vProps"> mdi-information </v-icon>
        </template>
      </v-tooltip>
    </div>
    <v-select
      :model-value="props.criteriaState.evidenceLevel"
      :items="
        ACMG_EVIDENCE_LEVELS_PATHOGENIC.includes(props.criteriaState.evidenceLevel)
          ? ACMG_EVIDENCE_LEVELS_PATHOGENIC
          : ACMG_EVIDENCE_LEVELS_BENIGN
      "
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
