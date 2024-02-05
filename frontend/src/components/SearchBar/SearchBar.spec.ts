import { DottyClient } from '@bihealth/reev-frontend-lib/api/dotty'
import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import SearchBar from './SearchBar.vue'

describe.concurrent('SearchBar.vue', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the search bar with the correct default props', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: SearchBar },
      {
        props: {
          searchTerm: 'BRCA1',
          genomeRelease: 'grch37'
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
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
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: SearchBar },
      {
        props: {
          searchTerm: 'BRCA1',
          genomeRelease: 'grch37'
        }
      }
    )

    // act:
    const textField = wrapper.find('.search-term input') as any
    expect(textField.exists()).toBe(true)
    await textField.setValue('test')
    expect(textField.element.value).toBe('test')

    // assert:
    const select = wrapper.find('.genome-release-menu') as any
    expect(select.exists()).toBe(true)
    const genomeReleaseMenu = wrapper.findComponent('.genome-release-menu') as any
    expect(genomeReleaseMenu.exists()).toBe(true)
  })

  it('correctly emits search', async () => {
    // arrange:
    // we make `DottyClient.toSpdi` return null / fail
    vi.spyOn(DottyClient.prototype, 'toSpdi').mockResolvedValue(null)

    const { wrapper } = await setupMountedComponents(
      { component: SearchBar },
      {
        props: {
          searchTerm: 'BRCA1',
          genomeRelease: 'grch37'
        }
      }
    )

    // act:
    // search bar values are updated
    const searchBar = wrapper.findComponent(SearchBar)
    expect(searchBar.exists()).toBe(true)
    await searchBar.setValue('HGNC:1100', 'searchTerm')
    await searchBar.setValue('grch37', 'genomeRelease')

    // assert:
    expect(searchBar.emitted()).toHaveProperty('update:searchTerm')
    expect(searchBar.emitted()).toHaveProperty('update:genomeRelease')
  })

  it('correctly clicks search button', async () => {
    // arrange:
    // we make `DottyClient.toSpdi` return null / fail
    vi.spyOn(DottyClient.prototype, 'toSpdi').mockResolvedValue(null)

    const { wrapper } = await setupMountedComponents(
      { component: SearchBar },
      {
        props: {
          searchTerm: 'BRCA1',
          genomeRelease: 'grch37'
        }
      }
    )

    // act:
    const searchBar = wrapper.findComponent(SearchBar)
    const searchButton = searchBar.findComponent('button.start-search') as any
    expect(searchButton.exists()).toBe(true)
    await searchButton.trigger('click')
    await nextTick()

    // assert:
    expect(searchBar.emitted()).toHaveProperty('clickSearch')
  })
})
