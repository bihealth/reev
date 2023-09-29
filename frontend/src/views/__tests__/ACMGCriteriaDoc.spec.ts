import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { routes } from '@/router'

import ACMGCriteriaDocs from '../ACMGCriteriaDocs.vue'

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
      template: '<v-app><ACMGCriteriaDocs /></v-app>'
    },
    {
      global: {
        plugins: [
          vuetify,
          router,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              misc: {
                appVersion: 'v0.0.0'
              }
            }
          })
        ],
        components: {
          ACMGCriteriaDocs
        }
      }
    }
  )
}

describe.concurrent('ACMGCriteriaDocs', async () => {
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

    const mainContent = wrapper.find('.docs-view')
    expect(mainContent.exists()).toBe(true)
    expect(mainContent.html()).toMatch('PVS1')
    expect(mainContent.html()).toMatch('Benign Criteria')
    expect(mainContent.html()).toMatch('BP6')
  })
})
