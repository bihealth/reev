import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { StoreState } from '../misc'
import { type UserData, useUserStore } from '../user'

const fetchMocker = createFetchMock(vi)

describe.concurrent('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should have initial state', () => {
    const store = useUserStore()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.currentUser).toBe(undefined)
    expect(store.isAuthenticated).toBe(false)
  })

  it('should load current user', async () => {
    const mockUser: UserData = {
      id: '1',
      email: 'test@example.com',
      is_active: true,
      is_superuser: false,
      is_verified: true,
      oauth_accounts: []
    }

    const store = useUserStore()
    fetchMocker.mockResponse(JSON.stringify(mockUser))

    await store.loadCurrentUser()

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.currentUser).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  it('should handle unauthenticated error when loading current user', async () => {
    const store = useUserStore()
    fetchMocker.mockResponse(JSON.stringify({ detail: 'Unauthenticated' }), { status: 401 })

    await store.loadCurrentUser()

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.currentUser).toBe(null)
    expect(store.isAuthenticated).toBe(false)
  })

  it('should handle other errors when loading current user', async () => {
    const store = useUserStore()
    fetchMocker.mockResponse(JSON.stringify({ detail: 'Internal Server Error' }), { status: 500 })

    await store.loadCurrentUser()

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.currentUser).toBe(null)
    expect(store.isAuthenticated).toBe(false)
  })

  it('should initialize store', async () => {
    const mockUser: UserData = {
      id: '1',
      email: 'test@example.com',
      is_active: true,
      is_superuser: false,
      is_verified: true,
      oauth_accounts: []
    }

    const store = useUserStore()
    fetchMocker.mockResponse(JSON.stringify(mockUser))

    await store.initialize()

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.currentUser).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  it('should not initialize store twice', async () => {
    const mockUser: UserData = {
      id: '1',
      email: 'test@example.com',
      is_active: true,
      is_superuser: false,
      is_verified: true,
      oauth_accounts: []
    }

    const store = useUserStore()
    fetchMocker.mockResponse(JSON.stringify(mockUser))

    await store.initialize()
    const initialState = { ...store }

    await store.initialize()

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.currentUser).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
    expect(store).toEqual(initialState)
  })
})
