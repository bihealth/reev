<!--
ClinVar submission of seqvars/strucvars.
-->
<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { helpers, integer, minValue, required } from '@vuelidate/validators'
import _ from 'lodash'
import { computed, onMounted, ref, watch } from 'vue'

import {
  AffectedStatus,
  AlleleOrigin,
  Assembly,
  CitationDb,
  ClinicalSignificanceDescription,
  CollectionMethod,
  ModeOfInheritance,
  RecordStatus,
  ReleaseStatus,
  StructVarMethodType,
  type SubmissionClinicalFeature,
  type SubmissionCondition,
  type SubmissionContainer,
  type SubmissionVariant,
  VariantPresence,
  VariantType
} from '@/api/clinvarsub'
import { type SubmittingOrgRead } from '@/api/clinvarsub'
import DocsLink from '@/components/DocsLink.vue'
import ClinvarsubThreadList from '@/components/VarDetails/ClinvarsubThreadList.vue'
import { type Seqvar, type Strucvar } from '@/lib/genomicVars'
import { deepCopy } from '@/lib/utils'
import { useClinvarsubStore } from '@/stores/clinvarsub'
import { StoreState } from '@/stores/misc'
import { useTermsStore } from '@/stores/terms'
import { useUserStore } from '@/stores/user'

/** Data type used for component's props. */
interface Props {
  /** Seqvar to use for submission. */
  seqvar?: Seqvar
  /** Strucvar to use for submission. */
  strucvar?: Strucvar
}

/** Define component's props. */
const props = defineProps<Props>()

/** Primary variant description as inferred from the props. */
const primaryVariantDesc = computed<string | undefined>(() => {
  if (props.seqvar) {
    const { genomeBuild, chrom, pos, del, ins } = props.seqvar
    return `${genomeBuild}-${chrom}-${pos}-${del}-${ins}`
  } else if (props.strucvar) {
    const { svType, genomeBuild, chrom, start, stop } = props.strucvar
    return `${svType}-${genomeBuild}-${chrom}-${start}-${stop}`
  } else {
    return ''
  }
})

/** Store with the user information, for checking login information. */
const userStore = useUserStore()

// -- clinvarsub store ---------------------------------------------------------

/** Store with ClinVar submission related information. */
const clinvarsubStore = useClinvarsubStore()

/** Initialize the store an load the data for the current variant. */
const loadStoreData = async () => {
  await clinvarsubStore.initialize()
  await clinvarsubStore.loadSubmissionThreads(primaryVariantDesc.value)
}

// Ensure the store is initialized when the card is mounted.
onMounted(() => Promise.all([userStore.initialize(), loadStoreData()]))
// Handle changes to the variant.
watch(() => [props.seqvar, props.strucvar], loadStoreData)

/** The currently selected submitting org from prepareModelState (see below). */
const currSubmittingOrg = computed<SubmittingOrgRead | undefined>(() => {
  const submittingOrgId = prepareModelState.value.submittingorgId
  if (submittingOrgId === undefined) {
    return undefined
  } else {
    return clinvarsubStore.submittingOrgs[submittingOrgId]
  }
})

// -- submission threads editor ------------------------------------------------

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

/** Component state; Current step. */
const currentStep = ref<number>(1)
/** Component state; current display state. */
const display = ref<Display>(Display.List)

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
/** Default state of preparation step. */
const prepareModelStateDefaults: PrepareModel = {
  submittingorgId: undefined,
  hasScv: false,
  desiredPresence: VariantPresence.Present,
  scv: undefined
}
/** Current state of preparation step. */
const prepareModelState = ref<PrepareModel>(deepCopy(prepareModelStateDefaults))
/** Rules for the prepare model state. */
const prepareModelRules = {
  scv: {
    required: helpers.withMessage(
      'Must be provided if you say you have a SCV',
      (value: string | undefined): boolean => !prepareModelState.value.hasScv || !!value
    ),
    mustBeValid: helpers.withMessage('Must be a valid SCV', (value: string): boolean => {
      if (!prepareModelState.value.hasScv) {
        return true
      } else {
        return !helpers.req(value) || value.match(/^SCV[0-9]{9,9}$/) !== null
      }
    })
  }
}
/** Vuelidate instance for `prepareModel`. */
const v$prepareModel = useVuelidate<PrepareModel>(prepareModelRules, prepareModelState)

/** Select the first submitting org from the store as currently selected. */
const selectFirstSubmittingOrg = () => {
  const submittingOrgs = Object.values(clinvarsubStore.submittingOrgs)
  if (submittingOrgs.length > 0) {
    prepareModelState.value.submittingorgId = submittingOrgs[0].id
  }
}
// Select the first submitting org when mounted.
onMounted(selectFirstSubmittingOrg)
// Select the first submitting org when the submitting orgs are reloaded
watch(() => clinvarsubStore.storeState, selectFirstSubmittingOrg)

/** Interface for creationg and update of submissions. */
interface CreateUpdateModel {
  // -- clinical significance ---------------------------------------------------

  /** Clinical significance description. */
  clinicalSignificanceDescription: ClinicalSignificanceDescription
  /** Optional comment. */
  comment?: string
  /** Date of last evaluation. */
  dateLastEvaluated: string
  /** Mode of inheritance. */
  modeOfInheritance: ModeOfInheritance

  // -- patient-related --------------------------------------------------------

  /** Condition set. */
  caseCondition?: SubmissionCondition
  /** Patient information. */
  caseAffectedStatus: AffectedStatus
  /** Allele origin. */
  caseAlleleOrigin: AlleleOrigin
  /** Collection method. */
  caseCollectionMethod: CollectionMethod
  /** Clinical features. */
  caseClinicalFeatures: SubmissionClinicalFeature[]

  // -- strucvar-related -------------------------------------------------------

  /** Observed copy number (for form: as string). */
  copyNumber: string
  /** Reference copy number (for form: as string). */
  referenceCopyNumber: string
  /** Method for structural variant calling. */
  structVarMethod: StructVarMethodType | null
}
/** Default value for the create/update model. */
const createDefaultModelStateDefault: CreateUpdateModel = {
  // -- clinical significance ---------------------------------------------------

  clinicalSignificanceDescription: ClinicalSignificanceDescription.UncertainSignificance,
  comment: undefined,
  dateLastEvaluated: new Date().toISOString().slice(0, 10),
  modeOfInheritance: ModeOfInheritance.UnknownMechanism,

  // -- patient-related --------------------------------------------------------

  caseCondition: undefined,
  caseAffectedStatus: AffectedStatus.Yes,
  caseAlleleOrigin: AlleleOrigin.Germline,
  caseCollectionMethod: CollectionMethod.ClinicalTesting,
  caseClinicalFeatures: [],

  // -- strucvar-related -------------------------------------------------------

  copyNumber: '',
  referenceCopyNumber: '',
  structVarMethod: null
}
/** The model for the create/update data. */
const createUpdateModelState = ref<CreateUpdateModel>(deepCopy(createDefaultModelStateDefault))
/** Rules for the prepare model state. */
const createUpdateModelRules = {
  dateLastEvaluated: {
    required,
    mustBeValid: helpers.withMessage(
      'Must be a valid date',
      (value: string): boolean => !helpers.req(value) || !isNaN(Date.parse(value))
    )
  },
  referenceCopyNumber: {
    integer,
    minValue: minValue(0)
  },
  copyNumber: {
    integer,
    minValue: minValue(0)
  }
}
/** Vuelidate instance for `createUpdateModel`. */
const v$createUpdateModel = useVuelidate<CreateUpdateModel>(
  createUpdateModelRules,
  createUpdateModelState
)

/** Store to use for querying HPO/OMIM terms. */
const termsStore = useTermsStore()
/** Model for entering the diseases search query. */
const omimSearchQuery = ref<string>('')
/** Whether the search query for diseases is running. */
const omimIsLoading = ref<boolean>(false)
/** Debounced search for OMIM terms. */
const debouncedOmimFetchTerms = _.debounce(async (query: string) => {
  if (!query) return
  omimIsLoading.value = true
  try {
    await termsStore.fetchOmimTerms(query)
  } finally {
    omimIsLoading.value = false
  }
}, 250)
/** Model for entering the clinical features search query. */
const hpoSearchQuery = ref<string>('')
/** Whether the search query for clinical features is running. */
const hpoIsLoading = ref<boolean>(false)
/** Debounced search for OMIM terms. */
const debouncedHpoFetchTerms = _.debounce(async (query: string) => {
  if (!query) return
  omimIsLoading.value = true
  try {
    await termsStore.fetchHpoTerms(query)
  } finally {
    omimIsLoading.value = false
  }
}, 250)

/** Construct a `SubmissionVariant` for a seqvar/ */
const constructSeqvarVariant = (seqvar: Seqvar): SubmissionVariant => {
  const { genomeBuild, chrom, pos, del, ins } = seqvar
  const assembly = genomeBuild === 'grch37' ? Assembly.Grch37 : Assembly.Grch38
  return {
    chromosome_coordinates: {
      assembly,
      chromosome: chrom,
      start: pos,
      reference_allele: del,
      alternate_allele: ins
    }
  }
}

/** Construct a `SubmissionVariant` for a strucvar/ */
const constructStrucvarVariant = (
  strucvar: Strucvar,
  model: CreateUpdateModel
): SubmissionVariant => {
  const { svType, genomeBuild, chrom, start, stop } = strucvar
  const assembly = genomeBuild === 'grch37' ? Assembly.Grch37 : Assembly.Grch38
  let referenceCopyNumber: number | undefined = undefined
  if (model.referenceCopyNumber !== undefined) {
    referenceCopyNumber = parseInt(model.referenceCopyNumber)
  }
  let variantType: VariantType | undefined
  switch (svType) {
    case 'DEL':
      variantType = VariantType.Deletion
      break
    case 'DUP':
      variantType = VariantType.Duplication
      break
    default:
      throw new Error(`Unknown SV type: ${svType}`)
  }
  return {
    chromosome_coordinates: {
      assembly,
      chromosome: chrom,
      start,
      stop
    },
    copy_number: model.copyNumber,
    reference_copy_number: referenceCopyNumber,
    variant_type: variantType
  }
}

/** Construct a `SubmissionContainer` for a creation. */
const constructCreateUpdatePayload = (
  prepareModel: PrepareModel,
  createUpdateModel: CreateUpdateModel
): SubmissionContainer => {
  const modelCopy: CreateUpdateModel = deepCopy(createUpdateModel)
  let submissionVariant: SubmissionVariant
  if (props.seqvar) {
    submissionVariant = constructSeqvarVariant(props.seqvar)
  } else if (props.strucvar) {
    submissionVariant = constructStrucvarVariant(props.strucvar, createUpdateModel)
  } else {
    throw new Error('Attempt to construct payload without seqvar or strucvar')
  }

  return {
    assertion_criteria: {
      db: CitationDb.Pubmed,
      id: '25741868' // ACMG 2015
    },
    clinvar_submission: [
      {
        clinical_significance: {
          clinical_significance_description: modelCopy.clinicalSignificanceDescription,
          comment: modelCopy.comment,
          date_last_evaluated: modelCopy.dateLastEvaluated,
          mode_of_inheritance: modelCopy.modeOfInheritance
        },
        condition_set: {
          condition: modelCopy.caseCondition
            ? [modelCopy.caseCondition]
            : [{ name: 'not provided' }]
        },
        observed_in: [
          {
            affected_status: modelCopy.caseAffectedStatus,
            allele_origin: modelCopy.caseAlleleOrigin,
            collection_method: modelCopy.caseCollectionMethod,
            clinical_features: modelCopy.caseClinicalFeatures
          }
        ],
        record_status: prepareModel.scv === undefined ? RecordStatus.Novel : RecordStatus.Update,
        clinvar_accession: prepareModel.scv,
        variant_set: {
          variant: [submissionVariant]
        }
      }
    ],
    clinvar_submission_release_status: ReleaseStatus.Public
  }
}
/** Interface for deletion of submissions. */
interface DeleteModel {
  /** Optional free-text reason. */
  reason?: string
}
/** The model for the create/update data. */
const deleteModel = ref<DeleteModel>({})

/** Construct a `SubmissionContainer` given an accession and reason. */
const constructDeletePayload = (
  prepareModel: PrepareModel,
  deleteModel: DeleteModel
): SubmissionContainer => ({
  clinvar_deletion: {
    accession_set: [
      {
        accession: prepareModel.scv ?? 'UNDEFINED',
        reason: deleteModel.reason
      }
    ]
  }
})

/** Handler for click on "cancel". */
const onClickCancel = async () => {
  display.value = Display.List
  currentStep.value = 1
  prepareModelState.value = deepCopy(prepareModelStateDefaults)
  createUpdateModelState.value = deepCopy(createDefaultModelStateDefault)
}
/** Handler for click on "previous". */
const onClickPrevious = async () => {
  const currentStep$ = Object.values(Steps)[currentStep.value - 1]
  switch (currentStep$) {
    case Steps.Prepare:
      console.error('unreachable')
      break
    case Steps.DataEntry:
      if (!(await v$createUpdateModel.value.$validate())) {
        v$createUpdateModel.value.$touch()
      } else {
        currentStep.value = Object.values(Steps).indexOf(Steps.Prepare) + 1
      }
      break
    case Steps.Review:
      currentStep.value = Object.values(Steps).indexOf(Steps.DataEntry) + 1
      break
  }
}
/** Handler for click on "next". */
const onClickNext = async () => {
  const currentStep$ = Object.values(Steps)[currentStep.value - 1]
  switch (currentStep$) {
    case Steps.Prepare:
      if (!(await v$prepareModel.value.$validate())) {
        v$prepareModel.value.$touch()
      } else {
        currentStep.value = Object.values(Steps).indexOf(Steps.DataEntry) + 1
      }
      break
    case Steps.DataEntry:
      if (!(await v$createUpdateModel.value.$validate())) {
        v$createUpdateModel.value.$touch()
      } else {
        currentStep.value = Object.values(Steps).indexOf(Steps.Review) + 1
      }
      break
    case Steps.Review:
      console.error('unreachable')
      break
  }
}

/** Component state; whether the submission is currently running. */
const isSubmitting = ref<boolean>(false)
/** Whether to display the alert. */
const messageType = ref<'success' | 'error'>('success')
/** Any error message to display to the user. */
const messageText = ref<string>('')

/** Handler for "Submit Create/Update/Delete Request". */
const onSubmitRequest = async () => {
  isSubmitting.value = true
  // Construct appropriate payload.
  let payload: SubmissionContainer
  if (prepareModelState.value.desiredPresence == VariantPresence.Absent) {
    payload = constructDeletePayload(prepareModelState.value, deleteModel.value)
  } else {
    payload = constructCreateUpdatePayload(prepareModelState.value, createUpdateModelState.value)
  }
  // Attempt to create the new submission and handle error and success.
  try {
    await clinvarsubStore.createSubmissionThread(
      prepareModelState.value.submittingorgId!,
      primaryVariantDesc.value!,
      prepareModelState.value.scv,
      prepareModelState.value.scv ? VariantPresence.Present : VariantPresence.Absent,
      prepareModelState.value.desiredPresence,
      payload
    )
    messageType.value = 'success'
    messageText.value =
      'Your submission request has been saved on our server and will be processed shortly.'
  } catch (err) {
    messageType.value = 'error'
    messageText.value = `Something went wrong: ${err}`
  } finally {
    isSubmitting.value = false
  }
  if (messageType.value === 'success') {
    await onClickCancel()
  }
}
</script>

<template>
  <v-card class="mt-3">
    <v-card-text v-if="messageText.length > 0">
      <v-alert :type="messageType" closable @click:close="messageText = ''">
        {{ messageText }}
      </v-alert>
    </v-card-text>

    <v-card-title class="pb-0 pr-2">
      ClinVar Submission
      <DocsLink anchor="clinvar-submission" />
      <template v-if="display !== Display.List">
        <v-btn
          class="float-right px-3 py-1 mr-3"
          variant="outlined"
          rounded="xs"
          prepend-icon="mdi-close-box-outline"
          @click="onClickCancel()"
        >
          Cancel
        </v-btn>
      </template>
      <template
        v-else-if="
          display === Display.List &&
          Object.keys(clinvarsubStore.submittingOrgs).length !== 0 &&
          Object.keys(clinvarsubStore.submissionThreads).length !== 0
        "
      >
        <v-btn
          class="float-right px-3 py-1 mr-3"
          color="success"
          variant="outlined"
          rounded="xs"
          prepend-icon="mdi-plus-box-outline"
          @click="display = Display.Stepper"
        >
          New
        </v-btn>
      </template>
    </v-card-title>
    <v-card-subtitle class="text-overline"> Submit Your Variants To ClinVar </v-card-subtitle>

    <v-card-text v-if="!userStore.currentUser">
      <p class="text-center text-grey-darken-2">
        ClinVar submission is only enabled for logged in users because you need to store your
        ClinVar API key.
      </p>
    </v-card-text>

    <v-card-text v-else-if="clinvarsubStore.storeState !== StoreState.Active">
      <v-skeleton-loader type="card" />
    </v-card-text>

    <v-card-text v-else-if="Object.keys(clinvarsubStore.submittingOrgs).length === 0">
      <p>You have not yet registered any submitting organizations.</p>
      <p>
        Please register at least one submitting organization with the ClinVar API key in the profile
        before submitting variants to ClinVar.
      </p>
    </v-card-text>

    <v-card-text class="mt-3" v-else>
      <template v-if="display === Display.List">
        <template v-if="Object.keys(clinvarsubStore.submissionThreads).length === 0">
          <div class="text-center font-italic text-grey-darken-2">
            No submissions for this variant yet. Do you want to create one?
          </div>
          <div class="text-center">
            <v-btn class="mt-3" color="primary" @click="display = Display.Stepper">
              Create Submission
            </v-btn>
          </div>
        </template>
        <template v-else>
          <ClinvarsubThreadList
            :seqvar="seqvar"
            :strucvar="strucvar"
            :primary-variant-desc="primaryVariantDesc"
          ></ClinvarsubThreadList>
        </template>
      </template>

      <template v-else-if="display === Display.Stepper">
        <v-stepper
          v-model="currentStep"
          alt-labels
          :items="Object.values(Steps)"
          :flat="true"
          :elevation="0"
        >
          <template #[`prev`]>
            <template
              v-if="v$prepareModel.$errors.length > 0 || v$createUpdateModel.$errors.length > 0"
            >
              <v-btn color="error" @click="() => onClickNext()"> Fix Errors </v-btn>
            </template>
            <template v-else>
              <v-btn color="primary" @click="() => onClickPrevious()"> Previous </v-btn>
            </template>
          </template>
          <template #[`next`]>
            <template v-if="currentStep === Object.values(Steps).indexOf(Steps.Review) + 1">
              <v-btn color="primary" disabled> Next </v-btn>
            </template>
            <template
              v-else-if="
                v$prepareModel.$errors.length > 0 || v$createUpdateModel.$errors.length > 0
              "
            >
              <v-btn color="error" @click="() => onClickNext()"> Fix Errors </v-btn>
            </template>
            <template v-else>
              <v-btn color="primary" @click="() => onClickNext()"> Next </v-btn>
            </template>
          </template>

          <template #[`item.1`]>
            <v-sheet>
              <p class="pb-6 text-body-1">
                Below, select the submitting organisation (and corresponding ClinVar API key) that
                you want to use. Also, you can configure whether you want to create a new submission
                or update/delete an existing one.
              </p>
              <form>
                <v-select
                  v-model="prepareModelState.submittingorgId"
                  label="Submitting Organisation"
                  item-title="label"
                  item-value="id"
                  :items="Object.values(clinvarsubStore.submittingOrgs)"
                  :hide-details="true"
                ></v-select>

                <v-switch
                  v-model="prepareModelState.hasScv"
                  class="pt-6"
                  inset
                  :hide-details="true"
                  label="I want to update/delete with an existing submission and I have an SCV"
                >
                </v-switch>

                <v-text-field
                  v-model="prepareModelState.scv"
                  :error-messages="v$prepareModel.scv.$errors.map((e: any) => e.$message)"
                  label="SCV of existing submission"
                  class="pt-6"
                  :disabled="!prepareModelState.hasScv"
                  @input="v$prepareModel.scv.$touch"
                  @blur="v$prepareModel.scv.$touch"
                ></v-text-field>

                <v-switch
                  v-model="prepareModelState.desiredPresence"
                  class="pt-6"
                  inset
                  :disabled="!prepareModelState.hasScv"
                  true-icon="mdi-pencil"
                  false-icon="mdi-delete-forever"
                  :true-value="VariantPresence.Present"
                  :false-value="VariantPresence.Absent"
                  :label="
                    prepareModelState.desiredPresence === VariantPresence.Present
                      ? 'Update Variant'
                      : 'Delete Variant'
                  "
                  :hide-details="true"
                ></v-switch>
              </form>
            </v-sheet>
          </template>
          <template #[`item.2`]>
            <template v-if="prepareModelState.desiredPresence == VariantPresence.Absent">
              <p class="pb-6 text-body-1">
                Below, you may provide an optional free-text reason for removing the variant.
              </p>
              <v-form>
                <v-textarea
                  v-model="deleteModel.reason"
                  label="Free-text reason"
                  :hide-details="true"
                ></v-textarea>
              </v-form>
            </template>
            <template v-else>
              <p class="pb-6 text-body-1">
                Below, you may enter the details of the submission. The fields marked with an
                asterisk are required.
              </p>
              <form>
                <div class="text-overline pb-3">Case Conditions</div>
                <p class="pb-3 text-body-2">
                  Together with the variant, the <strong>Condition</strong> will identity your
                  submission. For example, you could submit a variant as pathogenic for disease A
                  while it may be benign for disease B. In addition, you can specify a number of
                  fine-grained Human Phenotype Ontology (HPO) terms that describe the patient's
                  condition.
                </p>
                <v-autocomplete
                  v-model="createUpdateModelState.caseCondition"
                  v-model:search="omimSearchQuery"
                  :items="termsStore.omimTerms"
                  :loading="omimIsLoading"
                  label="Condition"
                  item-title="name"
                  :item-value="(item) => item"
                  clearable
                  hint="You may specify an OMIM disease. Otherwise, we will submit with 'not provided'."
                  persistent-hint
                  class="pb-6"
                  @update:search="debouncedOmimFetchTerms"
                />

                <!-- HPO Terms -->
                <v-autocomplete
                  v-model="createUpdateModelState.caseClinicalFeatures"
                  v-model:search="hpoSearchQuery"
                  :items="termsStore.hpoTerms"
                  :loading="hpoIsLoading"
                  label="HPO Terms"
                  item-title="name"
                  :item-value="(item) => item"
                  multiple
                  chips
                  closable-chips
                  deletable-chips
                  hint="You can specify zero or multiple HPO terms. Submitting good clinical features will make your submission more useful for others."
                  @update:search="debouncedHpoFetchTerms"
                />

                <div class="text-overline pb-3">Clinical Significance</div>
                <v-row>
                  <v-col cols="9">
                    <v-select
                      v-model="createUpdateModelState.clinicalSignificanceDescription"
                      label="Clinical Significance*"
                      :items="Object.values(ClinicalSignificanceDescription)"
                      :hide-details="true"
                    ></v-select>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="createUpdateModelState.dateLastEvaluated"
                      :error-messages="
                        v$createUpdateModel.dateLastEvaluated.$errors.map((e: any) => e.$message)
                      "
                      label="Last Evaluated*"
                      @input="v$createUpdateModel.dateLastEvaluated.$touch"
                      @blur="v$createUpdateModel.dateLastEvaluated.$touch"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-textarea
                  v-model="createUpdateModelState.comment"
                  label="Optional Comment"
                  :hide-details="true"
                  class="pb-6"
                ></v-textarea>
                <div class="text-overline pb-3">Allele Information</div>
                <v-row>
                  <v-col cols="4">
                    <v-select
                      v-model="createUpdateModelState.caseAlleleOrigin"
                      label="Allele Origin*"
                      :items="Object.values(AlleleOrigin)"
                      :hide-details="true"
                      class="pb-6"
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="createUpdateModelState.modeOfInheritance"
                      label="Mode of Inheritance*"
                      :items="Object.values(ModeOfInheritance)"
                      :hide-details="true"
                      class="pb-6"
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="createUpdateModelState.caseCollectionMethod"
                      label="Collection Method**"
                      :items="Object.values(CollectionMethod)"
                      :hide-details="true"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row v-if="strucvar">
                  <v-col cols="3">
                    <v-text-field
                      v-model="createUpdateModelState.referenceCopyNumber"
                      :error-messages="
                        v$createUpdateModel.referenceCopyNumber.$errors.map((e: any) => e.$message)
                      "
                      label="Reference Copy Number"
                      @input="v$createUpdateModel.referenceCopyNumber.$touch"
                      @blur="v$createUpdateModel.referenceCopyNumber.$touch"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="createUpdateModelState.copyNumber"
                      :error-messages="
                        v$createUpdateModel.copyNumber.$errors.map((e: any) => e.$message)
                      "
                      label="Observed Copy Number"
                      @input="v$createUpdateModel.copyNumber.$touch"
                      @blur="v$createUpdateModel.copyNumber.$touch"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      v-model="createUpdateModelState.structVarMethod"
                      label="Method for Structural Variant Calling"
                      :items="Object.values(StructVarMethodType)"
                      hide-details
                      clearable
                    ></v-select>
                  </v-col>
                </v-row>
              </form>
            </template>
          </template>
          <template #[`item.3`]>
            <v-sheet
              v-if="
                prepareModelState.hasScv &&
                prepareModelState.desiredPresence == VariantPresence.Absent
              "
            >
              <p class="pb-3 text-body-1">
                Please confirm to request ClinVar to delete your submission given the folllowing
                information. Note that the selected submitting organisation and associated ClinVar
                API key must be the submitter of the original submission.
              </p>

              <div class="pt-3 text-caption">Submitting Organisation</div>
              <div class="text-body-1">
                {{ currSubmittingOrg?.label }}
              </div>
              <div class="pt-3 text-caption">SCV</div>
              <div class="text-body-1">
                {{ prepareModelState.scv }}
              </div>
              <div class="pt-3 text-caption">Reason</div>
              <div
                class="text-body-1"
                :class="{ 'text-grey-darken-1': !deleteModel.reason?.length }"
              >
                {{ deleteModel.reason || 'N/A' }}
              </div>

              <div class="text-center pt-9">
                <v-btn
                  color="error"
                  prepend-icon="mdi-cloud-remove-outline"
                  :loading="isSubmitting"
                  @click="onSubmitRequest()"
                >
                  Submit Deletion Request
                </v-btn>
              </div>
            </v-sheet>
            <v-sheet v-else>
              <p class="pb-3 text-body-1">
                Please confirm to request ClinVar to
                <template v-if="prepareModelState.hasScv"> update </template>
                <template v-else> create </template> your submission with the following data.
                <template v-if="prepareModelState.hasScv">
                  Note that the selected submitting organisation and associated ClinVar API key must
                  be the submitter of the original submission.
                </template>
              </p>

              <v-row>
                <v-col cols="4">
                  <div class="text-overline">Meta Information</div>
                  <div class="text-caption">Submitting Organisation</div>
                  <div class="text-body-1">
                    {{ currSubmittingOrg?.label }}
                  </div>
                  <div class="pt-3 text-caption">Operation</div>
                  <div class="text-body-1">
                    <template v-if="prepareModelState.hasScv"> update </template>
                    <span v-else> create </span>
                  </div>
                  <div class="pt-3 text-caption">SCV Submission Identifier</div>
                  <div class="text-body-1">
                    <template v-if="prepareModelState.hasScv">
                      {{ prepareModelState.scv }}
                    </template>
                    <span v-else class="text-grey-darken-2"> assigned after creation </span>
                  </div>

                  <div class="text-overline pt-6">Case Conditions</div>
                  <div class="text-caption">Condition</div>
                  <div class="text-body-1">
                    {{ createUpdateModelState.caseCondition?.name || 'not provided' }}
                  </div>
                  <div class="pt-3 text-caption">HPO Terms</div>
                  <div class="text-body-1">
                    <template v-if="createUpdateModelState.caseClinicalFeatures.length > 0">
                      {{
                        createUpdateModelState.caseClinicalFeatures.map((f) => f.name).join(', ')
                      }}
                    </template>
                    <span v-else class="text-grey-darken-2"> not provided </span>
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="text-overline">Clinical Signficance</div>
                  <div class="text-caption">Last Evaluated</div>
                  <div class="text-body-1">
                    {{ createUpdateModelState.dateLastEvaluated }}
                  </div>
                  <div class="pt-3 text-caption">Clinical Significance</div>
                  <div class="text-body-1">
                    {{ createUpdateModelState.clinicalSignificanceDescription }}
                  </div>
                  <div class="pt-3 text-caption">Comment</div>
                  <div class="text-body-1">
                    <template v-if="createUpdateModelState.comment?.length">
                      {{ createUpdateModelState.comment }}
                    </template>
                    <span v-else class="text-grey-darken-2"> not provided </span>
                  </div>

                  <div class="text-overline">Allele Information</div>
                  <div class="text-caption">Allele Origin</div>
                  <div class="text-body-1">
                    {{ createUpdateModelState.caseAlleleOrigin }}
                  </div>
                  <div class="pt-3 text-caption">Mode of Inheritance</div>
                  <div class="text-body-1">
                    {{ createUpdateModelState.modeOfInheritance }}
                  </div>
                  <div class="pt-3 text-caption">Collection Method</div>
                  <div class="text-body-1">
                    {{ createUpdateModelState.caseCollectionMethod }}
                  </div>
                </v-col>
                <v-col v-if="strucvar" cols="4">
                  <div class="text-overline">Structural Variant Information</div>
                  <div class="text-caption">Reference Copy Number</div>
                  <div
                    class="text-body-1"
                    :class="{
                      'text-grey-darken-1': !createUpdateModelState.referenceCopyNumber?.length
                    }"
                  >
                    <template v-if="createUpdateModelState.referenceCopyNumber?.length">
                      {{ createUpdateModelState.referenceCopyNumber }}
                    </template>
                    <template v-else>N/A</template>
                  </div>
                  <div class="pt-3 text-caption">Observed Copy Number</div>
                  <div
                    class="text-body-1"
                    :class="{ 'text-grey-darken-1': !createUpdateModelState.copyNumber?.length }"
                  >
                    <template v-if="createUpdateModelState.copyNumber?.length">
                      {{ createUpdateModelState.copyNumber }}
                    </template>
                    <template v-else>N/A</template>
                  </div>
                  <div class="pt-3 text-caption">Structural Variant Detection Method</div>
                  <div
                    class="text-body-1"
                    :class="{
                      'text-grey-darken-1': createUpdateModelState.structVarMethod === null
                    }"
                  >
                    {{ createUpdateModelState.structVarMethod ?? 'N/A' }}
                  </div>
                </v-col>
              </v-row>
              <div class="text-center pt-9">
                <v-btn
                  color="primary"
                  :prepend-icon="
                    prepareModelState.hasScv
                      ? 'mdi-cloud-refresh-variant-outline'
                      : 'mdi-cloud-upload-outline'
                  "
                  :loading="isSubmitting"
                  @click="onSubmitRequest()"
                >
                  Submit
                  <template v-if="prepareModelState.hasScv"> Update </template>
                  <template v-else> Creation </template>
                  Request
                </v-btn>
              </div>
            </v-sheet>
          </template>
        </v-stepper>
      </template>
    </v-card-text>
  </v-card>
</template>
