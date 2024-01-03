import { beforeEach, describe, expect, test, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import CLINVARSUB_PAGE from '@/api/__tests__/data/clinvarsub_page.json'
import ClinvarsubSubmittingOrgsCard from '@/components/Profile/ClinvarsubSubmittingOrgsCard.vue'
import { setupMountedComponents } from '@/lib/test-utils'

const fetchMocker = createFetchMock(vi)

describe.concurrent('ClinvarsubSubmittingOrgsCard', async () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  test('smoke test', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.method == 'GET' && req.url.endsWith('/clinvarsub/submittingorgs?size=50')) {
        return Promise.resolve(JSON.stringify(CLINVARSUB_PAGE))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    // act:
    const { wrapper } = await setupMountedComponents({
      component: ClinvarsubSubmittingOrgsCard
    })

    // assert:
    expect(wrapper.text()).toMatch('ClinVar Organisations')
  })
})
