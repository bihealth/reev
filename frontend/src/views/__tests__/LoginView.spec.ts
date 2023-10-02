import { describe, expect, it, vi } from 'vitest'

import createFetchMock from 'vitest-fetch-mock'
import { setupMountedComponents } from '@/lib/test-utils'

import LoginView from '@/views/LoginView.vue'

const fetchMocker = createFetchMock(vi)

describe.concurrent('Login view', async () => {
  it('renders the main content', () => {
    const { wrapper } = setupMountedComponents({ component: LoginView, template: true }, {})

    expect(wrapper.html()).toMatch('REEV Explains and Evaluates Variants')
    
    // Form fields
    expect(wrapper.html()).toMatch('Account')
    const emailField = wrapper.find('#email')
    expect(emailField.exists()).toBe(true)
    expect(wrapper.html()).toMatch('Password')
    const passwordField = wrapper.find('#password')
    expect(passwordField.exists()).toBe(true)

    // Buttons
    const backButton = wrapper.find('a[href="/"]')
    expect(backButton.text()).toMatch('Back')
    const loginButton = wrapper.find('button[type="button"]')
    expect(loginButton.text()).toMatch('Log In')
  })

  it('emits login event when login button is clicked', async () => {
    // fetchMocker.mockResponse(JSON.stringify({ status: 200 }))
    fetchMocker.mockResponse(JSON.stringify({ detail: 'Unauthenticated' }), { status: 401 })
    const { wrapper } = setupMountedComponents({ component: LoginView, template: true }, {})

    const emailField = wrapper.find('#email')
    const passwordField = wrapper.find('#password')
    const loginButton = wrapper.find('button[type="button"]')

    await emailField.setValue('example@mail.com')
    await passwordField.setValue('examplePassword')
    await loginButton.trigger('click')
  })
})
