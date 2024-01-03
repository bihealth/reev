import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import SupplementaryList from '@/components/GeneDetails/OverviewCard/SupplementaryList.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('SupplementaryList', async () => {
  it('renders the SupplementaryList information.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: SupplementaryList },
      {
        props: {
          acmgSf: BRCA1GeneInfo['genes']['HGNC:1100']['acmgSf']
        }
      }
    )
    expect(wrapper.text()).toContain('ACMG Supplementary Findings List')
  })
})
