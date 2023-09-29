import { describe, expect, it, vi } from 'vitest'

import { setupMountedComponents } from '@/lib/test-utils'

import GtexGenePlotVue from '../GtexGenePlot.vue'

describe.concurrent('GtexGenePlotVue', async () => {
  it('renders the GtexGenePlotVue info', async () => {
    // Disable warinings, because of invalid test data
    console.warn = vi.fn()
    const { wrapper } = setupMountedComponents(
      { component: GtexGenePlotVue, template: false },
      {
        props: {
          geneSymbol: 'BRCA1',
          expressionRecords: [
            { tissue: 1, tissue_detailed: 1, tpms: [1, 1] },
            { tissue: 1, tissue_detailed: 1, tpms: [1, 1] }
          ]
        }
      }
    )
    expect(wrapper.text()).toContain('Bulk tissue gene expression')
  })
})
