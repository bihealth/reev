<script lang="ts" setup>
import { useCounterStore } from '../stores/counter'

const counterStore = useCounterStore()
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>
      <span>Counter: {{ counterStore.count }}</span>
      <button @click="counterStore.increment()">Increment</button>
    </p>
    <p>
      <span>From API: {{ counterStore.apiValue }}</span>
      <button @click="counterStore.fetchApiValue()">Fetch</button>
    </p>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
