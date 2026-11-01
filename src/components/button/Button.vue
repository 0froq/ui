<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    type: 'button',
  },
)
</script>

<template>
  <button
    :type="type"
    class="ui-button"
  >
    <slot />
  </button>
</template>

<style scoped>
.ui-button {
  padding: 0 0 1px;
  border: 0;
  border-bottom: 1px solid currentColor;
  background: none;
  color: var(--ui-fg);
  cursor: pointer;
  font-family: var(--ui-font-text);
  font-size: 15px;
  line-height: 1.4;
  transition: color var(--ui-dur) var(--ui-ease);
}

.ui-button:hover:not(:disabled) {
  color: var(--ui-accent);
}

.ui-button:disabled {
  color: var(--ui-muted);
  cursor: not-allowed;
}
</style>
