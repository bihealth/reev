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
  window._paq.push(['trackPageView'])
}

bootstrap()
