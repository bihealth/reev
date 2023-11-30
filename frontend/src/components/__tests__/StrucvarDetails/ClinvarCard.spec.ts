import { describe, expect, it } from 'vitest'

import ClinvarCard from '@/components/StrucvarDetails/ClinvarCard.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('ClinvarCard', async () => {
  it('renders the ClinvarCard info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ClinvarCard, template: false },
      {}
    )
    expect(wrapper.exists()).toBe(true)
  })
})
