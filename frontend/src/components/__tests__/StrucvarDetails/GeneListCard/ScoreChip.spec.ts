import { describe, expect, it } from 'vitest'

import ScoreChip from '@/components/StrucvarDetails/GeneListCard/ScoreChip.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('ScoreChip', async () => {
  it('renders the ScoreChip info with specified link', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: ScoreChip },
      {
        props: {
          value: 0,
          hrefUrl: 'https://example.com'
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('0')
  })

  it('renders the ScoreChip info without link', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: ScoreChip },
      {
        props: {
          value: 0,
          hrefUrl: ''
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('0')
  })
})
