<script lang="ts" setup>
import { useCommentsStore } from '@/stores/comments'
import { useUserStore } from '@/stores/user'

import CommentEditor from './CommentEditor.vue'
import CommentListItem from './CommentListItem.vue'
import { ref } from 'vue';

/** Store with the user information, for checking login information. */
const userStore = useUserStore()
/** Store with the comments. */
const commentsStore = useCommentsStore()

/** Store state; text of new comment. */
const newComment = ref<string>('')
/** Store state; whether the comment is submitting */
const commentSubmitting = ref<boolean>(false)
</script>

<template>
  <v-card class="mt-3">
    <v-card-title class="pb-0 pr-2">
      Gene Comments <span class="text-subtitle-1">({{ commentsStore.comments.length }})</span>
    </v-card-title>
    <v-card-subtitle class="text-overline"> Comments from the REEV Community </v-card-subtitle>

    <v-card-text v-if="commentsStore.comments.length == 0">
      <p class="text-center text-grey-darken-2">No comments yet. Be the first to comment!</p>
    </v-card-text>
    <template v-for="comment of commentsStore.comments" :key="comment.id">
      <CommentListItem :comment="comment" />
    </template>

    <v-card-text v-if="!userStore.currentUser">
      <p class="text-center text-grey-darken-2">You can only write comments after logging in.</p>
    </v-card-text>

    <v-card-text v-else>
      <CommentEditor v-model:comment="newComment" :submitting="commentSubmitting" />
    </v-card-text>
  </v-card>
</template>
