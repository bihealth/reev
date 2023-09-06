import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import TxCsq from '@/components/VariantDetails/TxCsq.vue'
import * as BRCA1TxInfo from '@/assets/__tests__/BRCA1TxInfo.json'

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

const makeWrapper = () => {
  return mount(TxCsq, {
    props: {
      txCsq: BRCA1TxInfo
    },
    global: {
      plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn() })],
      components: {
        TxCsq
      }
    }
  })
}

describe('TxCsq', async () => {
  it('renders the TxCsq info', async () => {
    const wrapper = makeWrapper()
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
  })
})
