<!--
Component with CRUD for submitting organisations.

These host the ClinVar API keys that users can register to use the ClinVar.

The delete confirmation and editor dialog are currently implemented inline
in this component.  This could be moduralized further in the future but
currently, the complexity trade-off leans towards keeping this monolithic
in this component.
-->

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { maxLength, minLength, required, requiredIf } from '@vuelidate/validators'
import { DateTime } from 'luxon'
import { onMounted, reactive, ref, watch } from 'vue'

import { ClinvarsubClient, type SubmittingOrgRead, type SubmittingOrgWrite } from '@/api/clinvarsub'
import { useClinvarsubStore } from '@/stores/clinvarsub'

/** Store with ClinVar submission related information. */
const clinvarsubStore = useClinvarsubStore()

// -- code supporting v-data-table-server --------------------------------------

/** Interface for header; to make type checker happy. */
interface Header {
  title?: string
  value?: string
  align?: 'start' | 'center' | 'end'
}

/** The headers for the data table.*/
const HEADERS: Header[] = [
  {
    title: 'Label',
    value: 'label',
    align: 'start'
  },
  {
    title: 'Update',
    value: 'updated',
    align: 'start'
  },
  {
    title: 'Token',
    value: 'clinvar_api_token',
    align: 'start'
  },
  {
    title: 'Actions',
    value: 'actions',
    align: 'end'
  }
]

/** The client to use for retrieving information from clinvarsub API. */
const clinvarsubClient = new ClinvarsubClient()
/** The data read from the API. */
const items = ref<SubmittingOrgRead[] | undefined>(undefined)
/** The number of items per page. */
const itemsPerPage = ref<number>(10)
/** The total number of items on the server. */
const totalItems = ref<number>(0)
/** The current page. */
const page = ref<number>(1)
/** A mapping from page number to token. */
const pageToToken = ref<{ [key: number]: string | undefined }>({ 1: undefined })

/** Load all data. */
const loadData = async () => {
  // Reset the items to undefined to show the loading indicator.
  items.value = undefined
  // Fetch the submitting organisations.
  const submittingOrgsPage = await clinvarsubClient.fetchSubmittingOrgs(
    pageToToken.value[page.value],
    itemsPerPage.value
  )
  // Update the items and total items.
  items.value = submittingOrgsPage.items
  totalItems.value = submittingOrgsPage.total ?? 0
  // Update the page to token mapping for next and previous page.
  if (submittingOrgsPage.previous_page !== null) {
    pageToToken.value[page.value - 1] = submittingOrgsPage.previous_page
  }
  if (submittingOrgsPage.next_page !== null) {
    pageToToken.value[page.value + 1] = submittingOrgsPage.next_page
  }
}

// Load the data on load and change of the `v:model`'s of the v-data-table-server.
onMounted(() => Promise.all([loadData(), clinvarsubStore.initialize()]))
watch(
  () => [page, itemsPerPage],
  () => loadData()
)

// -- code supporting delete dialog --------------------------------------------

/** ID of element to delete. */
const deleteId = ref<string | undefined>(undefined)
/** Whether the delete dialog is open. */
const deleteDialogOpen = ref<boolean>(false)

/** Handle 'delete item' button click. */
const deleteOnClick = (id: string) => {
  deleteId.value = id
  deleteDialogOpen.value = true
}

/** Handle the confirmed deletion. */
const deleteOnConfirmed = async () => {
  if (deleteId.value === undefined) {
    return
  }
  await clinvarsubClient.deleteSubmittingOrg(deleteId.value)
  deleteCloseDialog()
  await Promise.all([loadData(), clinvarsubStore.loadSubmittingOrgs()])
}

/** Close delete dialog and unset `deleteId`. */
const deleteCloseDialog = () => {
  deleteId.value = undefined
  deleteDialogOpen.value = false
}

// Ensure the `deleteId` is set to `undefined` when the modal is closed
watch(deleteDialogOpen, () => {
  if (deleteDialogOpen.value === false) {
    deleteCloseDialog()
  }
})

// -- code supporting the create/edit dialog ----------------------------------

/** Enumeration for the editor mode. */
enum EditorMode {
  Create,
  Edit
}
/** Initial state for editor. */
const editorInitialState: SubmittingOrgWrite = {
  label: '',
  clinvar_api_token: ''
}

/** The editor mode. */
const editorMode = ref<EditorMode>(EditorMode.Create)
/** Whether the editor dialog is open. */
const editorDialogOpen = ref<boolean>(false)
/** The editor state. */
const editorState = reactive<SubmittingOrgWrite>({ ...editorInitialState })
/** Rules for the editor. */
const editorRules = {
  label: { required, minLength: minLength(3), maxLength: maxLength(255), $autoDirty: true },
  clinvar_api_token: {
    required: requiredIf(() => editorMode.value === EditorMode.Create),
    minLength: minLength(64),
    maxLength: maxLength(64),
    $autoDirty: true
  }
}
/** The vuelidate instance. */
const v$ = useVuelidate<SubmittingOrgWrite>(editorRules, editorState)

/** Clear the editor state. */
const editorClear = () => {
  v$.value.$reset()
  editorState.id = undefined
  editorState.label = editorInitialState.label
  editorState.clinvar_api_token = undefined
}

/** Open the editor in create mode. */
const editorOpenCreate = () => {
  editorClear()
  editorMode.value = EditorMode.Create
  editorDialogOpen.value = true
}

/** Open the editor in update mode. */
const editorOpenEdit = (item: SubmittingOrgRead) => {
  editorState.id = item.id
  editorState.label = item.label
  editorState.clinvar_api_token = undefined

  editorMode.value = EditorMode.Edit
  editorDialogOpen.value = true
}

/** Submit in editor. */
const editorSubmit = async () => {
  if (editorMode.value === EditorMode.Create) {
    await clinvarsubClient.createSubmittingOrg(editorState)
  } else if (editorMode.value === EditorMode.Edit) {
    await clinvarsubClient.updateSubmittingOrg(editorState)
  }
  editorClear()
  editorDialogOpen.value = false
  await Promise.all([loadData(), clinvarsubStore.loadSubmittingOrgs()])
}

/** Close editor. */
const editorCancel = () => {
  editorClear()
  editorDialogOpen.value = false
}
</script>

<template>
  <v-card>
    <v-card-title class="pb-0">
      ClinVar Organisations
      <div class="float-right">
        <v-btn
          color="success"
          variant="outlined"
          rounded="xs"
          prepend-icon="mdi-plus-box-outline"
          @click="editorOpenCreate()"
        >
          New
        </v-btn>
      </div>
    </v-card-title>
    <v-card-subtitle class="text-overline"> Register ClinVar API Keys Here </v-card-subtitle>

    <v-card-text class="mt-3">
      <v-data-table-server
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        :headers="HEADERS"
        :items-length="totalItems"
        :items="items"
        :loading="items === null"
        item-value="name"
        @update:options="loadData"
      >
        <template #[`item.updated`]="{ item }">
          {{ DateTime.fromISO(item.created).toFormat('yyyy-MM-dd HH:mm') }}
        </template>
        <template #[`item.clinvar_api_token`]="{}"> *** </template>
        <template #[`item.actions`]="{ item }">
          <v-btn variant="text" title="delete" @click="deleteOnClick(item.id)">
            <v-icon>mdi-delete-forever-outline</v-icon>
          </v-btn>
          <v-btn variant="text" title="delete" @click="editorOpenEdit(item)">
            <v-icon>mdi-lead-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>

  <!-- Editor Dialog -->
  <v-dialog v-model="editorDialogOpen" width="auto">
    <v-responsive min-width="400">
      <v-card>
        <v-card-title>
          <span v-if="editorMode === EditorMode.Create"> Create </span>
          <span v-else-if="editorMode === EditorMode.Edit"> Edit </span>
          <span> Submitting Organisation </span>
        </v-card-title>
        <v-card-text>
          <form>
            <v-text-field
              v-model="editorState.label"
              :error-messages="v$.label.$errors.map((e: any) => e.$message)"
              label="Label"
              @input="v$.label.$touch"
              @blur="v$.label.$touch"
            />
            <v-text-field
              v-model="editorState.clinvar_api_token"
              :error-messages="v$.clinvar_api_token.$errors.map((e: any) => e.$message)"
              label="Token"
              :hint="editorMode === EditorMode.Edit ? 'Leave empty to keep untouched' : undefined"
              @input="v$.clinvar_api_token.$touch"
              @blur="v$.clinvar_api_token.$touch"
            />
          </form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="success" prepend-icon="mdi-plus-circle-outline" @click="editorSubmit()">
            <span v-if="editorMode === EditorMode.Create"> Create </span>
            <span v-else-if="editorMode === EditorMode.Edit"> Update </span>
          </v-btn>
          <v-btn color="primary" prepend-icon="mdi-close-box-outline" @click="editorCancel()">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-responsive>
  </v-dialog>

  <!-- Deletion Confirmation Dialog -->
  <v-dialog v-model="deleteDialogOpen" width="auto">
    <v-card>
      <v-alert type="warning" class="rounded-0">
        <v-alert-title> Really delete? This action cannot be reverted! </v-alert-title>
      </v-alert>
      <v-card-actions>
        <v-btn color="error" prepend-icon="mdi-delete-forever-outline" @click="deleteOnConfirmed()">
          Yes, Delete
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-close-box-outline" @click="deleteCloseDialog()">
          No, Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
