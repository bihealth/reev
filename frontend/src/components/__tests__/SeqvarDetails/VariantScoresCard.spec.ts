import { describe, expect, it } from 'vitest'

import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import VariantTools from '@/components/SeqvarDetails/VariantScoresCard.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('VariantTools', async () => {
  it('renders the Variant Tools info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: VariantTools, template: false },
      {
        props: {
          varAnnos: BRCA1VariantInfo['result']
        }
      }
    )
    expect(wrapper.text()).toContain('Scoring Method')
    expect(wrapper.text()).toContain('BayesDel')
  })

  it('renders the Variant Tools info with empty variance information', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: VariantTools, template: false },
      {
        props: {
          varAnnos: undefined
        }
      }
    )
    expect(wrapper.text()).toContain('No UCSC conservation data available.')
  })
})
