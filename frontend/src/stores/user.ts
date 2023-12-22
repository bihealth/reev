/**
 * Store for information regarding the current user.
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { AuthClient, type OAuth2Provider } from '@/api/auth'
import { UnauthenticatedError, UsersClient } from '@/api/users'
import { MITT } from '@/lib/utils'
import { StoreState } from '@/stores/misc'

/** Definition of "mitt" events emitted by the user store. */
export enum Events {
  /** User logged in; args: none */
  Login = 'userStore.login',
  /** User logged out; args: none */
  Logout = 'userStore.logout'
}

/** Interface for storing OAuth account information. */
export interface OAuthAccount {
  id: string
  oauth_name: string
  account_id: string
  account_email: string
}

/** Interface for the representation of a user. */
export interface UserData {
  id: string
  email: string
  is_active: boolean
  is_superuser: boolean
  is_verified: boolean
  oauth_accounts: OAuthAccount[]
}

export const useUserStore = defineStore('user', () => {
  /* The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /* The available OAuth2 providers. */
  const oauth2Providers = ref<OAuth2Provider[]>([])

  /* The current user, null if none, undefined if not set already */
  const currentUser = ref<UserData | null | undefined>(undefined)

  /* Whether the user is currently authenticated. */
  const isAuthenticated = computed<boolean>(() => {
    return currentUser.value !== null && currentUser.value !== undefined
  })

  // Initialize store, load version
  const initialize = async (force: boolean = false) => {
    if (storeState.value !== StoreState.Initial && !force) {
      return // do not initialize twice
    }

    await Promise.all([loadOAuth2Endpoints(), loadCurrentUser()])
  }

  const loadOAuth2Endpoints = async () => {
    const client = new AuthClient()
    oauth2Providers.value = await client.fetchOAuth2Providers()
  }

  const loadCurrentUser = async () => {
    const oldCurrentUser = currentUser.value
    storeState.value = StoreState.Loading
    try {
      const client = new UsersClient()
      currentUser.value = await client.fetchCurrentUserProfile()

      storeState.value = StoreState.Active
    } catch (e) {
      if (e instanceof UnauthenticatedError) {
        // could not load user, but that's fine
        currentUser.value = null
        storeState.value = StoreState.Active
      } else {
        console.error('There was an error loading the currently loaded user.', e)
        storeState.value = StoreState.Error
      }
    } finally {
      // Emit login/logout events
      if (!oldCurrentUser && currentUser.value) {
        MITT.emit(Events.Login)
      } else if (oldCurrentUser && !currentUser.value) {
        MITT.emit(Events.Logout)
      }
    }
  }

  return {
    storeState,
    oauth2Providers,
    currentUser,
    isAuthenticated,
    loadCurrentUser,
    initialize
  }
})
