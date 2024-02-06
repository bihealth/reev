<script lang="ts" setup>
import { ref } from 'vue';
import {VForm} from 'vuetify/components'

const props = withDefaults(
  defineProps<{
    comment: string
    submitting: boolean
  }>(),
  {
    comment: '',
    submitting: false
  }
)

const emit = defineEmits<{
  (event: 'update:comment', value: string): void;
  (event: 'submitComment'): void;
}>()

const commentRules = [
  (value: string) => {
    if ((value ?? '').length >= 20) {
      return true
    } else {
      return 'The comment must have at least 20 characters.'
    }
  }
]

const formRef = ref<InstanceType<typeof VForm> | null>(null)

const handleSubmit = async () => {
  console.log(formRef.value)
  if (!formRef.value) {
    return
  }
  const { valid } = await formRef.value.validate()
  if (valid) {
    emit('submitComment')
  }
}
</script>

<template>
  <v-form @submit.prevent ref="formRef">
    <v-textarea label="Write a comment" variant="outlined" v-bind:model="comment" @update:modelValue="emit('update:comment', $event)"
    :rules="commentRules"
    />
    <v-alert type="info" class="my-3">
      <p>
        By publishing a comment, you agree that it will be made public also to anonymous users.
        You make your contribution available under the <a href="https://creativecommons.org/licenses/by-sa/4.0/">
          Creative Commons Attribution-ShareAlike 4.0 International License
        </a>.
      </p>
    </v-alert>
    <v-row no-gutter>
      <v-col cols="12" class="text-right">
        <v-btn color="primary" @click="handleSubmit">Submit</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
