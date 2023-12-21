<!--
This component allows to list the ClinVar submission threads in a data table.
-->
<script setup lang="ts">
import { DateTime } from 'luxon'
import { onMounted, ref, watch } from 'vue'

import {
  type SubmissionActivityPage,
  type SubmissionThreadRead,
  type SubmissionThreadStatus,
  VariantPresence
} from '@/api/clinvarsub'
import { ClinvarsubClient } from '@/api/clinvarsub'

/** Interface for this component's props. */
interface Props {
  /** Whether to display links for the variants.s */
  showVariantLinks?: boolean
  /** The primary variant description to list for, if any. */
  primaryVariantDesc?: string
}

/** The component's props. */
const props: Props = withDefaults(defineProps<Props>(), {
  showVariantLinks: false,
  primaryVariantDesc: undefined
})

/** Interface for header; to make type checker happy. */
interface ListHeader {
  title?: string
  value?: string
  align?: 'start' | 'center' | 'end'
}

/** The headers for the data table.*/
const LIST_HEADERS: ListHeader[] = [
  {
    title: 'Variant',
    value: 'primary_variant_desc'
  },
  {
    title: 'Update',
    value: 'updated'
  },
  {
    title: 'SCV',
    value: 'effective_scv'
  },
  {
    title: 'Operation',
    value: 'operation'
  },
  {
    title: 'Status',
    value: 'status'
  }
]

/** Label for different status values. */
const THREAD_STATUS_LABELS: { [key in SubmissionThreadStatus]: string } = {
  initial: 'Submission has been created but not submitted yet.',
  waiting: 'Submission is waiting to be processed.',
  in_progress: 'Work on submission is in progress.',
  success: 'Submission has been processed successfully.',
  failed: 'There was an error in processing the submission.'
}

/** The client to use for retrieving information from clinvarsub API. */
const clinvarsubClient = new ClinvarsubClient()
/** The data read from the API. */
const listItems = ref<SubmissionThreadRead[] | undefined>(undefined)
/** The number of items per page. */
const listItemsPerPage = ref<number>(10)
/** The total number of items on the server. */
const listTotalItems = ref<number>(0)
/** The current page. */
const listPage = ref<number>(1)
/** A mapping from page number to token. */
const listPageToToken = ref<{ [key: number]: string | undefined }>({ 1: undefined })
/** The currently expanded rows. */
const listExpanded = ref<string[]>([])
/** The currently loaded activities by UUID. */
const listActivities = ref<{ [key: string]: any }>({})

/** Load all data. */
const listLoadData = async () => {
  // Reset the items to undefined to show the loading indicator.
  listItems.value = undefined
  listActivities.value = {}
  // Fetch the submitting organisations.
  const submissionThreadsPage = await clinvarsubClient.fetchSubmissionThreads(
    props.primaryVariantDesc,
    listPageToToken.value[listPage.value],
    listItemsPerPage.value
  )
  // Update the items and total items.
  listItems.value = submissionThreadsPage.items
  listTotalItems.value = submissionThreadsPage.total ?? 0
  // Update the page to token mapping for next and previous page.
  if (submissionThreadsPage.previous_page !== null) {
    listPageToToken.value[listPage.value - 1] = submissionThreadsPage.previous_page
  }
  if (submissionThreadsPage.next_page !== null) {
    listPageToToken.value[listPage.value + 1] = submissionThreadsPage.next_page
  }
}

/** Load submission activity data on expansion. */
const listOnExpanded = async (ids: string[]) => {
  // Go through all newly expanded IDs and load the activities.
  for (const id of ids) {
    if (listActivities.value[id]?.length) {
      continue // do not fetch twice
    }
    listActivities.value[id] = []
    let cursor: string | null = null
    let page: SubmissionActivityPage | undefined
    do {
      page = await clinvarsubClient.fetchSubmissionActivities(id, cursor ?? undefined)
      cursor = page.next_page
      listActivities.value[id].push(...page.items)
    } while (cursor)
  }
}

/** Return router "to" for the given variant description. */
const routerVariantTo = (primaryVariantDesc: string) => {
  const strucvarMarkers = ['DEL', 'DUP']
  if (strucvarMarkers.map((marker) => primaryVariantDesc.includes(marker)).includes(true)) {
    // looks like strucvar
    return `/strucvar/${primaryVariantDesc}`
  } else {
    // looks like seqvar
    return `/seqvar/${primaryVariantDesc}`
  }
}

// Load the data on load and change of the `v:model`'s of the v-data-table-server.
onMounted(() => listLoadData())
watch(
  () => [listPage, listItemsPerPage],
  () => listLoadData()
)
</script>

<template>
  <v-data-table-server
    v-model:page="listPage"
    v-model:items-per-page="listItemsPerPage"
    v-model:expanded="listExpanded"
    :headers="LIST_HEADERS"
    :items-length="listTotalItems"
    :items="listItems"
    :loading="listItems === null"
    item-value="id"
    show-expand
    @update:expanded="listOnExpanded"
  >
    <template #[`item.primary_variant_desc`]="{ item }">
      <template v-if="props.showVariantLinks">
        <router-link :to="routerVariantTo(item.primary_variant_desc)">
          {{ item.primary_variant_desc }}
          <small><v-icon>mdi-arrow-right-circle-outline</v-icon></small>
        </router-link>
      </template>
      <template v-else>{{ item.primary_variant_desc }}</template>
    </template>
    <template #[`item.updated`]="{ item }">
      {{ DateTime.fromISO(item.created).toFormat('yyyy-MM-dd HH:mm') }}
    </template>
    <template #[`item.effective_scv`]="{ item }">
      {{ item.effective_scv ?? 'N/A' }}
    </template>
    <template #[`item.operation`]="{ item }">
      <template v-if="item.desired_presence == VariantPresence.Absent"> delete </template>
      <template v-else-if="item.desired_presence == VariantPresence.Present"> create </template>
      <template v-else> update </template>
    </template>
    <template #[`item.status`]="{ item }">
      <abbr :title="THREAD_STATUS_LABELS[item.status]">
        {{ item.status }}
      </abbr>
    </template>

    <template #expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          <v-sheet flat color="background" class="pa-3 mt-3">
            <div class="text-overline">Activities</div>
            <div v-if="!listActivities[item.id]" class="text-center">
              <v-progress-circular indeterminate></v-progress-circular>
            </div>
            <v-table v-else class="bg-background">
              <thead>
                <tr>
                  <th>Kind</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                  <th>Request</th>
                  <th>Payload</th>
                  <th>Response</th>
                  <th>Payload</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="activity in listActivities[item.id]" :key="activity.id">
                  <td>{{ activity.kind }}</td>
                  <td>{{ activity.status }}</td>
                  <td class="text-no-wrap">
                    {{ DateTime.fromISO(activity.created).toFormat('yyyy-MM-dd HH:mm') }}
                  </td>
                  <td v-if="activity.request_timestamp" class="text-no-wrap">
                    {{ DateTime.fromISO(activity.request_timestamp).toFormat('yyyy-MM-dd HH:mm') }}
                  </td>
                  <td v-else class="text-grey-darken-2">N/A</td>
                  <td v-if="activity.request_payload">{{ activity.request_payload }}</td>
                  <td v-else class="text-grey-darken-2">N/A</td>
                  <td v-if="activity.response_timestamp" class="text-no-wrap">
                    {{ DateTime.fromISO(activity.response_timestamp).toFormat('yyyy-MM-dd HH:mm') }}
                  </td>
                  <td v-else class="text-grey-darken-2">N/A</td>
                  <td v-if="activity.response_payload">{{ activity.response_payload }}</td>
                  <td v-else class="text-grey-darken-2">N/A</td>
                </tr>
              </tbody>
            </v-table>
          </v-sheet>
        </td>
      </tr>
    </template>
  </v-data-table-server>
</template>
