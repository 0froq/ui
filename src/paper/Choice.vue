<script setup lang="ts" generic="T extends string">
import type { ChoiceOption } from '../vue'
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, useId, watch } from 'vue'
import { prefersReducedMotion } from '../core'
import { useChoice } from '../vue'

interface Shape {
  left: number
  top: number
  width: number
  height: number
  radius: number
}

const props = defineProps<{
  options: ChoiceOption<T>[]
  label?: string
}>()
const model = defineModel<T>({ required: true })

const labelId = useId()
const { values, signature, tabindex, onKeydown } = useChoice(() => props.options, model)

const DOT = 6
const DOT_TOP = 12
const RULE_TOP = 21
const RULE = 1.5

const words: HTMLElement[] = []
const mark = ref<HTMLElement>()
const rest = reactive({ x: 0, y: 0 })
const placed = ref(false)
let motion: Animation | undefined

function wordOf(value: T): HTMLElement | undefined {
  return words[values.value.indexOf(value)]
}

function dot(word: HTMLElement): Shape {
  return { left: word.offsetLeft + word.offsetWidth + 3, top: word.offsetTop + DOT_TOP, width: DOT, height: DOT, radius: DOT / 2 }
}

function rule(word: HTMLElement, left = word.offsetLeft, width = word.offsetWidth): Shape {
  return { left, top: word.offsetTop + RULE_TOP, width, height: RULE, radius: RULE / 2 }
}

function current(el: HTMLElement): Shape {
  const style = getComputedStyle(el)
  return {
    left: el.offsetLeft,
    top: el.offsetTop,
    width: el.offsetWidth,
    height: el.offsetHeight,
    radius: Number.parseFloat(style.borderTopLeftRadius) || 0,
  }
}

function frame(shape: Shape, offset: number, easing: string): Keyframe {
  return {
    left: `${shape.left}px`,
    top: `${shape.top}px`,
    width: `${shape.width}px`,
    height: `${shape.height}px`,
    borderRadius: `${shape.radius}px`,
    offset,
    easing,
  }
}

function settle(): void {
  const word = wordOf(model.value)
  if (!word)
    return
  const shape = dot(word)
  rest.x = shape.left
  rest.y = shape.top
  placed.value = true
}

function travel(from: T, to: T): void {
  const el = mark.value
  const a = wordOf(from)
  const b = wordOf(to)
  if (!el || !a || !b)
    return
  const start = motion?.playState === 'running' ? current(el) : dot(a)
  motion?.cancel()
  settle()
  if (prefersReducedMotion())
    return
  const left = Math.min(a.offsetLeft, b.offsetLeft)
  const right = Math.max(a.offsetLeft + a.offsetWidth, b.offsetLeft + b.offsetWidth)
  motion = el.animate([
    frame(start, 0, 'cubic-bezier(0.5, 0, 0.75, 0)'),
    frame(rule(a), 0.2, 'cubic-bezier(0.45, 0, 0.55, 1)'),
    frame(rule(b, left, right - left), 0.5, 'cubic-bezier(0.16, 1, 0.3, 1)'),
    frame(rule(b), 0.78, 'cubic-bezier(0.7, 0, 0.84, 0)'),
    frame(dot(b), 1, 'linear'),
  ], { duration: 820 })
}

function choose(next: T): void {
  if (next === model.value)
    return
  const from = model.value
  model.value = next
  nextTick(() => travel(from, next))
}

function onResize(): void {
  motion?.cancel()
  settle()
}

watch(model, () => nextTick(settle))
watch(signature, () => nextTick(onResize))

onMounted(async () => {
  settle()
  await document.fonts?.ready
  settle()
  addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  motion?.cancel()
  removeEventListener('resize', onResize)
})
</script>

<template>
  <div class="paper-choice">
    <span
      v-if="label"
      :id="labelId"
      class="paper-choice-label"
    >{{ label }}</span>
    <div
      class="paper-choice-options"
      role="radiogroup"
      :aria-labelledby="label ? labelId : undefined"
    >
      <button
        v-for="(option, index) in options"
        :key="option.value"
        :ref="el => { if (el) words[index] = el as HTMLElement }"
        type="button"
        role="radio"
        class="paper-choice-word"
        :class="{ 'is-active': model === option.value }"
        :aria-checked="model === option.value"
        :tabindex="tabindex(option.value)"
        @click="choose(option.value)"
        @keydown="onKeydown($event, choose)"
      >
        {{ option.label }}
      </button>
      <span
        v-show="placed"
        ref="mark"
        class="paper-choice-mark"
        :style="{ left: `${rest.x}px`, top: `${rest.y}px` }"
        aria-hidden="true"
      />
    </div>
  </div>
</template>
