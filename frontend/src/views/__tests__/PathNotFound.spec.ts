import { describe, expect, it } from 'vitest'

import { setupMountedComponents } from '@/lib/testUtils'

import PathNotFound from '../PathNotFound.vue'

describe.concurrent('PathNotFound', async () => {
  it('renders the main content', async () => {
    const { wrapper } = await setupMountedComponents({ component: PathNotFound })

    const mainContent = wrapper.find('.not-found')
    expect(mainContent.exists()).toBe(true)
    expect(mainContent.html()).toMatch('404 - Page Not Found')
  })
})
