import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import VariantConservation from '@/components/VariantDetails/VariantConservation.vue'
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
  return mount(VariantConservation, {
    props: {
      varAnnos: BRCA1VariantInfo['result']
    },
    global: {
      plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn })],
      components: {
        VariantConservation
      }
    }
  })
}

describe.concurrent('VariantConservation', async () => {
  it('renders the VariantConservation info', async () => {
    const wrapper = makeWrapper()
    expect(wrapper.text()).toContain('The following shows UCSC 100 vertebrate conservation.')
  })
})
