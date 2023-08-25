import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      deps: {
        inline: ['vuetify']
      },
      coverage: {
        provider: 'istanbul'
      },
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      transformMode: {
        web: [/\.[jt]sx$/]
      }
    }
  })
)
// "vite-plugin-vuetify": "^1.0.2",

// "vite": "^4.4.9",
// "vitest": "^0.34.3"
