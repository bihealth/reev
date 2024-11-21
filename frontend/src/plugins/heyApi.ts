/** Setup the Hey API clients. */
import { client as annonarsClient } from '@bihealth/reev-frontend-lib/ext/annonars-api/src/lib'
import { client as mehariClient } from '@bihealth/reev-frontend-lib/ext/mehari-api/src/lib'
import { client as pubtator3Client } from '@bihealth/reev-frontend-lib/ext/pubtator3-api/src/lib'
import { client as vigunoClient } from '@bihealth/reev-frontend-lib/ext/viguno-api/src/lib'

export { annonarsClient, mehariClient, vigunoClient, pubtator3Client }

/**
 * Returns the value of a cookie.
 *
 * @param name The name of the cookie.
 * @returns The value of the cookie.
 */
const getCookie = (name: string): string | undefined => {
  const nameLenPlus = name.length + 1
  return (
    document.cookie
      .split(';')
      .map((c) => c.trim())
      .filter((cookie) => {
        return cookie.substring(0, nameLenPlus) === `${name}=`
      })
      .map((cookie) => {
        return decodeURIComponent(cookie.substring(nameLenPlus))
      })[0] || undefined
  )
}

// Ensure the CSRF token is set for all requests.
mehariClient.interceptors.request.use((request, _options) => {
  const csrfToken = getCookie('csrftoken') || ''
  request.headers.set('X-CSRFToken', csrfToken)
  return request
})

// Ensure the CSRF token is set for all requests.
annonarsClient.interceptors.request.use((request, _options) => {
  const csrfToken = getCookie('csrftoken') || ''
  request.headers.set('X-CSRFToken', csrfToken)
  return request
})

// Ensure the CSRF token is set for all requests.
vigunoClient.interceptors.request.use((request, _options) => {
  const csrfToken = getCookie('csrftoken') || ''
  request.headers.set('X-CSRFToken', csrfToken)
  return request
})

// Ensure the CSRF token is set for all requests.
pubtator3Client.interceptors.request.use((request, _options) => {
  const csrfToken = getCookie('csrftoken') || ''
  request.headers.set('X-CSRFToken', csrfToken)
  return request
})
