import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import VariantConservation from '@/components/VariantDetails/VariantConservation.vue'
import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'

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
      varAnnos: BRCA1VariantInfo
    },
    global: {
      plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn() })],
      components: {
        VariantConservation
      }
    }
  })
}

describe('VariantConservation', async () => {
  it('renders the VariantConservation info', async () => {
    const wrapper = makeWrapper()
    expect(wrapper.text()).toContain('The following shows UCSC 100 vertebrate conservation.')
  })
})
