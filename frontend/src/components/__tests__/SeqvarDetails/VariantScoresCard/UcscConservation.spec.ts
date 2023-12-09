import { describe, expect, it } from 'vitest'

import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import Conservation from '@/components/SeqvarDetails/VariantScoresCard/UcscConservation.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('VariantConservation', async () => {
  it('renders the VariantConservation info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: Conservation, template: false },
      {
        props: {
          varAnnos: BRCA1VariantInfo['result']
        }
      }
    )
    expect(wrapper.text()).toContain('ENST00000309486')
  })
})
