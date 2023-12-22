import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    '__APP_VERSION__': JSON.stringify(`reev-frontend@${process.env.REEV_VERSION}`)
  },
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    vueJsx(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss'
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
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
    chunkSizeWarningLimit: 1500
  }
})
