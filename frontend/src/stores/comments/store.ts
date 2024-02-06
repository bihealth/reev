/**
 * Store for information regarding the current user.
 */
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { CommentsClient } from '@/api/comments'
import { Comment, CommentType } from '@/api/comments/types'

export const useCommentsStore = defineStore('comments', () => {
  /* The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The current object type. */
  const objType = ref<CommentType>('gene')

  /** The current object identifier. */
  const objId = ref<string>('')

  /* The comments list for current user and object.. */
  const comments = ref<Comment[]>([])

  /** Initialize the store. */
  const initialize = async (objType$: CommentType, objId$: string, force: boolean = false) => {
    // Do not re-load data if the gene symbol is the same
    if (objType$ === objType.value && objId$ === objId.value && !force) {
      return
    }

    // Clear against artifact
    clearData()

    // And load the data via API.
    await loadComments()
  }

  /** Clear store's data and reset into initial state. */
  const clearData = () => {
    storeState.value = StoreState.Initial
    comments.value = []
    objType.value = 'gene'
    objId.value = ''
  }

  const loadComments = async () => {
    storeState.value = StoreState.Loading
    try {
      const client = new CommentsClient()
      comments.value = await client.fetchComments(objType.value, objId.value)
      storeState.value = StoreState.Active
    } catch (e) {
      storeState.value = StoreState.Error
    }
  }

  const deleteComment = async (obj_type: string, obj_id: string) => {
    storeState.value = StoreState.Loading
    try {
      const client = new CommentsClient()
      await client.deleteComment(obj_type, obj_id)
      await loadComments()
    } catch (e) {
      storeState.value = StoreState.Error
    }
  }

  const createComment = async (obj_type: string, obj_id: string) => {
    storeState.value = StoreState.Loading
    try {
      const client = new CommentsClient()
      await client.createComment(obj_type, obj_id)
      await loadComments()
    } catch (e) {
      storeState.value = StoreState.Error
    }
  }

  const fetchComment = async (obj_type: string, obj_id: string) => {
    try {
      const client = new CommentsClient()
      const response = await client.fetchComment(obj_type, obj_id)
      if (response === null) {
        return null
      } else if (response.detail === 'Unauthorized') {
        storeState.value = StoreState.Error
        return null
      } else {
        return response
      }
    } catch (e) {
      storeState.value = StoreState.Error
      return null
    }
  }

  return {
    storeState,
    comments,
    initialize,
    loadComments,
    createComment,
    fetchComment,
    deleteComment
  }
})
