import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import * as VariantValidatorInfo from '@/assets/__tests__/BRCA1VariantValidator.json'
import VariantValidator from '@/components/SeqvarDetails/VariantValidatorCard.vue'
import type { Seqvar } from '@/lib/genomicVars'
import { setupMountedComponents } from '@/lib/test-utils'

const seqvarInfo: Seqvar = {
  genomeBuild: 'grch37',
  chrom: '17',
  pos: 43044295,
  del: 'G',
  ins: 'A',
  userRepr: 'grch37-17-43044295-G-A'
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
          seqvar: structuredClone(seqvarInfo)
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
          seqvar: structuredClone(seqvarInfo)
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

  it('renders the VariantValidator info with empty data', async () => {
    // Mock fetch
    global.fetch = vi.fn((): any =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ foo: 'foo' }) })
    )
    const { wrapper } = await setupMountedComponents(
      { component: VariantValidator, template: false },
      {
        props: {
          seqvar: structuredClone(seqvarInfo)
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
