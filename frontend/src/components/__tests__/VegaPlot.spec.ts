import { describe, expect, it } from 'vitest'

import { setupMountedComponents } from '@/lib/testUtils'

import VegaPlot from '../VegaPlot.vue'

/** Example Vega plot data */
const vegaData = [
  {
    tissue: 'Adipose Tissue',
    tissueDetailed: 'Adipose - Subcutaneous',
    lower: 0.2209,
    q1: 1.101,
    median: 1.482,
    q3: 1.9555,
    upper: 4.207
  },
  {
    tissue: 'Adipose Tissue',
    tissueDetailed: 'Adipose - Visceral (Omentum)',
    lower: 0.1854,
    q1: 0.809,
    median: 1.122,
    q3: 1.497,
    upper: 3.968
  }
]

/** Example Vega plot encoding */
const vegaEncoding = {
  x: { field: 'tissueDetailed', type: 'nominal', title: null, axis: { labelAngle: 45 } }
}

/** Example Vega plot layer */
const vegaLayer = [
  {
    mark: { type: 'rule', tooltip: { content: 'data' } },
    encoding: {
      y: { field: 'lower', type: 'quantitative', scale: { zero: false }, title: 'TPM' },
      y2: { field: 'upper' }
    }
  },
  {
    mark: { type: 'bar', size: 14, tooltip: { content: 'data' } },
    encoding: {
      y: { field: 'q1', type: 'quantitative' },
      y2: { field: 'q3' },
      color: { field: 'tissue', type: 'nominal', legend: null }
    }
  },
  {
    mark: { type: 'tick', color: 'white', size: 14, tooltip: { content: 'data' } },
    encoding: { y: { field: 'median', type: 'quantitative' } }
  }
]

describe.concurrent('VegaPlot', async () => {
  // Skipping tests due to error with vega-embed
  // DataCloneError: #<Object> could not be cloned.
  it('renders the VegaPlot info', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: VegaPlot },
      {
        props: {
          description: 'Example description',
          dataValues: vegaData,
          dataName: 'clinvar',
          encoding: vegaEncoding,
          layer: vegaLayer,
          width: 500,
          height: 500,
          mark: true,
          renderer: 'canvas',
          transform: []
        }
      }
    )
    // act: nothing to do

    // assert:
    expect(wrapper.text()).toContain('Save as PNG')
    expect(wrapper.text()).toContain('View Source')
    expect(wrapper.text()).toContain('Open in Vega Editor')
  })
})
