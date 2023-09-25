import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import PathNotFound from '../PathNotFound.vue'

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
      template: '<v-app><PathNotFound /></v-app>'
    },
    {
      global: {
        plugins: [vuetify, router],
        components: {
          PathNotFound
        }
      }
    }
  )
}
describe.concurrent('PathNotFound', async () => {
  it('renders the main content', () => {
    const wrapper = makeWrapper()

    const mainContent = wrapper.find('.not-found')
    expect(mainContent.exists()).toBe(true)
    expect(mainContent.html()).toMatch('404 - Page Not Found')
  })
})
