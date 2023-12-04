import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import GeneListEntry from '@/components/StrucvarDetails/GeneListCard/GeneListEntry.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('GeneListEntry', async () => {
  it('renders the GeneListEntry info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: GeneListEntry, template: false },
      {
        props: {
          item: JSON.parse(JSON.stringify({ raw: BRCA1GeneInfo['genes']['HGNC:1100'] })),
          isSelected: false
        }
      }
    )

    expect(wrapper.text()).toContain('BRCA1')
    const dosage = wrapper.findComponent({ name: 'GeneDosage' })
    expect(dosage.exists()).toBe(true)
    const scoreChip = wrapper.findComponent({ name: 'ScoreChip' })
    expect(scoreChip.exists()).toBe(true)
  })
})
