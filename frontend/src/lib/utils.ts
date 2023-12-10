import { type RouteLocationNormalizedLoaded, type RouteLocationRaw, type Router } from 'vue-router'

import { type GenomeBuild } from '@/lib/genomeBuilds'
import { type Seqvar } from '@/lib/genomicVars'
import { type BookmarkData } from '@/stores/bookmarks'

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
    splitString[0] = arr.filter((s) => s.length).join(separator)
  }
  return splitString.join('.')
}

/**
 * Returns whether the given variant looks mitochondrial.
 *
 * @param seqvar Small variant to check.
 * @returns whether the position is on the mitochondrial genome
 */
export const isVariantMt = (seqvar: Seqvar): boolean => {
  return ['MT', 'M', 'chrMT', 'chrM'].includes(seqvar?.chrom)
}

/**
 * Returns whether the given position is in a homopolymer on the mitochondrial chromosome.
 *
 * @param seqvar Small variant to check.
 * @returns whether the position is in a mitochondrial homopolymer
 */
export const isVariantMtHomopolymer = (seqvar: Seqvar): boolean => {
  if (!seqvar) {
    return false
  }
  const { pos } = seqvar
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
  if (isVariantMt(seqvar)) {
    return positionCheck(pos)
  } else {
    return false
  }
}

/**
 * Removes commas from numbers within a string without affecting words.
 * For example, it'll convert "chr17:41,197,708:T:G" to "chr17:41197708:T:G".
 *
 * @param str Input string possibly containing numbers with commas.
 * @returns Sanitized string with commas removed from numbers.
 */
export function removeCommasFromNumbers(str: string): string {
  return str.replace(/(\d),(?=\d)/g, '$1')
}

/** Helper that scrolls to the given section. */
export const scrollToSection = async (route: RouteLocationNormalizedLoaded) => {
  const sectionId = route.hash.slice(1)
  if (sectionId) {
    const elem = document.getElementById(sectionId)
    elem?.scrollIntoView()
  }
}

/** Helper that launches a search through the router.
 *
 * @param router The {Router} to use.
 * @param searchTerm The search term to use.
 * @param genomeBuild The genome build to use.
 */
export const performSearch = async (
  router: Router,
  searchTerm: string,
  genomeBuild: GenomeBuild
) => {
  router.push({
    name: 'query',
    query: {
      q: searchTerm,
      genomeBuild: genomeBuild
    }
  })
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

export function copy(value: any) {
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

/**
 * Return Vuetify color for the given pathogenicity.
 *
 * @param patho Pathogenicity string
 * @returns Color string
 */
export const classColor = (patho: string) => {
  switch (patho.toLowerCase()) {
    case 'pathogenic':
      return 'red-darken-3'
    case 'likely pathogenic':
      return 'orange-darken-3'
    case 'likely benign':
      return 'green-lighten-3'
    case 'benign':
      return 'green-darken-3'
    default:
      return 'grey-lighten-2'
  }
}

/**
 * Convert a {BoookmarkData} to a route location.
 *
 * @param bookmark Bookmark to convert
 * @returns Route location
 */
export const bookmarkTo = (bookmark: BookmarkData): RouteLocationRaw => {
  switch (bookmark.obj_type) {
    case 'gene':
      return {
        name: 'gene',
        params: { geneId: bookmark.obj_id }
      }
    case 'seqvar':
      return {
        name: 'seqvar-details',
        params: { seqvar: bookmark.obj_id }
      }
    case 'strucvar':
      return {
        name: 'strucvar-details',
        params: { strucvar: bookmark.obj_id }
      }
  }
}

/**
 * Extract MIM disease ID from dbSNFP string
 */
export const extractDbnsfpMimDiseaseId = (id: string) => {
  return id.split('[')[1].split(']', 1)[0].replace('MIM:', '')
}

/**
 * Transforms MIM disease ID from dbNSFP depending on `showTermIds.value`
 */
export const transformDbnsfpMimDiseaseId = (id: string, showTermIds: boolean) => {
  if (showTermIds) {
    return id.replace(']', '] ')
  } else {
    return id.split(']').splice(1).join(']').trim()
  }
}
