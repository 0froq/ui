<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    onLabel?: string
    offLabel?: string
    disabled?: boolean
  }>(),
  {
    onLabel: 'on',
    offLabel: 'off',
    disabled: false,
  },
)
defineSlots<{
  off?: () => unknown
  on?: () => unknown
}>()
const model = defineModel<boolean>({ default: false })

const off = ref<HTMLElement>()
const on = ref<HTMLElement>()
const width = ref(0)

function measure(): void {
  width.value = (model.value ? on.value : off.value)?.offsetWidth ?? 0
}

watch([model, () => props.onLabel, () => props.offLabel], () => nextTick(measure))

onMounted(async () => {
  measure()
  await document.fonts?.ready
  measure()
})
</script>

<template>
  <button
    type="button"
    role="switch"
    class="ui-toggle"
    :style="width ? { width: `${width}px` } : undefined"
    :aria-checked="model"
    :aria-label="label"
    :disabled="disabled"
    @click="!disabled && (model = !model)"
  >
    <span
      ref="off"
      :class="{ 'is-on': !model }"
      ><slot name="off">{{ offLabel }}</slot></span
    >
    <span
      ref="on"
      :class="{ 'is-on': model }"
      ><slot name="on">{{ onLabel }}</slot></span
    >
  </button>
</template>

<style scoped>
/*Toggle: two words in one slot, the other rolls in. Inherits the font of the line it sits in.*/
.ui-toggle {
  display: inline-grid;
  padding: 0;
  border: 0;
  border-bottom: 1px dashed color-mix(in srgb, var(--ui-fg) 45%, transparent);
  background: none;
  color: inherit;
  cursor: pointer;
  font: inherit;
  letter-spacing: inherit;
  clip-path: inset(0 -0.3em);
  transition:
    border-color 0.3s var(--ui-ease),
    width 0.55s var(--ui-ease);
}

.ui-toggle > :deep(span) {
  grid-area: 1 / 1;
  justify-self: start;
  white-space: nowrap;
  transition:
    translate 0.55s var(--ui-ease),
    opacity 0.4s var(--ui-ease);
}

/* An icon in a slot sits on the text line instead of the baseline gap. */
.ui-toggle > :deep(span svg) {
  display: block;
  width: 1em;
  height: 1em;
}

.ui-toggle > :deep(span:first-child:not(.is-on)) {
  translate: 0 -100%;
  opacity: 0;
}

.ui-toggle > :deep(span:last-child:not(.is-on)) {
  translate: 0 100%;
  opacity: 0;
}

.ui-toggle:hover,
.ui-toggle:focus-visible {
  border-bottom: 1px solid var(--ui-fg);
  outline: none;
}

.ui-toggle:disabled {
  color: var(--ui-muted);
  cursor: not-allowed;
}

.ui-toggle:disabled {
  border-bottom: 1px dashed var(--ui-line);
}
</style>
