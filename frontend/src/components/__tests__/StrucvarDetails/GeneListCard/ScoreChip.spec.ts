import { describe, expect, it } from 'vitest'

import ScoreChip from '@/components/StrucvarDetails/GeneListCard/ScoreChip.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('ScoreChip', async () => {
  it('renders the ScoreChip info with specified link', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ScoreChip, template: false },
      {
        props: {
          value: 0,
          hrefUrl: 'https://example.com'
        }
      }
    )

    expect(wrapper.text()).toContain('0')
  })

  it('renders the ScoreChip info without link', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ScoreChip, template: false },
      {
        props: {
          value: 0,
          hrefUrl: ''
        }
      }
    )

    expect(wrapper.text()).toContain('0')
  })
})
