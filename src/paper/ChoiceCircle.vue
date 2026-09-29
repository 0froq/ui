<script setup lang="ts" generic="T extends string">
import type { ChoiceOption } from '../vue'
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { looseEllipse, toPath } from '../core'
import { useChoice } from '../vue'

const props = defineProps<{
  options: ChoiceOption<T>[]
  label?: string
}>()
const model = defineModel<T>({ required: true })

const { values, signature, tabindex, onKeydown } = useChoice(() => props.options, model)

const words: HTMLElement[] = []
const box = reactive({ x: 0, y: 0, w: 0, h: 0 })
const drawn = ref(0)
const placed = ref(false)

const ring = toPath(looseEllipse(50, 20, 47, 17))

function place(): void {
  const word = words[values.value.indexOf(model.value)]
  if (!word)
    return
  box.x = word.offsetLeft - 14
  box.y = word.offsetTop - 9
  box.w = word.offsetWidth + 28
  box.h = word.offsetHeight + 18
  placed.value = true
}

function choose(next: T): void {
  if (next === model.value)
    return
  model.value = next
  drawn.value++
}

watch(model, () => nextTick(place))
watch(signature, () => nextTick(place))

onMounted(async () => {
  place()
  await document.fonts?.ready
  place()
  addEventListener('resize', place)
})

onBeforeUnmount(() => removeEventListener('resize', place))
</script>

<template>
  <div
    class="paper-circle"
    role="radiogroup"
    :aria-label="label"
  >
    <button
      v-for="(option, index) in options"
      :key="option.value"
      :ref="el => { if (el) words[index] = el as HTMLElement }"
      type="button"
      role="radio"
      class="paper-circle-word"
      :class="{ 'is-active': model === option.value }"
      :aria-checked="model === option.value"
      :tabindex="tabindex(option.value)"
      @click="choose(option.value)"
      @keydown="onKeydown($event, choose)"
    >
      {{ option.label }}
    </button>
    <svg
      v-show="placed"
      :key="drawn"
      class="paper-circle-ring"
      :class="{ 'is-drawn': drawn > 0 }"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      :style="{ left: `${box.x}px`, top: `${box.y}px`, width: `${box.w}px`, height: `${box.h}px` }"
      aria-hidden="true"
    >
      <path
        :d="ring"
        pathLength="1"
      />
    </svg>
  </div>
</template>
