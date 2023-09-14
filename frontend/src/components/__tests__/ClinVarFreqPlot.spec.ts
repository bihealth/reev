import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import ClinVarFreqPlot from '@/components/ClinVarFreqPlot.vue'

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
  return mount(ClinVarFreqPlot, {
    props: {
      geneSymbol: 'BRCA1',
      perFreqCounts: [{ coarse_clinsig: 1, counts: [1, 2] }, { coarse_clinsig: 2, counts: [0, 2] }],
    },
    global: {
      plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn() })],
      components: {
        ClinVarFreqPlot
      }
    }
  })
}

describe.concurrent('ClinVarFreqPlot', async () => {
  it('renders the ClinVarFreqPlot info', async () => {
    const wrapper = makeWrapper()
    expect(wrapper.text()).toContain('Population frequency of ClinVar variants')
  })
})
