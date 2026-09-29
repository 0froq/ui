<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  onLabel?: string
  offLabel?: string
}>()
const model = defineModel<boolean>({ default: false })

const text = computed(() => (model.value ? props.onLabel : props.offLabel) ?? props.label)
</script>

<template>
  <button
    type="button"
    role="switch"
    class="term-toggle"
    :aria-checked="model"
    :aria-label="label"
    @click="model = !model"
  >
    <span aria-hidden="true">[<span class="term-toggle-box">{{ model ? 'x' : ' ' }}</span>] {{ text }}</span>
  </button>
</template>
