import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import ExternalResources from '@/components/GeneDetails/OverviewCard/ExternalResources.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('ExternalResources', async () => {
  it('renders the ExternalResources information.', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: ExternalResources },
      {
        props: {
          hgnc: BRCA1GeneInfo['genes']['HGNC:1100']['hgnc']
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('External Resources')
  })
})
