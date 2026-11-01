<script setup lang="ts">
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
  <button
    class="ui-icon-button"
    :type="type"
    :aria-label="label"
  >
    <span
      class="ui-icon-button-glyph"
      aria-hidden="true"
      ><slot
    /></span>
  </button>
</template>

<style scoped>
.ui-icon-button {
  display: inline-grid;
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  place-items: center;
  padding: 0;
  border: 1px solid var(--ui-line);
  border-radius: var(--ui-radius);
  background: none;
  color: var(--ui-fg);
  cursor: pointer;
  transition: color var(--ui-dur) var(--ui-ease);
}

.ui-icon-button:hover:not(:disabled) {
  color: var(--ui-accent);
}

.ui-icon-button:disabled {
  color: var(--ui-muted);
  cursor: not-allowed;
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
