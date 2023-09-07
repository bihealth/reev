import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { createTestingPinia } from '@pinia/testing'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import AboutView from '../AboutView.vue'

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
      template: '<v-app><AboutView /></v-app>'
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
          AboutView
        }
      }
    }
  )
}
describe.concurrent('AboutView', async () => {
  it('renders the header', () => {
    const wrapper = makeWrapper()

    const logo = wrapper.find('#logo')
    const aboutLink = wrapper.find('#about')
    const contactLink = wrapper.find('#contact')
    expect(logo.exists()).toBe(true)
    expect(aboutLink.exists()).toBe(true)
    expect(contactLink.exists()).toBe(true)
  })

  it('renders the main content', () => {
    const wrapper = makeWrapper()

    const mainContent = wrapper.find('.about-view')
    expect(mainContent.exists()).toBe(true)
    expect(mainContent.html()).toMatch('REEV: Explanation and Evaluation of Variants')
    expect(mainContent.html()).toMatch('ClinVar is a freely accessible, public archive')
    expect(mainContent.html()).toMatch('Coral emoji from OpenMoji')
  })
})
