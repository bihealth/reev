import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: 'src/ext/autoacmg/openapi.yaml',
  output: 'src/ext/autoacmg/lib',
  plugins: ['@tanstack/vue-query']
})
