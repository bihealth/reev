import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import VegaPlot from '@/components/VegaPlot.vue'

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

const exampleObject = {
  example: {
    clinvar_id: 'VCV000041833'
  }
}

const makeWrapper = (cvInfo: Object) => {
  return mount(VegaPlot, {
    props: {
      description: 'Example description',
      dataValues: [],
      dataName: 'clinvar',
      encoding: exampleObject,
      params: exampleObject,
      layer: exampleObject,
      width: 500,
      height: 500,
      mark: true,
      renderer: 'canvas',
      transform: []
    },
    global: {
      plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn() })],
      components: { VegaPlot }
    }
  })
}

describe.concurrent('VegaPlot', async () => {
  it.skip('renders the VegaPlot info', async () => {
    const wrapper = makeWrapper(exampleObject)
    console.log(wrapper.html())
  })
})
