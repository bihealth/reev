<!--
  Display one comment from the props.
-->
<script lang="ts" setup>
import { DateTime } from 'luxon'

import { Comment } from '@/api/comments/types'

/** This component's props. */
const props = defineProps<{
  /** The comment to display. */
  comment?: Comment
}>()
</script>

<template>
  <v-sheet>
    {{ DateTime.fromISO(comment.created).toFormat('yyyy-MM-dd HH:mm') }}<br />
    by {{ comment.user }}<br />
    {{ comment.text }}
  </v-sheet>
</template>
