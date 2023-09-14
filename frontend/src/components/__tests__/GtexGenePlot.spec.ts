import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import GtexGenePlotVue from '../GtexGenePlot.vue'

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
  return mount(GtexGenePlotVue, {
    props: {
      geneSymbol: 'BRCA1',
      expressionRecords: [{ tissue: 1, tissue_detailed: 1, tpms: [1, 1] }, { tissue: 1, tissue_detailed: 1, tpms: [1, 1] }],
    },
    global: {
      plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn() })],
      components: {
        GtexGenePlotVue
      }
    }
  })
}

describe.concurrent('GtexGenePlotVue', async () => {
  it('renders the GtexGenePlotVue info', async () => {
    // Disable warinings, because of invalid test data
    console.warn = vi.fn()
    const wrapper = makeWrapper()
    expect(wrapper.text()).toContain('Bulk tissue gene expression')
  })
})
