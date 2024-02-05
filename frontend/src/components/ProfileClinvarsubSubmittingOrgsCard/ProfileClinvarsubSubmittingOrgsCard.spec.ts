import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import CLINVARSUB_PAGE from '../../api/clinvarsub/fixture.clinvarsubPage.json'
import ClinvarsubSubmittingOrgsCard from './ProfileClinvarsubSubmittingOrgsCard.vue'

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
    const { wrapper } = await setupMountedComponents({
      component: ClinvarsubSubmittingOrgsCard
    })

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toMatch('ClinVar Organisations')
  })
})
