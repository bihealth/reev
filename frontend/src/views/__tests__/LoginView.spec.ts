import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { setupMountedComponents } from '@/lib/test-utils'

import LoginView from '../LoginView.vue'

describe.concurrent('Login view', async () => {
  it('renders the main content', async () => {
    const { wrapper } = await setupMountedComponents({ component: LoginView }, {})

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
    // Mock fetch
    global.fetch = vi.fn((): any =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(JSON.stringify({ status: 200 })) })
    )
    const { wrapper } = await setupMountedComponents({ component: LoginView }, {})

    const emailField = wrapper.find('#email')
    const passwordField = wrapper.find('#password')
    const loginButton = wrapper.find('button[type="button"]')

    await emailField.setValue('example@mail.com')
    await passwordField.setValue('examplePassword')
    await loginButton.trigger('click')
    await nextTick()

    expect(wrapper.emitted('input')).toHaveLength(2)
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('correctly handles error while logging in', async () => {
    // Mock fetch
    global.fetch = vi.fn((): any =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({ foo: 'foo' }) })
    )
    const { wrapper } = await setupMountedComponents({ component: LoginView }, {})

    const emailField = wrapper.find('#email')
    const passwordField = wrapper.find('#password')
    const loginButton = wrapper.find('button[type="button"]')

    await emailField.setValue('invalid')
    await passwordField.setValue('')
    await loginButton.trigger('click')
    await nextTick()

    expect(wrapper.emitted('input')).toHaveLength(2)
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
