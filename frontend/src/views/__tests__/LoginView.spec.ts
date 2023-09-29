import { describe, expect, it } from 'vitest'

import { setupMountedComponents } from '@/lib/test-utils'
import LoginView from '@/views/LoginView.vue'

describe.concurrent('Login view', async () => {
  it('renders the main content', () => {
    const { wrapper } = setupMountedComponents({ component: LoginView, template: true }, {})

    expect(wrapper.html()).toMatch('REEV Explains and Evaluates Variants')
    expect(wrapper.html()).toMatch('Account')
    expect(wrapper.html()).toMatch('Password')
  })
})
