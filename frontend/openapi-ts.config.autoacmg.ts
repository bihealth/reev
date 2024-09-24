import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: 'src/ext/autoacmg-api/openapi.yaml',
  output: 'src/ext/autoacmg-api/src/lib',
  plugins: ['@tanstack/vue-query']
})
