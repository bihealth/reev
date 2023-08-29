import { nextTick } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import SearchBar from '../SearchBar.vue'

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

const makeWrapper = () => {
  return mount(
    {
      template: '<v-app><SearchBar /></v-app>'
    },
    {
      global: {
        plugins: [vuetify, router],
        components: {
          SearchBar
        }
      }
    }
  )
}

describe('SearchBar.vue', () => {
  it("xx", async () => {
    const wrapper = makeWrapper()
    const searchBar = wrapper.findComponent(SearchBar)
    await searchBar.setValue("HGNC:1100", "searchTerm")
    await searchBar.setValue("grch37", "genomeRelease")
    await nextTick()
  })

  it('renders the search bar with the correct default props', () => {
    const wrapper = makeWrapper()

    const textField = wrapper.find('.v-text-field')
    const select = wrapper.find('.v-select')
    const searchButton = wrapper.find('#search')
    expect(textField.exists()).toBe(true)
    expect(select.exists()).toBe(true)
    expect(searchButton.exists()).toBe(true)
    expect(textField.html()).toMatch('Enter search term')
    expect(select.html()).toMatch('Genome Release')
    expect(select.html()).toMatch('label')
    expect(select.html()).toMatch('value')
    expect(select.html()).toMatch('GRCh37')
    expect(searchButton.html()).toMatch('search')
  })

  it('correctly emits the search event', async () => {
    const wrapper = makeWrapper()

    const textField = wrapper.find('input[type="text"]') as any
    expect(textField.exists()).toBe(true)
    await textField.setValue('test')
    expect(textField.element.value).toBe('test')

    const select = wrapper.find('#input-2') as any
    expect(select.exists()).toBe(true)

    const searchButton = wrapper.find('#search') as any
    expect(searchButton.exists()).toBe(true)
    await searchButton.trigger('click')
    await searchButton.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
    expect(wrapper.emitted('click')).toHaveLength(2)
  })
})
