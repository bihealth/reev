import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import * as VariantValidatorInfo from '@/assets/__tests__/BRCA1VariantValidator.json'
import VariantValidator from '@/components/SeqvarDetails/VariantValidatorCard.vue'
import { setupMountedComponents } from '@/lib/test-utils'

const smallVariantInfo = {
  release: 'grch37',
  chromosome: 'chr17',
  start: '43044295',
  end: '43044295',
  reference: 'G',
  alternative: 'A',
  hgnc_id: 'HGNC:1100'
}

describe.concurrent('VariantValidator', async () => {
  it('renders the VariantValidator info', async () => {
    // Mock fetch
    global.fetch = vi.fn((): any =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(VariantValidatorInfo) })
    )
    const { wrapper } = await setupMountedComponents(
      { component: VariantValidator, template: false },
      {
        props: {
          smallVariant: smallVariantInfo
        }
      }
    )
    expect(wrapper.text()).toContain('Retrieve Predictions from VariantValidator.org')

    const submitButton = wrapper.find('button')
    expect(submitButton.exists()).toBe(true)
    submitButton.trigger('click')
    await nextTick()
    expect(wrapper.text()).toContain('Loading...')
    const icon = wrapper.find('.v-progress-circular')
    expect(icon.exists()).toBe(true)
    await nextTick()
  })

  it('renders the VariantValidator info with error', async () => {
    // Mock fetch
    global.fetch = vi.fn((): any =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({ foo: 'foo' }) })
    )
    const { wrapper } = await setupMountedComponents(
      { component: VariantValidator, template: false },
      {
        props: {
          smallVariant: smallVariantInfo
        }
      }
    )
    expect(wrapper.text()).toContain('Retrieve Predictions from VariantValidator.org')

    const submitButton = wrapper.find('button')
    expect(submitButton.exists()).toBe(true)
    submitButton.trigger('click')
    await nextTick()
    expect(wrapper.text()).toContain('Loading...')
    const icon = wrapper.find('.v-progress-circular')
    expect(icon.exists()).toBe(true)
    await nextTick()
  })
})
