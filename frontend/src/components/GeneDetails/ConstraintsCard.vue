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
            <td v-html="roundIt(props.gnomadConstraints?.expSyn, 1)"></td>
            <td v-html="roundIt(props.gnomadConstraints?.obsSyn, 1)"></td>
            <td>
              Z =
              <span v-html="roundIt(props.gnomadConstraints?.synZ)" /><br />
              o/e =
              <span v-html="roundIt(props.gnomadConstraints?.oeSyn)" />
              (<span v-html="roundIt(props.gnomadConstraints?.oeSynLower)" />
              -
              <span v-html="roundIt(props.gnomadConstraints?.oeSynUpper)" />)
            </td>
          </tr>
          <tr>
            <td>Missense</td>
            <td v-html="roundIt(props.gnomadConstraints?.expMis, 1)"></td>
            <td v-html="roundIt(props.gnomadConstraints?.obsMis, 1)"></td>
            <td>
              Z =
              <span v-html="roundIt(props.gnomadConstraints?.misZ)" /><br />
              o/e =
              <span v-html="roundIt(props.gnomadConstraints?.oeMis)" />
              (<span v-html="roundIt(props.gnomadConstraints?.oeMisLower)" />
              -
              <span v-html="roundIt(props.gnomadConstraints?.oeMisUpper)" />)
            </td>
          </tr>
          <tr>
            <td>pLoF</td>
            <td v-html="roundIt(props.gnomadConstraints?.expLof, 1)"></td>
            <td v-html="roundIt(props.gnomadConstraints?.obsLof, 1)"></td>
            <td>
              pLI =
              <span v-html="roundIt(props.gnomadConstraints?.pli)" /><br />
              o/e =
              <span v-html="roundIt(props.gnomadConstraints?.oeLof)" />
              (<span v-html="roundIt(props.gnomadConstraints?.oeLofLower)" />
              -
              <mark v-html="roundIt(props.gnomadConstraints?.oeLofUpper, 2, 'LOEUF')" />)
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
