import { describe, expect, it } from 'vitest'
import { VBtn } from 'vuetify/components'

import BeaconNetwork from '@/components/SeqvarDetails/BeaconNetworkCard.vue'
import type { Seqvar } from '@/lib/genomicVars'
import { setupMountedComponents } from '@/lib/test-utils'

const seqvarInfo: Seqvar = {
  genomeBuild: 'grch37',
  chrom: '17',
  pos: 43044295,
  del: 'G',
  ins: 'A',
  userRepr: 'grch37-17-43044295-G-A'
}

describe.concurrent('BeaconNetworkCard', async () => {
  it('renders the BeaconNetwork info without iframe', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: BeaconNetwork, template: false },
      {
        props: {
          seqvar: seqvarInfo
        }
      }
    )
    // act: nothing
    // assert:
    // look for the search button
    expect(wrapper.text()).toContain('Query Beacon')
    const refreshButton = wrapper.findComponent(VBtn)
    expect(refreshButton.exists()).toBe(true)
    // no iframe yet
    expect(wrapper.html()).not.toContain('<iframe')
  })

  it('correctly loads the BeaconNetwork iframe', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: BeaconNetwork, template: false },
      {
        props: {
          seqvar: seqvarInfo
        }
      }
    )
    // act:
    const refreshButton = wrapper.findComponent(VBtn)
    await refreshButton.trigger('click')
    await wrapper.vm.$nextTick()
    // assert:
    // look for the search button
    expect(wrapper.text()).not.toContain('Query Beacon')
    expect(refreshButton.exists()).not.toBe(true)
    // iframe after click
    expect(wrapper.html()).toContain('<iframe')
  })
})
