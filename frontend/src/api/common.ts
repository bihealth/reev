const API_BASE_PREFIX =
  import.meta.env.MODE == 'development' ? '//localhost:8080/proxy/annonars' : '/proxy/annonars'

export { API_BASE_PREFIX }
