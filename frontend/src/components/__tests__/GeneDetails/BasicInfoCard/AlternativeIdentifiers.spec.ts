import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import AlternativeIdentifiers from '@/components/GeneDetails/OverviewCard/AlternativeIdentifiers.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('AlternativeIdentifiers', async () => {
  it('renders the AlternativeIdentifiers information.', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: AlternativeIdentifiers },
      {
        props: {
          hgnc: BRCA1GeneInfo['genes']['HGNC:1100']['hgnc']
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('Alternative Identifiers')
  })
})
