/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
// Components
// Composables
import { createApp, nextTick } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

import App from './App.vue'

async function bootstrap() {
  const app = createApp(App)

  await registerPlugins(app)

  app.mount('#app')
  await nextTick()

  // @ts-ignore
  window._paq.push(['trackPageView'])
  // @ts-ignore
  window._paq.push(['enableLinkTracking'])
  const d = document,
    g = d.createElement('script'),
    s = d.getElementsByTagName('script')[0]
  g.async = true
  g.src = 'https://matomo.charite.de/matomo.js'
  s.parentNode.insertBefore(g, s)
}

bootstrap()
