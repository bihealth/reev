<script setup lang="ts">
import { DateTime } from 'luxon'
import { onMounted, ref, watch } from 'vue'

import { ClinvarsubClient, type SubmittingOrgRead } from '@/api/clinvarsub'

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
    value: 'token',
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
onMounted(() => loadData())
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
  loadData()
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

// -- code supporting the edit dialog ------------------------------------------
</script>

<template>
  <v-card>
    <v-card-title> ClinVar Organisations </v-card-title>
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
        <template #[`item.token`]="{}"> *** </template>
        <template #[`item.actions`]="{ item }">
          <v-btn variant="text" title="delete" @click="deleteOnClick(item.id)">
            <v-icon>mdi-delete-forever-outline</v-icon>
          </v-btn>
          <v-btn variant="text" title="delete">
            <v-icon>mdi-lead-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>

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
