import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { setupMountedComponents } from '@/lib/test-utils'

import SearchBar from '../SearchBar.vue'

describe.concurrent('SearchBar.vue', () => {
  it('renders the search bar with the correct default props', () => {
    const { wrapper } = setupMountedComponents(
      { component: SearchBar, template: false },
      {
        props: {
          searchTerm: 'BRCA1',
          genomeRelease: 'grch37'
        }
      }
    )

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

  it('correctly inputs data', async () => {
    const { wrapper } = setupMountedComponents(
      { component: SearchBar, template: false },
      {
        props: {
          searchTerm: 'BRCA1',
          genomeRelease: 'grch37'
        }
      }
    )

    const textField = wrapper.find('#search-term') as any
    expect(textField.exists()).toBe(true)
    await textField.setValue('test')
    expect(textField.element.value).toBe('test')

    const select = wrapper.find('#genome-release') as any
    expect(select.exists()).toBe(true)

    const searchButton = wrapper.findComponent('#search') as any
    expect(searchButton.exists()).toBe(true)
    await searchButton.trigger('click')
    await nextTick()
    await searchButton.trigger('click')
    await nextTick()
    expect(wrapper.emitted()).toHaveProperty('click')
    expect(wrapper.emitted('click')).toHaveLength(2)
  })

  it('correctly emits search', async () => {
    const { wrapper } = setupMountedComponents(
      { component: SearchBar, template: false },
      {
        props: {
          searchTerm: 'BRCA1',
          genomeRelease: 'grch37'
        }
      }
    )

    // search bar values are updated
    const searchBar = wrapper.findComponent(SearchBar)
    expect(searchBar.exists()).toBe(true)
    await searchBar.setValue('HGNC:1100', 'searchTerm')
    await searchBar.setValue('grch37', 'genomeRelease')
    expect(searchBar.emitted()).toHaveProperty('update:searchTerm')
    expect(searchBar.emitted()).toHaveProperty('update:genomeRelease')
    const searchButton = searchBar.findComponent('#search') as any
    expect(searchButton.exists()).toBe(true)
    await searchButton.trigger('click')
    await nextTick()
    expect(searchBar.emitted()).toHaveProperty('clickSearch')
  })
})
