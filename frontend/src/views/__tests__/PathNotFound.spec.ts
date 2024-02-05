import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { describe, expect, it } from 'vitest'

import PathNotFound from '@/views/PathNotFound.vue'

describe.concurrent('PathNotFound', async () => {
  it('renders the main content', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents({ component: PathNotFound })

    // act: nothing, only test rendering

    // assert:
    const mainContent = wrapper.find('.not-found')
    expect(mainContent.exists()).toBe(true)
    expect(mainContent.html()).toMatch('404 - Page Not Found')
  })
})
