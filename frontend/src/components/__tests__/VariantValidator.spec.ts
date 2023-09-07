import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import VariantValidator from '@/components/VariantDetails/VariantValidator.vue'
import * as VariantValidatorInfo from '@/assets/__tests__/BRCA1VariantValidator.json'

const vuetify = createVuetify({
  components,
  directives
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})
// Mock router push
router.push = vi.fn()

const smallVariantInfo = {
  release: 'grch37',
  chromosome: 'chr17',
  start: '43044295',
  end: '43044295',
  reference: 'G',
  alternative: 'A',
  hgnc_id: 'HGNC:1100'
}

const makeWrapper = () => {
  return mount(VariantValidator, {
    props: {
      smallVariant: smallVariantInfo
    },
    global: {
      plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn() })],
      components: {
        VariantValidator
      }
    }
  })
}

describe.concurrent('VariantValidator', async () => {
  it('renders the VariantValidator info', async () => {
    // Mock fetch
    global.fetch = vi.fn((): any =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(VariantValidatorInfo) })
    )
    const wrapper = makeWrapper()
    expect(wrapper.text()).toContain('to submit the variant to VariantValidator.org.')

    const submitButton = wrapper.find('button')
    expect(submitButton.exists()).toBe(true)
    submitButton.trigger('click')
    await nextTick()
    expect(wrapper.text()).toContain('Loading ...')
    const icon = wrapper.find('.v-progress-circular')
    expect(icon.exists()).toBe(true)
    await nextTick()
  })

  it('renders the VariantValidator info with error', async () => {
    // Mock fetch
    global.fetch = vi.fn((): any =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({ foo: 'foo' }) })
    )
    const wrapper = makeWrapper()
    expect(wrapper.text()).toContain('to submit the variant to VariantValidator.org.')

    const submitButton = wrapper.find('button')
    expect(submitButton.exists()).toBe(true)
    submitButton.trigger('click')
    await nextTick()
    expect(wrapper.text()).toContain('Loading ...')
    const icon = wrapper.find('.v-progress-circular')
    expect(icon.exists()).toBe(true)
    await nextTick()
  })
})
