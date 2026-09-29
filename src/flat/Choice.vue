<script setup lang="ts" generic="T extends string">
import type { ChoiceOption } from '../vue'
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, useId, watch } from 'vue'
import { useChoice } from '../vue'

const props = defineProps<{
  options: ChoiceOption<T>[]
  label?: string
}>()
const model = defineModel<T>({ required: true })

const labelId = useId()
const { values, signature, tabindex, onKeydown } = useChoice(() => props.options, model)

const segments: HTMLElement[] = []
const box = reactive({ x: 0, w: 0 })
const placed = ref(false)
const ready = ref(false)

function place(): void {
  const segment = segments[values.value.indexOf(model.value)]
  if (!segment)
    return
  box.x = segment.offsetLeft
  box.w = segment.offsetWidth
  placed.value = true
}

function choose(next: T): void {
  model.value = next
}

watch(model, () => nextTick(place))
watch(signature, () => nextTick(place))

onMounted(async () => {
  place()
  await document.fonts?.ready
  place()
  requestAnimationFrame(() => {
    ready.value = true
  })
  addEventListener('resize', place)
})

onBeforeUnmount(() => removeEventListener('resize', place))
</script>

<template>
  <div
    class="flat-choice"
    :class="{ 'is-ready': ready }"
  >
    <span
      v-if="label"
      :id="labelId"
      class="flat-choice-label"
    >{{ label }}</span>
    <div
      class="flat-choice-track"
      role="radiogroup"
      :aria-labelledby="label ? labelId : undefined"
    >
      <span
        v-show="placed"
        class="flat-choice-thumb"
        :style="{ translate: `${box.x}px 0`, width: `${box.w}px` }"
        aria-hidden="true"
      />
      <button
        v-for="(option, index) in options"
        :key="option.value"
        :ref="el => { if (el) segments[index] = el as HTMLElement }"
        type="button"
        role="radio"
        class="flat-choice-segment"
        :class="{ 'is-active': model === option.value }"
        :aria-checked="model === option.value"
        :tabindex="tabindex(option.value)"
        @click="choose(option.value)"
        @keydown="onKeydown($event, choose)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>
