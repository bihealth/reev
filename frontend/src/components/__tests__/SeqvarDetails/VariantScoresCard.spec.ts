import { describe, expect, it } from 'vitest'

import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import VariantTools from '@/components/SeqvarDetails/VariantScoresCard.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('VariantTools', async () => {
  it('renders the Variant Tools info', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: VariantTools },
      {
        props: {
          varAnnos: BRCA1VariantInfo['result']
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('Scoring Method')
    expect(wrapper.text()).toContain('BayesDel')
  })

  it('renders the Variant Tools info with empty variance information', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: VariantTools },
      {
        props: {
          varAnnos: undefined
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('No UCSC conservation data available.')
  })
})
