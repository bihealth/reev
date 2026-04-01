import { urlConfig } from '@bihealth/reev-frontend-lib/lib/urlConfig'
import 'vitest-canvas-mock'

// Fix undefined ResizeObserver error
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = window.ResizeObserver || ResizeObserverStub

// Define base URLs for API calls in tests.
urlConfig.baseUrlAnnonars = '/internal/proxy/annonars'
urlConfig.baseUrlMehari = '/internal/proxy/mehari'
urlConfig.baseUrlViguno = '/internal/proxy/viguno/api/v1'
urlConfig.baseUrlNginx = '/internal/proxy/nginx'
urlConfig.baseUrlPubtator = '/internal/remote/pubtator3-api'
urlConfig.baseUrlCadaPrio = '/internal/proxy/cada-prio'
urlConfig.baseUrlDotty = '/internal/proxy/dotty'
urlConfig.baseUrlVariantValidator = '/remote/variantvalidator'
