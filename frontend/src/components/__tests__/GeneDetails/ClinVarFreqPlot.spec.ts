import { describe, expect, it } from 'vitest'

import ClinVarFreqPlot from '@/components/GeneDetails/ClinVarFreqPlot.vue'
import VegaPlot from '@/components/VegaPlot.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('ClinVarFreqPlot', async () => {
  it('renders the ClinVarFreqPlot info', async () => {
    const { wrapper } = setupMountedComponents(
      { component: ClinVarFreqPlot, template: false },
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
    expect(wrapper.text()).toContain('Population frequency of ClinVar variants')

    const vegaPlot = wrapper.findComponent(VegaPlot)
    expect(vegaPlot.exists()).toBe(true)
  })
})