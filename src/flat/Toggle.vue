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
    class="flat-toggle"
    :aria-checked="model"
    :aria-label="label"
    @click="model = !model"
  >
    <span
      class="flat-toggle-track"
      aria-hidden="true"
    >
      <span class="flat-toggle-knob" />
    </span>
    <span aria-hidden="true">{{ text }}</span>
  </button>
</template>
