import { describe, expect, it } from 'vitest'

import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import VariantConservation from '@/components/VariantDetails/VariantConservation.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('VariantConservation', async () => {
  it('renders the VariantConservation info', async () => {
    const { wrapper } = setupMountedComponents(
      { component: VariantConservation, template: false },
      {
        props: {
          varAnnos: BRCA1VariantInfo['result']
        }
      }
    )
    expect(wrapper.text()).toContain('The following shows UCSC 100 vertebrate conservation.')
  })
})
