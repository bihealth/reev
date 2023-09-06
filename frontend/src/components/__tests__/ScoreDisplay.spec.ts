import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import ScoreDisplay from '@/components/VariantDetails/ScoreDisplay.vue'

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
  return mount(
    {
      template: '<v-app><ScoreDisplay /></v-app>'
    },
    {
      props: {
        rangeLower: 0,
        rangeUpper: 1,
        value: 0.5
      },
      global: {
        plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn() })],
        components: {
          ScoreDisplay
        }
      }
    }
  )
}

describe('ScoreDisplay', async () => {
  it('renders the ScoreDisplay with default props', async () => {
    const wrapper = makeWrapper()
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
  })
})
