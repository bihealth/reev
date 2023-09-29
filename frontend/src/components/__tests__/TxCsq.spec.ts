import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import * as BRCA1TxInfo from '@/assets/__tests__/BRCA1TxInfo.json'
import TxCsq from '@/components/VariantDetails/TxCsq.vue'
import { routes } from '@/router'

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
      plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn })],
      components: {
        TxCsq
      }
    }
  })
}

describe.concurrent('TxCsq', async () => {
  it('renders the TxCsq info', async () => {
    const wrapper = makeWrapper()
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
  })
})
