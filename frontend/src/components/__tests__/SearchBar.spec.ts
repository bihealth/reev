import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import SearchBar from '@/components/SearchBar.vue'

describe('SearchBar.vue', () => {
  it('renders the search bar with the correct default props', () => {
    const wrapper = mount(SearchBar)
    const textField = wrapper.find('v-text-field')
    const select = wrapper.find('v-select')
    const searchButton = wrapper.find('v-btn')
    expect(textField.exists()).toBe(true)
    expect(select.exists()).toBe(true)
    expect(searchButton.exists()).toBe(true)
    expect(textField.attributes('label')).toMatch('Enter search term')
    expect(select.attributes('label')).toMatch('Genome Release')
    expect(select.attributes('item-title')).toMatch('label')
    expect(select.attributes('item-value')).toMatch('value')
    expect(select.attributes('model-value')).toMatch('grch37')
    expect(searchButton.text()).toMatch('search')
  })

  it('emits events correctly', () => {
    const wrapper = mount(SearchBar)
    const textField = wrapper.find('v-text-field')
    const select = wrapper.find('v-select')
    const searchButton = wrapper.find('v-btn')

    // Simulate input in the text field and check if event is emitted
    textField.setValue('sample term')
    textField.trigger('input')
    expect(wrapper.emitted('update:searchTerm')).toBeTruthy()
    expect(wrapper.emitted('update:searchTerm')![0][0]).toBe('sample term')

    // Simulate selecting an option in the select component and check if event is emitted
    select.setValue('grch38')
    select.trigger('update:model-value', 'grch38')
    expect(wrapper.emitted('update:genomeRelease')).toBeTruthy()
    expect(wrapper.emitted('update:genomeRelease')![0][0]).toBe('grch38')

    // Simulate clicking the search button and check if event is emitted
    searchButton.trigger('click')
    expect(wrapper.emitted('clickSearch')).toBeTruthy()
    expect(wrapper.emitted('clickSearch')![0][0]).toBe('sample term')
    expect(wrapper.emitted('clickSearch')![0][1]).toBe('grch38')
  })
})
