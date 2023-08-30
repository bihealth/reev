/**
 * Round `value` to `digits` and return an `<abbr>` tag that has the original value
 * as the `@title` and the rounded value as the inner text.  Optionally add a `label`
 * to the `@title`
 *
 * @param value  The value to use and round.
 * @param digits The number of digits to round to.
 * @param label  The optional label to add.
 */
export const roundIt = (value: number, digits: number = 2, label?: string): string => {
  if (!value) {
    return `<abbr title='${value}'>NaN</abbr>`
  }
  const roundedValue = value.toFixed(digits)
  const useLabel = label ? `${label}: ` : ''
  return `<abbr title="${useLabel}${value}">${roundedValue}</abbr>`
}

/**
 * Take a `searchTerm` and return a route location that can be used to navigate to
 * the correct page.
 *
 * @param searchTerm The search term to use.
 */
export const search = (searchTerm: string) => {
  interface RouteLocationFragment {
    name: string
    params?: any
  }

  type RouteLoctionBuilder = () => RouteLocationFragment

  // We iterate the regexps in the `Map` and will use the route from the
  // first match.
  const SEARCH_REGEXPS: [RegExp, RouteLoctionBuilder][] = [
    [
      /^.*$/,
      (): RouteLocationFragment => ({
        name: 'gene',
        params: {
          searchTerm: searchTerm
        }
      })
    ]
  ]

  for (const [regexp, getRoute] of SEARCH_REGEXPS) {
    if (regexp.test(searchTerm)) {
      const routeLocation = getRoute()
      console.log(`term ${searchTerm} matched ${regexp}, route is`, routeLocation)
      return routeLocation
    }
  }
  return null
}
