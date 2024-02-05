import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import VerifyView from './VerifyEmailView.vue'

// Mock the auth client
vi.mock('@/api/auth', () => {
  return {
    AuthClient: vi.fn().mockImplementation(() => {
      return {
        sendVerifyRequest: vi.fn().mockResolvedValue({
          /* mock resolve value if needed */
        })
      }
    })
  }
})

// Mock the user store
const mockLoadCurrentUser = vi.fn()
vi.mock('@/stores/user', () => {
  return {
    useUserStore: vi.fn().mockImplementation(() => {
      return {
        loadCurrentUser: mockLoadCurrentUser
      }
    })
  }
})

describe.concurrent('VerifyView', async () => {
  beforeEach(() => {
    // We need to disable warnings, which are triggered by the rendering of child components
    const spy = vi.spyOn(console, 'warn')
    spy.mockImplementation(() => {})
  })

  it('calls sendVerifyPost on mount', async () => {
    // arrange:
    const token = 'mock-token'
    const { wrapper, router } = await setupMountedComponents(
      { component: VerifyView },
      {
        query: { token }
      }
    )

    // act: nothing, just wait for flushPromises
    // expect(wrapper.vm.isVerifying).toBe(true)
    await flushPromises() // Wait for all promises to resolve

    // assert:
    expect(mockLoadCurrentUser).toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith('/')
    const progress = wrapper.findComponent({ name: 'VProgressCircular' })
    expect(progress.exists()).toBe(true)
  })

  // Additional test to check the loading state and the final state
  it.skip('renders the waiting message after verification', async () => {
    // arrange:
    // Mock a delay in verification
    vi.useFakeTimers()
    const { wrapper } = await setupMountedComponents(
      { component: VerifyView },
      {
        query: { token: 'mock-token' }
      }
    )

    // act: nothing, just wait for flushPromises
    await vi.runAllTimers()
    await flushPromises()

    // assert:
    const progress = wrapper.findComponent({ name: 'VProgressCircular' })
    expect(progress.exists()).toBe(false)
    const waitingMessage = wrapper.find('div')
    expect(waitingMessage.text()).toContain('Waiting for page load...')
  })
})
