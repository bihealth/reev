import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderDefault from '../HeaderDefault.vue'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives
})

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactView from '@/views/ContactView.vue'
import GeneDetailsView from '@/views/GeneDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    },
    {
      path: '/gene/:searchTerm',
      name: 'gene',
      component: GeneDetailsView,
      props: (route) => ({ searchTerm: route.params.searchTerm })
    }
  ]
})

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
    expect(logo.exists()).toBe(true)
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
