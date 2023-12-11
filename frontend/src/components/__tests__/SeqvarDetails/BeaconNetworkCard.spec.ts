import { describe, expect, it } from 'vitest'

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

describe.concurrent('BeaconNetwork', async () => {
  it('renders the BeaconNetwork info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: BeaconNetwork, template: false },
      {
        props: {
          seqvar: seqvarInfo
        }
      }
    )
    expect(wrapper.text()).toContain('Query Beacon')
    const refreshButton = wrapper.find('.mdi-cloud-search')
    expect(refreshButton.exists()).toBe(true)
  })

  it('correctly loads the BeaconNetwork info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: BeaconNetwork, template: false },
      {
        props: {
          seqvar: seqvarInfo
        }
      }
    )
    const refreshButton = wrapper.find('button')
    await refreshButton.trigger('click')
  })
})
