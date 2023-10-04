import '@mdi/font/css/materialdesignicons.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDataTable, VDataTableServer, VDataTableVirtual } from 'vuetify/labs/components'
import 'vuetify/styles'

import App from '@/App.vue'
import router from '@/router'

import './assets/main.css'

const app = createApp(App)

const LightTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#E55540',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00'
  }
}

const vuetify = createVuetify({
  blueprint: md3,
  components: {
    ...components,
    VDataTable,
    VDataTableServer,
    VDataTableVirtual
  },
  directives,
  theme: {
    defaultTheme: 'LightTheme',
    themes: { LightTheme }
  }
})

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
