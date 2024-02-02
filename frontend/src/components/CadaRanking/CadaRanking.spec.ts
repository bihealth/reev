import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it } from 'vitest'

import { setupMountedComponents } from '@/lib/testUtils'

import CadaRanking from './CadaRanking.vue'

describe.concurrent('CadaRanking', async () => {
  it('renders the CadaRanking info', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: CadaRanking },
      {
        pinia: createTestingPinia(),
        props: {
          hgncId: 'HGNC:1100'
        },
        initialStoreState: {
          case: {
            caseInfo: {
              hpoTerms: [
                {
                  termId: 'HP:0000001',
                  name: 'Example HPO Term'
                },
                {
                  termId: 'HP:0000002',
                  name: 'Example HPO Term 2'
                }
              ]
            }
          },
          cadaPrio: {
            geneRanking: [
              {
                gene_symbol: 'BRCA1',
                ncbi_gene_id: '672',
                hgnc_id: 'HGNC:1100',
                rank: 1,
                score: 0.5
              }
            ]
          }
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('Gene-to-Phenotype Rank')
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('0.5')
  })
})
