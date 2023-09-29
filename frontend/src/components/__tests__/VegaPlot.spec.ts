import { describe, it } from 'vitest'

import VegaPlot from '@/components/VegaPlot.vue'
import { setupMountedComponents } from '@/lib/test-utils'

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

const vegaEncoding = {
  x: { field: 'tissueDetailed', type: 'nominal', title: null, axis: { labelAngle: 45 } }
}

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
  it.skip('renders the VegaPlot info', async () => {
    const { wrapper } = setupMountedComponents(
      { component: VegaPlot, template: false },
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
    console.log(wrapper.html())
  })
})
