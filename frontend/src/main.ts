import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from '@/App.vue'
import router from '@/router'

const app = createApp(App)
const vuetify = createVuetify({
  blueprint: md3,
  components,
  directives
})

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
