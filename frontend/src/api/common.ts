export const API_BASE_PREFIX = import.meta.env.MODE == 'development' ? '//localhost:8080/internal/' : '/internal/'

export const API_BASE_PREFIX_ANNONARS =
  import.meta.env.MODE == 'development' ? `//localhost:8080/internal/proxy/annonars` : '/internal/proxy/annonars'

export const API_BASE_PREFIX_MEHARI =
  import.meta.env.MODE == 'development' ? '//localhost:8080/internal/proxy/mehari' : '/internal/proxy/mehari'
