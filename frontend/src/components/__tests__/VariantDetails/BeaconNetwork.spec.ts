import { describe, expect, it } from 'vitest'

import BeaconNetwork from '@/components/VariantDetails/BeaconNetwork.vue'
import { setupMountedComponents } from '@/lib/test-utils'

const smallVariantInfo = {
  release: 'grch37',
  chromosome: 'chr17',
  start: '43044295',
  end: '43044295',
  reference: 'G',
  alternative: 'A',
  hgnc_id: 'HGNC:1100'
}

describe.concurrent('BeaconNetwork', async () => {
  it('renders the BeaconNetwork info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: BeaconNetwork, template: false },
      {
        props: {
          smallVariant: smallVariantInfo
        }
      }
    )
    expect(wrapper.text()).toContain('Query Beacon')
    const refreshButton = wrapper.find('.mdi-refresh')
    expect(refreshButton.exists()).toBe(true)
  })

  it('correctly loads the BeaconNetwork info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: BeaconNetwork, template: false },
      {
        props: {
          smallVariant: smallVariantInfo
        }
      }
    )
    const refreshButton = wrapper.find('button')
    await refreshButton.trigger('click')
  })
})
