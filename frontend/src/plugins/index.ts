/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */
// Plugins
// Types
import type { App } from 'vue'

import router from '../router'
import { setupMatomo } from './matomo'
import pinia from './pinia'
import { setupBackendUrls } from './reevFrontendLib'
import { setupSentry } from './sentry'
import vuetify from './vuetify'

export async function registerPlugins(app: App) {
  setupBackendUrls()

  app.use(vuetify).use(router).use(pinia)

  // Initialize Matomo and Sentry
  await Promise.all([setupMatomo(app, router), setupSentry(app, router)])
}
