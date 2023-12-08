import { describe, expect, it } from 'vitest'

import PageHeader from '@/components/PageHeader.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import StaticView from '@/views/StaticView.vue'

describe.concurrent('StaticView', async () => {
  it('renders the about page', async () => {
    const { wrapper } = await setupMountedComponents({ component: StaticView, template: true })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toMatch('About REEV')
  })

  it('renders the header', async () => {
    const { wrapper } = await setupMountedComponents({ component: StaticView, template: true })

    const header = wrapper.findComponent(PageHeader)
    expect(header.exists()).toBe(true)
  })
})
