import { describe, expect, it } from 'vitest'

import ScoreDisplay from '@/components/SeqvarDetails/VariantScoresCard/ScoreDisplay.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('ScoreDisplay', async () => {
  it('renders the ScoreDisplay with default props', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: ScoreDisplay },
      {
        props: {
          rangeLower: 0,
          rangeUpper: 1,
          value: 0.5
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
  })
})
