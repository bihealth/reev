import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import GeneRifs from '@/components/GeneDetails/OverviewCard/GeneRifs.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('GeneRifs', async () => {
  it('renders the GeneRifs information.', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: GeneRifs },
      {
        props: {
          ncbi: BRCA1GeneInfo['genes']['HGNC:1100']['ncbi']
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('NCBI References Into Function')
  })
})
