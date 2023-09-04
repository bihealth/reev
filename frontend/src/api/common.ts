export const API_BASE_PREFIX_ANNONARS =
  import.meta.env.MODE == 'development' ? '//localhost:8080/proxy/annonars' : '/proxy/annonars'

export const API_BASE_PREFIX_MEHARI =
  import.meta.env.MODE == 'development' ? '//localhost:8080/proxy/mehari' : '/proxy/mehari'
