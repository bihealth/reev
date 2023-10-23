<script setup lang="ts">
import { roundIt } from '@/lib/utils'

export interface Props {
  gnomadConstraints: any
}

const props = withDefaults(defineProps<Props>(), {
  gnomadConstraints: null
})
</script>
<template>
  <v-card id="constraints-scores" class="gene-item">
    <v-card-title>Constraints/Scores</v-card-title>
    <v-card-subtitle>gnomAD</v-card-subtitle>
    <v-divider></v-divider>
    <v-card-text>
      <v-table style="width: 100%">
        <thead>
          <tr>
            <th>Category</th>
            <th>SNVs exp.</th>
            <th>SNVs obs.</th>
            <th>Constraint metrics</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Synonymous</td>
            <td v-html="roundIt(props.gnomadConstraints?.exp_syn, 1)"></td>
            <td v-html="roundIt(props.gnomadConstraints?.obs_syn, 1)"></td>
            <td>
              Z =
              <span v-html="roundIt(props.gnomadConstraints?.syn_z)" /><br />
              o/e =
              <span v-html="roundIt(props.gnomadConstraints?.oe_syn)" />
              (<span v-html="roundIt(props.gnomadConstraints?.oe_syn_lower)" />
              -
              <span v-html="roundIt(props.gnomadConstraints?.oe_syn_upper)" />)
            </td>
          </tr>
          <tr>
            <td>Missense</td>
            <td v-html="roundIt(props.gnomadConstraints?.exp_mis, 1)"></td>
            <td v-html="roundIt(props.gnomadConstraints?.obs_mis, 1)"></td>
            <td>
              Z =
              <span v-html="roundIt(props.gnomadConstraints?.mis_z)" /><br />
              o/e =
              <span v-html="roundIt(props.gnomadConstraints?.oe_mis)" />
              (<span v-html="roundIt(props.gnomadConstraints?.oe_mis_lower)" />
              -
              <span v-html="roundIt(props.gnomadConstraints?.oe_mis_upper)" />)
            </td>
          </tr>
          <tr>
            <td>pLoF</td>
            <td v-html="roundIt(props.gnomadConstraints?.exp_lof, 1)"></td>
            <td v-html="roundIt(props.gnomadConstraints?.obs_lof, 1)"></td>
            <td>
              pLI =
              <span v-html="roundIt(props.gnomadConstraints?.pli)" /><br />
              o/e =
              <span v-html="roundIt(props.gnomadConstraints?.oe_lof)" />
              (<span v-html="roundIt(props.gnomadConstraints?.oe_lof_lower)" />
              -
              <mark v-html="roundIt(props.gnomadConstraints?.oe_lof_upper, 2, 'LOEUF')" />)
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
