import { describe, expect, it } from 'vitest'
import { VSheet } from 'vuetify/components'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import PathogenicityCard from '@/components/GeneDetails/PathogenicityCard.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('PathogenicityCard', async () => {
  it('renders the Pathogenicity information.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: PathogenicityCard },
      {
        props: {
          geneInfo: BRCA1GeneInfo['genes']['HGNC:1100']
        }
      }
    )
    expect(wrapper.text()).toContain('Gene Pathogenicity')
    expect(wrapper.text()).toContain('Intolerance Constraints and Annotations')

    // Find v-sheet components
    const vSheets = wrapper.findAllComponents(VSheet)
    expect(vSheets.length).toBe(3)
  })
})
