import { describe, expect, it } from 'vitest'

import { setupMountedComponents } from '@/lib/test-utils'
import { type BookmarkData } from '@/stores/bookmarks'

import BookmarkButton from '../BookmarkButton.vue'

const exampleBookmark: BookmarkData = {
  user: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
  obj_type: 'seqvar',
  obj_id: 'HGNC:1100',
  id: '2c0a153e-5e8c-11ee-8c99-0242ac120001'
}

describe.concurrent('BookmarkButton.vue', () => {
  it('renders information', () => {
    const { wrapper } = setupMountedComponents(
      { component: BookmarkButton, template: false },
      {
        initialStoreState: {
          bookmarks: {
            bookmarks: [exampleBookmark]
          }
        },
        props: {
          type: 'seqvar',
          id: 'HGNC:1100'
        }
      }
    )
    expect(wrapper.text()).toContain('Bookmark this')
  })
})
