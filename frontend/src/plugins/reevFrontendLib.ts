import { urlConfig } from '@bihealth/reev-frontend-lib/lib/urlConfig'

import { annonarsClient, mehariClient, pubtator3Client, vigunoClient } from './heyApi'

export function setupBackendUrls() {
  urlConfig.baseUrlAnnonars = '/internal/proxy/annonars'
  urlConfig.baseUrlMehari = '/internal/proxy/mehari'
  urlConfig.baseUrlViguno = '/internal/proxy/viguno'
  urlConfig.baseUrlNginx = '/internal/proxy/nginx'
  urlConfig.baseUrlPubtator = '/internal/remote/pubtator3-api'
  urlConfig.baseUrlCadaPrio = '/internal/proxy/cada-prio'
  urlConfig.baseUrlDotty = '/internal/proxy/dotty'
  urlConfig.baseUrlVariantValidator = '/internal/remote/variantvalidator'

  annonarsClient.setConfig({
    baseUrl: urlConfig.baseUrlAnnonars
  })
  mehariClient.setConfig({
    baseUrl: urlConfig.baseUrlMehari
  })
  vigunoClient.setConfig({
    baseUrl: urlConfig.baseUrlViguno
  })
  pubtator3Client.setConfig({
    baseUrl: urlConfig.baseUrlPubtator
  })
}
