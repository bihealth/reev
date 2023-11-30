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
].concat(bgDbTracks)
