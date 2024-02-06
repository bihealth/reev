import typescript from '@rollup/plugin-typescript'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import ViteFonts from 'unplugin-fonts/vite'
import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(`reev-frontend@${process.env.REEV_VERSION}`)
  },
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    dts({
      insertTypesEntry: true
    }),
    cssInjectedByJsPlugin(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss'
      }
    }),
    ViteFonts({
      google: {
        families: [
          {
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@bihealth/reev-frontend-lib': path.resolve(__dirname, 'src/ext/reev-frontend-lib/src'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: false,
        secure: false
      },
      '/internal': {
        target: 'http://localhost:8080',
        changeOrigin: false,
        secure: false
      },
      '/favicon.ico': {
        target: 'http://localhost:8080',
        changeOrigin: false,
        secure: false
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      plugins: [
        typescript({
          exclude: ['**/*.spec.ts', '**/*.stories.ts', '**/fixture.*.json']
        })
      ]
    }
  }
})
