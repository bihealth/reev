<script setup lang="ts">
interface Props {
  txCsq: any
}

const props = defineProps<Props>()
</script>

<template>
  <v-card>
    <v-card-title>Transcript Consequences</v-card-title>
    <v-divider />
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
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
