/**
 * plugins/matomo.ts
 *
 * Matomo documentation: https://developer.matomo.org/guides/spa-tracking
 */
import { type App } from 'vue'
import VueMatomo from 'vue-matomo'

import { SettingsClient } from '@/api/settings'

async function setupMatomo(app: App, router: any) {
  try {
    const client = new SettingsClient()
    const response = await client.fetchFrontendSettings()
    if (response['matomo_host'] && response['matomo_site_id']) {
      app.use(VueMatomo, {
        host: response['matomo_host'],
        siteId: response['matomo_site_id'],
        router: router,
        enableLinkTracking: true,
        trackInitialView: true,
        requireConsent: true,
        disableCookies: true
      })
    }
  } catch (error) {
    console.error('Failed to initialize Matomo:', error)
  }
}

export default setupMatomo
