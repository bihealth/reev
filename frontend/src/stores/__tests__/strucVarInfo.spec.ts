import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import * as geneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import type { Strucvar } from '@/lib/genomicVars'
import { deepCopy } from '@/lib/utils'
import { StoreState } from '@/stores/misc'
import { useStrucVarInfoStore } from '@/stores/strucVarInfo'

const fetchMocker = createFetchMock(vi)

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
    const store = useStrucVarInfoStore()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.strucvar).toBe(undefined)
    expect(store.genesInfos).toStrictEqual(undefined)
  })

  it('should clear state', () => {
    const store = useStrucVarInfoStore()
    store.storeState = StoreState.Active
    store.strucvar = deepCopy(strucvarInfo)
    store.genesInfos = JSON.parse(JSON.stringify([geneInfo['genes']['HGNC:1100']]))

    store.clearData()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.strucvar).toBe(undefined)
    expect(store.genesInfos).toStrictEqual(undefined)
  })

  it('should load data', async () => {
    const store = useStrucVarInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('csq')) {
        return Promise.resolve(JSON.stringify({ result: [{ hgnc_id: 'HGNC:1100' }] }))
      } else {
        return Promise.resolve(JSON.stringify(geneInfo))
      }
    })
    await store.loadData(deepCopy(strucvarInfo))

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.strucvar).toStrictEqual(strucvarInfo)
    expect(store.genesInfos).toStrictEqual([geneInfo['genes']['HGNC:1100']])
  })

  it('should correctly handle errors', async () => {
    // Disable console.error
    const spy = vi.spyOn(console, 'error')
    spy.mockImplementation(() => {})

    const store = useStrucVarInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('csq')) {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })
    await store.loadData(deepCopy(strucvarInfo))

    expect(store.storeState).toBe(StoreState.Error)
    expect(store.strucvar).toBe(undefined)
    expect(store.genesInfos).toStrictEqual(undefined)
  })
})
