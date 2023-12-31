import { describe, expect, it, vi } from 'vitest'

import GtexGenePlotVue from '@/components/GeneDetails/ExpressionCard.vue'
import VegaPlot from '@/components/VegaPlot.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('GtexGenePlotVue', async () => {
  it('renders the GtexGenePlotVue info', async () => {
    // Disable warinings, because of invalid test data
    console.warn = vi.fn()
    const { wrapper } = await setupMountedComponents(
      { component: GtexGenePlotVue },
      {
        props: {
          geneSymbol: 'BRCA1',
          expressionRecords: [
            { tissue: 1, tissue_detailed: 1, tpms: [1, 1] },
            { tissue: 1, tissue_detailed: 1, tpms: [1, 1] }
          ],
          ensemblGeneId: 'ENSG00000012048'
        }
      }
    )

    expect(wrapper.text()).toContain('Tissue-Specific Gene Expression from GTeX')
    const vegaPlot = wrapper.findComponent(VegaPlot)
    expect(vegaPlot.exists()).toBe(true)

    // Find gtex linkout
    const gtexLink = wrapper.find('#expression-card-gtex-portal')
    expect(gtexLink.exists()).toBe(true)
    expect(gtexLink.attributes('href')).toBe('https://gtexportal.org/home/gene/ENSG00000012048')
  })
})
