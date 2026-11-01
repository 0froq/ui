<script setup lang="ts">
import Button from './Button.vue'

withDefaults(
  defineProps<{
    label: string
    type?: 'button' | 'submit' | 'reset'
  }>(),
  { type: 'button' },
)
defineSlots<{ default?: () => unknown }>()
</script>

<template>
  <Button
    class="ui-icon-button"
    :type="type"
    :aria-label="label"
  >
    <span
      class="ui-icon-button-glyph"
      aria-hidden="true"
      ><slot
    /></span>
  </Button>
</template>

<style scoped>
.ui-icon-button.ui-button {
  display: inline-grid;
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  place-items: center;
  padding: 0;
  border: 1px solid var(--ui-line);
  border-radius: var(--ui-radius);
}

.ui-icon-button-glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.ui-icon-button-glyph > :deep(svg) {
  width: 16px;
  height: 16px;
}
</style>
