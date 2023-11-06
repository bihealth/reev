import { describe, expect, it } from 'vitest'

import ScoreDisplay from '@/components/VariantDetails/ScoreDisplay.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('ScoreDisplay', async () => {
  it('renders the ScoreDisplay with default props', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ScoreDisplay, template: false },
      {
        props: {
          rangeLower: 0,
          rangeUpper: 1,
          value: 0.5
        }
      }
    )
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
  })
})
