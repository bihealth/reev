import { DottyClient } from '@/api/dotty'

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
  console.log(value)
  if (!value) {
    return `<abbr title='${value}'>0</abbr>`
  }
  const roundedValue = value.toFixed(digits)
  const useLabel = label ? `${label}: ` : ''
  return `<abbr title="${useLabel}${value}">${roundedValue}</abbr>`
}

/**
 * Converts a number to a string with thousands separator.
 *
 * @param value     The number to separate.
 * @param separator The separator to use.
 */
export const separateIt = (value: number, separator: string = ' '): string => {
  const asString = `${value}`
  if (!asString.length) {
    return '0'
  }
  const splitString = asString.split('.', 1)
  const cardinal = splitString[0]
  if (!cardinal?.length) {
    splitString[0] = '0'
  } else {
    const offset = cardinal.length % 3
    const arr = [cardinal.slice(0, offset)]
    for (let i = 0; i <= cardinal.length; i += 3) {
      arr.push(cardinal.slice(offset + i, offset + i + 3))
    }
    splitString[0] = arr.join(separator)
  }
  return splitString.join('.')
}

/**
 * Returns whether the given variant looks mitochondrial.
 *
 * @param smallVar Small variant to check.
 * @returns whether the position is on the mitochondrial genome
 */
export const isVariantMt = (smallVar: any): boolean => {
  return ['MT', 'M', 'chrMT', 'chrM'].includes(smallVar?.chromosome)
}

/**
 * Returns whether the given position is in a homopolymer on the mitochondrial chromosome.
 *
 * @param smallVar Small variant to check.
 * @returns whether the position is in a mitochondrial homopolymer
 */
export const isVariantMtHomopolymer = (smallVar: any): boolean => {
  if (!smallVar) {
    return false
  }
  const { start, end } = smallVar
  const positionCheck = (pos: number) => {
    return (
      (pos >= 66 && pos <= 71) ||
      (pos >= 300 && pos <= 316) ||
      (pos >= 513 && pos <= 525) ||
      (pos >= 3106 && pos <= 3107) ||
      (pos >= 12418 && pos <= 12425) ||
      (pos >= 16182 && pos <= 16194)
    )
  }
  if (isVariantMt(smallVar)) {
    return positionCheck(start) || positionCheck(end)
  } else {
    return false
  }
}

/**
 * Take a `searchTerm` and return a route location that can be used to navigate to
 * the correct page.
 *
 * @param searchTerm The search term to use.
 * @param genomeRelease The genome release to use.
 */
export const search = async (searchTerm: string, genomeRelease: string) => {
  // Remove leading/trailing whitespace.
  searchTerm = searchTerm.trim()
  if (!searchTerm) {
    return null // no query ;-)
  }

  // First, attempt to resolve using dotty.
  const dottyClient = new DottyClient()
  const result = await dottyClient.toSpdi(searchTerm)
  if (result) {
    const spdi = result.spdi
    searchTerm = `${spdi.contig}:${spdi.pos}:${spdi.reference_deleted}:${spdi.alternate_inserted}`
    if (!searchTerm.startsWith('chr')) {
      searchTerm = `chr${searchTerm}`
    }
    genomeRelease = spdi.assembly.toLowerCase()
  }

  interface RouteLocationFragment {
    name: string
    params?: any
    query?: any
  }

  type RouteLoctionBuilder = () => RouteLocationFragment

  // We iterate the regexps in the `Map` and will use the route from the
  // first match.
  const SEARCH_REGEXPS: [RegExp, RouteLoctionBuilder][] = [
    [
      /^HGNC:\d+$/,
      (): RouteLocationFragment => ({
        name: 'gene',
        params: {
          searchTerm: searchTerm,
          genomeRelease: genomeRelease
        }
      })
    ],
    [
      /^chr\d+:\d+:[ACGT]{1,50}:[ACGT]{1,50}$/,
      (): RouteLocationFragment => ({
        name: 'variant',
        params: {
          searchTerm: searchTerm,
          genomeRelease: genomeRelease
        }
      })
    ],
    [
      /^(?:DEL|DUP):chr\d+:\d+:\d+$/,
      (): RouteLocationFragment => ({
        name: 'cnv',
        params: {
          searchTerm: searchTerm,
          genomeRelease: genomeRelease
        }
      })
    ],
    [
      /^.*$/,
      (): RouteLocationFragment => ({
        name: 'genes',
        query: {
          q: searchTerm,
          fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol'
        }
      })
    ]
  ]

  for (const [regexp, getRoute] of SEARCH_REGEXPS) {
    if (regexp.test(searchTerm)) {
      const routeLocation = getRoute()
      // console.log(`term ${searchTerm} matched ${regexp}, route is`, routeLocation)
      return routeLocation
    }
  }
}

/**
 * Return an object with the chromosome, pos, reference and
 * alternative values from the given query string.
 *
 * @param query Incoming query string
 */
export const infoFromQuery = (query: string): any => {
  const [chromosome, pos, reference, alternative, hgnc_id] = query.split(':')
  return {
    chromosome: chromosome,
    pos: pos,
    reference: reference,
    alternative: alternative,
    hgnc_id: hgnc_id
  }
}

/**
 * Return an object with the chromosome, start, end and sv_type
 * values from the given query string.
 *
 * @param query Incoming query string
 */
export const infoFromSvQuery = (query: string): any => {
  const [sv_type, chromosome, start, end] = query.split(':')
  return {
    svType: sv_type,
    chromosome: chromosome,
    start: start,
    end: end
  }
}

export function copy(value: Object) {
  return JSON.parse(JSON.stringify(value))
}

/**
 * Convert sample name to its display name.
 *
 * Basically, this is only needed for output of the SNAPPY Pipeline.
 *
 * @param name The sample name to format.
 * @returns Sample name ready for display.
 */
export function displayName(name: string): string {
  if (name) {
    const re = /-N\d+-(DNA|RNA)\d+-(WES|WGS|Panel_seq)\d+$/
    return name.replace(re, '')
  } else {
    return name
  }
}
