import { urlConfig } from '@bihealth/reev-frontend-lib/lib/urlConfig'

export function setupBackendUrls() {
  urlConfig.baseUrlAnnonars = '/internal/proxy/annonars'
  urlConfig.baseUrlMehari = '/internal/proxy/mehari'
  urlConfig.baseUrlViguno = '/internal/proxy/viguno'
  urlConfig.baseUrlNginx = '/internal/proxy/nginx'
  urlConfig.baseUrlPubtator = '/internal/remote/pubtator3-api'
  urlConfig.baseUrlLitVar = '/internal/remote/litvar'
  urlConfig.baseUrlCadaPrio = '/internal/proxy/cada-prio'
  urlConfig.baseUrlDotty = '/internal/proxy/dotty'
  urlConfig.baseUrlVariantValidator = '/internal/remote/variantvalidator'
}
