import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { describe, expect, it } from 'vitest'

import CadaRanking from './CadaRanking.vue'

describe.concurrent('CadaRanking', async () => {
  it('renders the CadaRanking info', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: CadaRanking },
      {
        props: {
          hgncId: 'HGNC:1100'
        },
        initialStoreState: {
          caseInfo: {
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
                geneSymbol: 'BRCA1',
                ncbiGeneId: '672',
                hgncId: 'HGNC:1100',
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
