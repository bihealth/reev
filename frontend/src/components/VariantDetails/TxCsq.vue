<script setup lang="ts">
const props = defineProps<{ txCsq: any }>()
</script>

<template>
  <div>
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
            {{ txCsq['feature_id'] }}
            ({{ txCsq['feature_biotype'] }})
          </td>
          <td>{{ (txCsq['consequences'] ?? []).join(', ') }}</td>
          <td>{{ txCsq['hgvs_t'] }}</td>
          <td>{{ txCsq['hgvs_p'] }}</td>
          <td>{{ txCsq['rank']?.ord }} / {{ txCsq['rank']?.total }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>
