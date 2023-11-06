import { describe, expect, it } from 'vitest'

import SvDetailsClinvar from '@/components/SvDetails/SvDetailsClinvar.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('SvDetailsClinvar', async () => {
  it('renders the SvDetailsClinvar info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: SvDetailsClinvar, template: false },
      {}
    )
    expect(wrapper.exists()).toBe(true)
  })
})
