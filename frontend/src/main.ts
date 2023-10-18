/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
// Components
// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

import App from './App.vue'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
