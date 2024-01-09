import { describe, expect, it } from 'vitest'

import ClinVarFreqPlot from '@/components/GeneDetails/ClinvarCard/ClinvarFreqPlot.vue'
import VegaPlot from '@/components/VegaPlot.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('ClinVarFreqPlot', async () => {
  it('renders the ClinVarFreqPlot info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ClinVarFreqPlot },
      {
        props: {
          geneSymbol: 'BRCA1',
          perFreqCounts: [
            { coarse_clinsig: 1, counts: [1, 2] },
            { coarse_clinsig: 2, counts: [0, 2] }
          ]
        }
      }
    )
    expect(wrapper.text()).toContain('Impact / Frequency')

    const vegaPlot = wrapper.findComponent(VegaPlot)
    expect(vegaPlot.exists()).toBe(true)
  })
})
