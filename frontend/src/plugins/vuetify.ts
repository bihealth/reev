/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */
// Styles
import '@mdi/font/css/materialdesignicons.css'
// Composables
import { type ThemeDefinition, createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

const customLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#eeeeee'
  }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  blueprint: md3,
  components: {
    ...components
  },
  directives,
  defaults: {
    global: {
      flat: true
    },
    VCard: {
      rounded: 'lg'
    },
    VSheet: {
      rounded: 'lg'
    }
  },
  theme: {
    defaultTheme: 'customLightTheme',
    themes: {
      customLightTheme
    }
  }
})
