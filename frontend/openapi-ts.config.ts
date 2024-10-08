import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: '../backend/openapi.yaml',
  output: 'src/ext/reev-api/src/lib',
  plugins: ['@tanstack/vue-query']
})
