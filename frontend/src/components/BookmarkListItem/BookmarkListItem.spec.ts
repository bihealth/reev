import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { describe, expect, it } from 'vitest'

import BookmarkListItem from './BookmarkListItem.vue'

describe.concurrent('BookmarkListItem.vue', () => {
  it('renders information with StoreState Active', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: BookmarkListItem },
      {
        props: {
          type: 'seqvar',
          id: 'HGNC:1100'
        },
        initialStoreState: {
          bookmarks: {
            bookmarks: [
              {
                user: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
                obj_type: 'seqvar',
                obj_id: 'HGNC:1100',
                id: '2c0a153e-5e8c-11ee-8c99-0242ac120001'
              }
            ],
            storeState: StoreState.Active
          }
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('Bookmark')
    expect(wrapper.text()).not.toContain('Bookmark available after login')
  })

  it('renders information with StoreState Error', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: BookmarkListItem },
      {
        props: {
          type: 'seqvar',
          id: 'HGNC:1100'
        },
        initialStoreState: {
          bookmarks: {
            bookmarks: [
              {
                user: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
                obj_type: 'seqvar',
                obj_id: 'HGNC:1100',
                id: '2c0a153e-5e8c-11ee-8c99-0242ac120001'
              }
            ],
            storeState: StoreState.Error
          }
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('Bookmarks available after login')
  })
})
