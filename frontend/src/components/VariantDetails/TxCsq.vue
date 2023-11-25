<script setup lang="ts">
const props = defineProps<{ txCsq: any }>()
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
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="txCsq in props.txCsq" :key="txCsq">
            <td>{{ txCsq['gene_symbol'] }}</td>
            <td>
              {{ txCsq.feature_id }}
              <small> ({{ txCsq.feature_biotype }}) </small>
              <span
                class="badge badge-primary"
                v-if="(txCsq.feature_tag ?? []).includes('ManeSelect')"
              >
                MANE Select
              </span>
              <span
                class="badge badge-secondary"
                v-if="(txCsq.feature_tag ?? []).includes('ManePlusClinical')"
              >
                MANE Plus Clinical
              </span>
            </td>
            <td>{{ (txCsq['consequences'] ?? []).join(', ') }}</td>
            <td>{{ txCsq['hgvs_t'] }}</td>
            <td>{{ txCsq['hgvs_p'] }}</td>
            <td>{{ txCsq['rank']?.ord }} / {{ txCsq['rank']?.total }}</td>
          </tr>
        </tbody>
      </v-table></v-card-text
    >
  </v-card>
</template>
