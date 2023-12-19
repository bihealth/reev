<script setup lang="ts">
import DocsLink from '@/components/DocsLink.vue'

interface Props {
  txCsq: any
}

const props = defineProps<Props>()
</script>

<template>
  <template v-if="txCsq === null">
    <!-- no ENSG => display loader -->
    <v-skeleton-loader class="mt-3 mx-auto border" type="table" />
  </template>
  <template v-else>
    <v-card>
      <v-card-title class="pb-0 pr-2">
        Consequences
        <DocsLink anchor="consequences" />
      </v-card-title>
      <v-card-subtitle class="text-overline">
        Variant Consequences on Overlapping Transcripts
      </v-card-subtitle>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th>Gene</th>
              <th>Transcript</th>
              <th>Consequence</th>
              <th>HGVS.p</th>
              <th>HGVS.t</th>
              <th>Exon/Intron</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="props.txCsq?.length">
              <tr v-for="oneTxCsq in props.txCsq" :key="oneTxCsq">
                <td>{{ oneTxCsq['gene_symbol'] }}</td>
                <td>
                  {{ oneTxCsq.feature_id }}
                  <small> ({{ oneTxCsq.feature_biotype }}) </small>
                  <span
                    v-if="(oneTxCsq.feature_tag ?? []).includes('ManeSelect')"
                    class="badge badge-primary"
                  >
                    MANE Select
                  </span>
                  <span
                    v-if="(oneTxCsq.feature_tag ?? []).includes('ManePlusClinical')"
                    class="badge badge-secondary"
                  >
                    MANE Plus Clinical
                  </span>
                </td>
                <td>{{ (oneTxCsq.consequences ?? []).join(', ') }}</td>
                <td>{{ oneTxCsq.hgvs_t }}</td>
                <td>{{ oneTxCsq.hgvs_p }}</td>
                <td>{{ oneTxCsq.rank?.ord }} / {{ oneTxCsq.rank?.total }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="6" class="text-center font-italic text-grey-darken-2">
                  No overlapping transcripts
                </td>
              </tr>
            </template>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </template>
</template>
