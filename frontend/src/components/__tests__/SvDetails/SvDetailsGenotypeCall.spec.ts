import { describe, expect, it } from 'vitest'

import SvDetailsGenotypeCall from '@/components/SvDetails/SvDetailsGenotypeCall.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('SvDetailsGenotypeCall', async () => {
  it('renders the SvDetailsGenotypeCall info', async () => {
    const { wrapper } = setupMountedComponents(
      { component: SvDetailsGenotypeCall, template: false },
      {
        props: {
          currentSvRecord: {}
        }
      }
    )
    expect(wrapper.exists()).toBe(true)
  })
})
