import VariantDetailsTxCsq from '@variants/components/VariantDetails/TxCsq.vue'

export default {
  title: 'Variants / Small Variant Details Transcripts',
  component: VariantDetailsTxCsq
}

const Template = (args) => ({
  components: { VariantDetailsTxCsq },
  setup() {
    return { args }
  },
  template: '<VariantDetailsTxCsq :tx-csq="args.txCsq" />'
})

export const Example = Template.bind({})
Example.args = {
  txCsq: [
    {
      consequences: ['MissenseVariant'],
      'putative-impact': 'Moderate',
      'gene-symbol': 'BRCA1',
      'gene-id': 'HGNC:1100',
      'feature-type': { SoTerm: { term: 'Transcript' } },
      'feature-id': 'NM_007294.4',
      'feature-biotype': 'Coding',
      rank: { ord: 23, total: 23 },
      'hgvs-t': 'c.5579A>C',
      'hgvs-p': 'p.H1860P',
      'tx-pos': { ord: 5692, total: 7088 },
      'cds-pos': { ord: 5579, total: 5592 },
      'protein-pos': { ord: 1860, total: 1864 },
      distance: -1397,
      messages: null
    },
    {
      consequences: ['MissenseVariant'],
      'putative-impact': 'Moderate',
      'gene-symbol': 'BRCA1',
      'gene-id': 'HGNC:1100',
      'feature-type': { SoTerm: { term: 'Transcript' } },
      'feature-id': 'NM_007297.4',
      'feature-biotype': 'Coding',
      rank: { ord: 22, total: 22 },
      'hgvs-t': 'c.5438A>C',
      'hgvs-p': 'p.H1813P',
      'tx-pos': { ord: 5632, total: 7028 },
      'cds-pos': { ord: 5438, total: 5451 },
      'protein-pos': { ord: 1813, total: 1817 },
      distance: -1397,
      messages: null
    },
    {
      consequences: ['MissenseVariant'],
      'putative-impact': 'Moderate',
      'gene-symbol': 'BRCA1',
      'gene-id': 'HGNC:1100',
      'feature-type': { SoTerm: { term: 'Transcript' } },
      'feature-id': 'NM_007298.3',
      'feature-biotype': 'Coding',
      rank: { ord: 22, total: 22 },
      'hgvs-t': 'c.2267A>C',
      'hgvs-p': 'p.H756P',
      'tx-pos': { ord: 2286, total: 3682 },
      'cds-pos': { ord: 2267, total: 2280 },
      'protein-pos': { ord: 756, total: 760 },
      distance: -1397,
      messages: null
    },
    {
      consequences: ['MissenseVariant'],
      'putative-impact': 'Moderate',
      'gene-symbol': 'BRCA1',
      'gene-id': 'HGNC:1100',
      'feature-type': { SoTerm: { term: 'Transcript' } },
      'feature-id': 'NM_007300.4',
      'feature-biotype': 'Coding',
      rank: { ord: 24, total: 24 },
      'hgvs-t': 'c.5642A>C',
      'hgvs-p': 'p.H1881P',
      'tx-pos': { ord: 5755, total: 7151 },
      'cds-pos': { ord: 5642, total: 5655 },
      'protein-pos': { ord: 1881, total: 1885 },
      distance: -1397,
      messages: null
    },
    {
      consequences: ['ThreePrimeUtrVariant'],
      'putative-impact': 'Modifier',
      'gene-symbol': 'BRCA1',
      'gene-id': 'HGNC:1100',
      'feature-type': { SoTerm: { term: 'Transcript' } },
      'feature-id': 'NM_007299.4',
      'feature-biotype': 'Coding',
      rank: { ord: 22, total: 22 },
      'hgvs-t': 'c.*93A>C',
      'hgvs-p': 'p.?',
      'tx-pos': { ord: 2300, total: 3696 },
      'cds-pos': { ord: 93, total: 2100 },
      'protein-pos': null,
      distance: -1397,
      messages: null
    }
  ]
}
