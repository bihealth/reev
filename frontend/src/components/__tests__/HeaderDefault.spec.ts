import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderDefault from '../HeaderDefault.vue'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createRouter, createWebHistory } from 'vue-router'
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

global.ResizeObserver = require('resize-observer-polyfill')

describe('HeaderDefault.vue', () => {
  it('renders the logo and title', () => {
    const wrapper = mount(
      {
        template: '<v-app><HeaderDefault /></v-app>'
      },
      {
        global: {
          plugins: [vuetify, router],
          components: {
            HeaderDefault
          }
        }
      }
    )

    const logo = wrapper.find('#logo')
    const title = wrapper.find('a[href="/"]')
    expect(logo.exists()).toBe(true)
    expect(title.text()).toBe('Explanation and Evaluation of Variants')
  })

  it('renders the navigation links', () => {
    const wrapper = mount(
      {
        template: '<v-app><HeaderDefault /></v-app>'
      },
      {
        global: {
          plugins: [vuetify, router],
          components: {
            HeaderDefault
          }
        }
      }
    )

    const aboutLink = wrapper.find('#about')
    const contactLink = wrapper.find('#contact')
    expect(aboutLink.exists()).toBe(true)
    expect(contactLink.exists()).toBe(true)
  })
})
