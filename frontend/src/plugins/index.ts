/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */
// Plugins
// Types
import type { App } from 'vue'

import router from '../router'
import pinia from '../stores'
import setupMatomo from './matomo'
import vuetify from './vuetify'

export async function registerPlugins(app: App) {
  app.use(vuetify).use(router).use(pinia)

  // Initialize Matomo
  await setupMatomo(app, router)
}
