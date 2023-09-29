import { API_INTERNAL_BASE_PREFIX_NGINX } from '@/api/common'

const API_BASE_URL = `${API_INTERNAL_BASE_PREFIX_NGINX}/`

const visibilityWindow = 10000000

const hescTadTrack = {
  name: 'hESC TADs',
  sourceType: 'annotation',
  format: 'bed',
  visibilityWindow,
  url: `${API_BASE_URL}grch37/hesc.bed`,
  color: 'gray'
}

const curatedMmsTrack = {
  name: 'Curated MMS',
  sourceType: 'annotation',
  format: 'bed',
  visibilityWindow,
  url: `${API_BASE_URL}grch37/patho-mms.bed`,
  color: 'red'
}

// const clinvarTrack = {
//   name: 'ClinVar SVs',
//   sourceType: 'custom',
//   visibilityWindow,
//   height: 100,
//   displayMode: 'SQUISHED',
//   source: {
//     url: `/svs/worker/clinvar/grch37/?min_pathogenicity=likely-pathogenic&chromosome=$CHR&begin=$START&end=$END`,
//     method: 'GET',
//     contentType: 'application/json',
//     mappings: {
//       chr: 'chromosome',
//       start: 'begin',
//     },
//     queryable: true,
//   },
//   format: 'annotation',
//   colorBy: 'pathogenicity',
//   colorTable: {
//     pathogenic: 'red',
//     'likely-pathogenic': 'orange',
//     uncertain: 'blue',
//     'likely-benign': 'gray',
//     benign: 'light gray',
//   },
// }

const duplicationTrack = {
  name: 'UCSC Segmental Duplications',
  sourceType: 'annotation',
  format: 'bed',
  visibilityWindow,
  url: `${API_BASE_URL}grch37/genomicSuperDups.bed.gz`,
  indexURL: `${API_BASE_URL}grch37/genomicSuperDups.bed.gz.tbi`,
  color: 'black'
}

const repeatsTrack = {
  name: 'UCSC Repeat Masker',
  sourceType: 'annotation',
  format: 'bed',
  visibilityWindow,
  url: `${API_BASE_URL}grch37/rmsk.bed.gz`,
  indexURL: `${API_BASE_URL}grch37/rmsk.bed.gz.tbi`,
  color: 'black'
}

const altTrack = {
  name: 'UCSC Alt Loci Track',
  sourceType: 'annotation',
  format: 'bed',
  visibilityWindow,
  url: `${API_BASE_URL}grch37/altSeqLiftOverPsl.bed.gz`,
  indexURL: `${API_BASE_URL}grch37/altSeqLiftOverPsl.bed.gz.tbi`,
  color: 'black'
}

const fixTrack = {
  name: 'UCSC Fix Track',
  sourceType: 'annotation',
  format: 'bed',
  visibilityWindow,
  url: `${API_BASE_URL}grch37/fixSeqLiftOverPsl.bed.gz`,
  indexURL: `${API_BASE_URL}grch37/fixSeqLiftOverPsl.bed.gz.tbi`,
  color: 'black'
}

const bgDbTracks = [
  // {
  //   title: 'In-House SVs',
  //   token: 'inhouse',
  // },
  {
    title: 'gnomad-SV',
    token: 'gnomad'
  },
  {
    title: 'DGV SVs',
    token: 'dgv'
  },
  {
    title: 'DGV GS SVs',
    token: 'dgv-gs'
  },
  {
    title: 'ExAC CNVs',
    token: 'exac'
  }
].map(({ title, token }) => {
  return {
    name: title,
    sourceType: 'annotation',
    format: 'bed',
    visibilityWindow,
    displayMode: 'SQUISHED',
    url: `${API_BASE_URL}grch37/${token}.bed.gz`,
    indexURL: `${API_BASE_URL}grch37/${token}.bed.gz.tbi`,
    color: 'black'
  }
})
export const publicTracks = [
  duplicationTrack,
  repeatsTrack,
  altTrack,
  fixTrack,
  hescTadTrack,
  curatedMmsTrack
  // clinvarTrack,
].concat(bgDbTracks)

export const genCaseTrack = (caseUuid: string) => ({
  order: -1,
  height: '200',
  name: 'Case SVs',
  sourceType: 'custom',
  visibilityWindow,
  source: {
    url: `/svs/ajax/fetch-variants/${caseUuid}/?chromosome=$CHR&start=$START&end=$END`,
    // url: `https://varfish.bihealth.org/svs/ajax/fetch-variants/7a538a72-f8fb-4d71-a08b-6045f1e983dc/?chromosome=chr15&start=16989370.8&end=26828561.7`,
    method: 'GET',
    contentType: 'application/json',
    mappings: {
      chr: 'chromosome'
    },
    queryable: true
  },
  format: 'annotation',
  colorBy: 'sv_type',
  colorTable: {
    DEL: 'red',
    DUP: 'green',
    INV: 'blue',
    '*': 'black'
  }
})
