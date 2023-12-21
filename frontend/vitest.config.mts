import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      setupFiles: ['./src/vitest.setup.ts'],
      server: {
        deps: {
          inline: ['vuetify', 'vitest-canvas-mock']
        }
      },
      coverage: {
        provider: 'istanbul'
      },
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      transformMode: {
        web: [/\.[jt]sx$/]
      },
      testTimeout: 10000
    }
  }) as typeof viteConfig
)
