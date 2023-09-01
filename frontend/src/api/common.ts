export const API_BASE_PREFIX = import.meta.env.MODE == 'development' ? '//localhost:8080/' : '/'

export const API_PROXY_BASE_PREFIX = `${API_BASE_PREFIX}proxy/`
