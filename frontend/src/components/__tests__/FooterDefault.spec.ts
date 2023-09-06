import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { createTestingPinia } from '@pinia/testing'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import FooterDefault from '@/components/FooterDefault.vue'

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
      template: '<v-app><FooterDefault /></v-app>'
    },
    {
      global: {
        plugins: [
          vuetify,
          router,
          createTestingPinia({
            createSpy: vi.fn(),
            initialState: {
              misc: {
                appVersion: 'v0.0.0'
              }
            }
          })
        ],
        components: {
          FooterDefault
        }
      }
    }
  )
}

describe('FooterDefault.vue', () => {
  it('renders information', () => {
    const wrapper = makeWrapper()
    const footer = wrapper.find('footer')
    expect(footer.exists()).toBe(true)
    expect(footer.text()).toContain('REEV: Explanation and Evaluation of Variants')
    expect(footer.text()).toContain('v0.0.0')
  })
})
