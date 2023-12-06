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
    primary: '#757ce8',
    secondary: '#3f50b5',
    tertiary: '#002884',
    background: '#eeeeee'
  }
}

const customDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#757ce8',
    secondary: '#3f50b5',
    tertiary: '#002884',
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
  theme: {
    defaultTheme: 'light',
    themes: {
      customLightTheme,
      customDarkTheme
    }
  }
})
