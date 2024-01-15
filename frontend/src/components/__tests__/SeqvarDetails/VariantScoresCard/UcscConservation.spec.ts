import { describe, expect, it } from 'vitest'

import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import Conservation from '@/components/SeqvarDetails/VariantScoresCard/UcscConservation.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('VariantConservation', async () => {
  it('renders the VariantConservation info', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: Conservation },
      {
        props: {
          varAnnos: BRCA1VariantInfo['result']
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('ENST00000309486')
  })
})
