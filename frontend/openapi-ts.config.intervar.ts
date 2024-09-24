import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: 'src/ext/intervar-api/openapi.yaml',
  output: 'src/ext/intervar-api/src/lib',
  plugins: ['@tanstack/vue-query']
})
