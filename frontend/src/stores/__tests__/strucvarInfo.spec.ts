import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import * as geneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import type { Strucvar } from '@/lib/genomicVars'
import { StoreState } from '@/stores/misc'
import { useStrucvarInfoStore } from '@/stores/strucvarInfo'

const fetchMocker = createFetchMock(vi)

/** Example Structure Variant */
const strucvarInfo: Strucvar = {
  genomeBuild: 'grch37',
  svType: 'DEL',
  chrom: '17',
  start: 41176312,
  stop: 41277500,
  userRepr: 'DEL-grch37-17-41176312-41277500'
}

describe.concurrent('svInfo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should have initial state', () => {
    // arrange:
    const store = useStrucvarInfoStore()

    // act: nothing to do

    // assert:
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.strucvar).toBe(undefined)
    expect(store.genesInfos).toStrictEqual(undefined)
  })

  it('should clear state', () => {
    // arrange:
    const store = useStrucvarInfoStore()
    store.storeState = StoreState.Active
    store.strucvar = structuredClone(strucvarInfo)
    store.genesInfos = JSON.parse(JSON.stringify([geneInfo['genes']['HGNC:1100']]))

    // act:
    store.clearData()

    // assert:
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.strucvar).toBe(undefined)
    expect(store.genesInfos).toStrictEqual(undefined)
  })

  it('should load data', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('csq')) {
        return Promise.resolve(JSON.stringify({ result: [{ hgnc_id: 'HGNC:1100' }] }))
      } else {
        return Promise.resolve(JSON.stringify(geneInfo))
      }
    })
    const store = useStrucvarInfoStore()

    // act:
    await store.loadData(structuredClone(strucvarInfo))

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.strucvar).toStrictEqual(strucvarInfo)
    expect(store.genesInfos).toStrictEqual([geneInfo['genes']['HGNC:1100']])
  })

  it('should correctly handle errors', async () => {
    // arrange:
    // Disable console.error
    const spy = vi.spyOn(console, 'error')
    spy.mockImplementation(() => {})
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('csq')) {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })
    const store = useStrucvarInfoStore()

    // act:
    await store.loadData(structuredClone(strucvarInfo))

    // assert:
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.strucvar).toBe(undefined)
    expect(store.genesInfos).toStrictEqual(undefined)
  })
})
