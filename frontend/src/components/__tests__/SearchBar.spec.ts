import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { DottyClient } from '@/api/dotty'
import { setupMountedComponents } from '@/lib/test-utils'

import SearchBar from '../SearchBar.vue'

describe.concurrent('SearchBar.vue', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the search bar with the correct default props', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: SearchBar, template: false },
      {
        props: {
          searchTerm: 'BRCA1',
          genomeRelease: 'grch37'
        }
      }
    )

    const textField = wrapper.find('.v-text-field')
    const genomeReleaseMenu = wrapper.find('.genome-release-menu')
    const searchButton = wrapper.find('.start-search')
    expect(textField.exists()).toBe(true)
    expect(genomeReleaseMenu.exists()).toBe(true)
    expect(searchButton.exists()).toBe(true)
    expect(textField.html()).toMatch('Search for variant or gene')
    expect(genomeReleaseMenu.html()).toMatch('GRCh37')
    expect(searchButton.html()).toMatch('search')
  })

  it('correctly inputs data', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: SearchBar, template: false },
      {
        props: {
          searchTerm: 'BRCA1',
          genomeRelease: 'grch37'
        }
      }
    )

    const textField = wrapper.find('.search-term input') as any
    expect(textField.exists()).toBe(true)
    await textField.setValue('test')
    expect(textField.element.value).toBe('test')

    const select = wrapper.find('.genome-release-menu') as any
    expect(select.exists()).toBe(true)

    const genomeReleaseMenu = wrapper.findComponent('.genome-release-menu') as any
    expect(genomeReleaseMenu.exists()).toBe(true)
    await genomeReleaseMenu.trigger('click')
    await nextTick()
  })

  it('correctly emits search', async () => {
    // we make `DottyClient.toSpdi` return null / fail
    vi.spyOn(DottyClient.prototype, 'toSpdi').mockResolvedValue(null)

    const { wrapper } = await setupMountedComponents(
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
    const searchButton = searchBar.findComponent('button.start-search') as any
    expect(searchButton.exists()).toBe(true)
    await searchButton.trigger('click')
    await nextTick()
    expect(searchBar.emitted()).toHaveProperty('clickSearch')
  })
})
