import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { routes } from '@/router'

import HeaderDefault from '../HeaderDefault.vue'

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
      template: '<v-app><HeaderDefault /></v-app>'
    },
    {
      global: {
        plugins: [
          vuetify,
          router,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: {
                currentUser: null
              }
            }
          })
        ],
        components: {
          HeaderDefault
        }
      }
    }
  )
}

describe.concurrent('HeaderDefault.vue', () => {
  it('renders the logo and title', () => {
    const wrapper = makeWrapper()

    const logo = wrapper.find('#logo')
    const title = wrapper.find('a[href="/"]')
    expect(logo.exists()).toBe(true)
    expect(title.text()).toBe('REEV: Explanation and Evaluation of Variants')
  })

  it('renders the navigation links', () => {
    const wrapper = makeWrapper()

    const aboutLink = wrapper.find('#about')
    const contactLink = wrapper.find('#contact')
    expect(aboutLink.exists()).toBe(true)
    expect(contactLink.exists()).toBe(true)
  })
})
