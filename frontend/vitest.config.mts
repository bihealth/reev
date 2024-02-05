import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'

import viteConfig from './vite.config.mts'

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
        all: true,
        provider: 'istanbul',
        reporter: ['text', 'html', 'clover', 'json'],
        include: ['src/lib/**/*.ts', 'src/stores/**/*.ts', 'src/components/**/*.{vue,ts}'],
        exclude: ['**/*.spec.ts', '**/*.stories.ts']
      },
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*', '**/ext**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      testTransformMode: {
        web: ['**/*.{jsx,tsx}']
      },
      testTimeout: 10000
    }
  }) as typeof viteConfig
)
