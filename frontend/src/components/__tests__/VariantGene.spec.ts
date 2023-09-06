import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import VariantGene from '@/components/VariantDetails/VariantGene.vue'
import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'

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
  return mount(VariantGene, {
    props: {
      gene: BRCA1GeneInfo
    },
    global: {
      plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn() })],
      components: {
        VariantGene
      }
    }
  })
}

describe.concurrent('VariantGene', async () => {
  it('renders the VariantGene info', async () => {
    const wrapper = makeWrapper()
    expect(wrapper.text()).toContain('HGNC')
    expect(wrapper.text()).toContain('NCBI Summary')
  })
})
