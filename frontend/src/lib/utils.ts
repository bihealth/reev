import { type GenomeBuild } from '@bihealth/reev-frontend-lib/lib/genomeBuilds'
import mitt from 'mitt'
import { type RouteLocationNormalizedLoaded, type RouteLocationRaw, type Router } from 'vue-router'

import { type BookmarkData } from '@/stores/bookmarks'

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

/**
 * Helper that returns the `RouteLocationRaw` for the given search term.
 *
 * @param searchTerm The search term to use.
 * @param genomeBuild The genome build to use.
 * @returns The `RouteLocationRaw` to use with a vue-router `Router`.
 */
export const searchTo = (searchTerm: string, genomeBuild: GenomeBuild): RouteLocationRaw => {
  return {
    name: 'query',
    query: {
      q: searchTerm,
      genomeBuild: genomeBuild
    }
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
  router.push(searchTo(searchTerm, genomeBuild))
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
        name: 'gene-details',
        params: { gene: bookmark.obj_id }
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

/** Global pubsub instance. */
export const MITT = mitt()
