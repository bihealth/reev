/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */
// Styles
import '@mdi/font/css/materialdesignicons.css'
// Composables
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDataTable, VDataTableServer, VDataTableVirtual } from 'vuetify/labs/components'
import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  blueprint: md3,
  components: {
    ...components,
    VDataTable,
    VDataTableServer,
    VDataTableVirtual
  },
  directives,
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
          background: '#eeeeee'
        }
      }
    }
  }
})
