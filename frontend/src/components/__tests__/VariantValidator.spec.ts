import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import VariantValidator from '@/components/VariantDetails/VariantValidator.vue'

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

describe('VariantValidator', async () => {
  it.fails('renders the VariantValidator info', async () => {
    const wrapper = makeWrapper()
    expect(wrapper.text()).toContain('VariantValidator HGVS Version:')
    expect(wrapper.text()).toContain('VariantValidator Version:')
  })
})
