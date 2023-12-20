<!--
ClinVar submission of seqvars/strucvars.
-->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import {
  ClinvarsubClient,
  type SubmissionThreadRead,
  type SubmittingOrgRead,
  VariantPresence
} from '@/api/clinvarsub'
import DocsLink from '@/components/DocsLink.vue'
import { type Seqvar, type Strucvar } from '@/lib/genomicVars'
import { useClinvarsubStore } from '@/stores/clinvarsub'
import { StoreState } from '@/stores/misc'

/** Data type used for component's props. */
interface Props {
  /** Seqvar to use for submission. */
  seqvar?: Seqvar
  /** Strucvar to use for submission. */
  strucvar?: Strucvar
}

/** Define component's props. */
const props = defineProps<Props>()

// -- clinvarsub store ---------------------------------------------------------

/** Store with ClinVar submission related information. */
const clinvarsubStore = useClinvarsubStore()

/** Initialize the store an load the data for the current variant. */
const loadData = async () => {
  await clinvarsubStore.initialize()
  let primaryVariantDesc: string | null
  if (props.seqvar) {
    const { genomeBuild, chrom, pos, del, ins } = props.seqvar
    primaryVariantDesc = `${genomeBuild}-${chrom}-${pos}-${del}-${ins}`
  } else if (props.strucvar) {
    const { svType, genomeBuild, chrom, start, stop } = props.strucvar
    primaryVariantDesc = `${svType}-${genomeBuild}-${chrom}-${start}-${stop}`
  } else {
    primaryVariantDesc = null
  }
  await clinvarsubStore.loadSubmissionThreads(primaryVariantDesc)
}

// Ensure the store is initialized when the card is mounted.
onMounted(() => loadData)
// Handle changes to the variant.
watch(() => [props.seqvar, props.strucvar], loadData)

// -- submission threads -------------------------------------------------------

/** State of the submission thread display. */
enum Display {
  /** Display thread list (if any) */
  List,
  /** Display stepper to create a new submission thread. */
  Stepper
}

/** Enumeration for the thread creation. */
enum Steps {
  /** Select the submitting organization, enter operation, SCV. */
  Prepare = 'Prepare',
  /** Enter the variant details. */
  DataEntry = 'Enter Data',
  /** Review the submission. */
  Review = 'Review & Submit'
}

/** Current display state. */
const display = ref<Display>(Display.List)
/** The current stepper items. */
const stepperItems = computed<string[]>(() => {
  if (prepareModel.value?.desiredPresence === VariantPresence.Present) {
    return Object.values(Steps)
  } else {
    return [Steps.Prepare, Steps.Review]
  }
})

/** Interface for editing in preparation step. */
interface PrepareModel {
  /** Submitting oragnisation UUID. */
  submittingorgId: string | undefined
  /** Whether the user has an SCV. */
  hasScv: boolean
  /** Whether the user wants to update/create or delete. */
  desiredPresence: VariantPresence
  /** Selected SCV. */
  scv: string | undefined
}
/** Current state of preparation step. */
const prepareModel = ref<PrepareModel>({
  submittingorgId: undefined,
  hasScv: false,
  desiredPresence: VariantPresence.Present,
  scv: undefined
})

/** Select the first submitting org from the store as currently selected. */
const selectFirstSubmittingOrg = () => {
  const submittingOrgs = Object.values(clinvarsubStore.submittingOrgs)
  if (submittingOrgs.length > 0) {
    prepareModel.value.submittingorgId = submittingOrgs[0].id
  }
}
// Select the first submitting org when mounted.
onMounted(selectFirstSubmittingOrg)
// Select the first submitting org when the submitting orgs are reloaded
watch(() => clinvarsubStore.storeState, selectFirstSubmittingOrg)
</script>

<template>
  <v-card class="mt-3">
    <v-card-title class="pb-0 pr-2">
      ClinVar Submission
      <DocsLink anchor="clinvar-submission" />
      <template v-if="display !== Display.List">
        <v-btn
          class="float-right px-3 py-1 mr-3"
          variant="outlined"
          rounded="xs"
          prepend-icon="mdi-close-box-outline"
          @click="display = Display.List"
        >
          Cancel
        </v-btn>
      </template>
    </v-card-title>
    <v-card-subtitle class="text-overline"> Submit Your Variants To ClinVar </v-card-subtitle>

    <v-card-text v-if="clinvarsubStore.storeState !== StoreState.Active">
      <v-skeleton-loader type="card" />
    </v-card-text>

    <v-card-text v-else-if="Object.keys(clinvarsubStore.submittingOrgs).length === 0">
      <p>You have not yet registered any submitting organizations.</p>
      <p>
        Please register at least one submitting organization with the ClinVar API key in the profile
        before submitting variants to ClinVar.
      </p>
    </v-card-text>

    <v-card-text>
      <template v-if="display === Display.List">
        <template v-if="Object.keys(clinvarsubStore.submissionThreads).length === 0">
          <div
            class="text-center font-italic text-grey-darken-2"
            v-if="Object.keys(clinvarsubStore.submissionThreads).length === 0"
          >
            No submissions for this variant yet. Do you want to create one?
          </div>
          <div class="text-center">
            <v-btn class="mt-3" color="primary" @click="display = Display.Stepper">
              Create Submission
            </v-btn>
          </div>
        </template>
      </template>

      <template v-else-if="display === Display.Stepper">
        <v-stepper alt-labels :items="stepperItems" :flat="true" :elevation="0">
          <template v-slot:item.1>
            <v-sheet>
              <p class="pb-6 text-body-1">
                Below, select the submitting organisation (and corresponding ClinVar API key) that
                you want to use. Also, you can configure whether you want to create a new submission
                or update/delete an existing one.
              </p>
              <v-form>
                <v-select
                  v-model="prepareModel.submittingorgId"
                  label="Submitting Organisation"
                  item-title="label"
                  item-value="id"
                  :items="Object.values(clinvarsubStore.submittingOrgs)"
                  :hide-details="true"
                ></v-select>

                <v-switch
                  class="pt-6"
                  inset
                  v-model="prepareModel.hasScv"
                  :hide-details="true"
                  label="I want to update/delete with an existing submission an I have an SCV"
                >
                </v-switch>

                <v-text-field
                class="pt-6"
                  :disabled="!prepareModel.hasScv"
                  v-model="prepareModel.scv"
                  label="SCV of existing submission"
                  :hide-details="true"
                ></v-text-field>

                <v-switch
                  class="pt-6"
                  inset
                  :disabled="!prepareModel.hasScv"
                  true-icon="mdi-pencil"
                  false-icon="mdi-delete-forever"
                  v-model="prepareModel.desiredPresence"
                  :true-value="VariantPresence.Present"
                  :false-value="VariantPresence.Absent"
                  :label="prepareModel.desiredPresence === VariantPresence.Present ? 'Update Variant' : 'Delete Variant'"
                  :hide-details="true"
                ></v-switch>
              </v-form>
            </v-sheet>
          </template>
          <template v-slot:item.2>
            <v-card title="Enter Data" flat>...</v-card>
          </template>
          <template v-slot:item.3>
            <v-card title="Review & Submit" flat>...</v-card>
          </template>
        </v-stepper>
      </template>
    </v-card-text>
  </v-card>
</template>
