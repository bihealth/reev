import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import PageHeader from '@/components/PageHeader.vue'
import { setupMountedComponents } from '@/lib/testUtils'
import StaticView from '@/views/StaticView.vue'

describe.concurrent('StaticView', async () => {
  it('renders the about page', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents({
      component: StaticView,
      shallow: true,
      stubs: { StaticView: false }
    })

    // act: nothing, just wait for next tick
    await nextTick()

    // assert:
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html()).toContain('<about-view-stub></about-view-stub>')
  })

  it('renders the header', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents({
      component: StaticView,
      shallow: true,
      stubs: { StaticView: false }
    })

    // act: nothing, only test rendering

    // assert:
    const header = wrapper.findComponent(PageHeader)
    expect(header.exists()).toBe(true)
  })
})
