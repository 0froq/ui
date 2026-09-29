<script setup lang="ts" generic="T extends string">
import type { Ref } from 'vue'
import type { ChoiceOption } from '../vue'
import { onBeforeUnmount, ref, useId, watch } from 'vue'
import { prefersReducedMotion } from '../core'
import { useChoice } from '../vue'

const props = defineProps<{
  options: ChoiceOption<T>[]
  label?: string
  /** When set, a command line under the menu types out the choice, and the model changes once it is "run". */
  prefix?: string
}>()
const model = defineModel<T>({ required: true })

const labelId = useId()
const target = ref<T>(model.value) as Ref<T>
const typed = ref<string>(model.value)
const { isActive, tabindex, onKeydown } = useChoice(() => props.options, target)
let timer: ReturnType<typeof setTimeout> | undefined

function run(): void {
  const goal: string = target.value
  const current = typed.value
  if (current === goal) {
    model.value = target.value
    return
  }
  typed.value = goal.startsWith(current) ? goal.slice(0, current.length + 1) : current.slice(0, -1)
  timer = setTimeout(run, goal.startsWith(typed.value) ? 34 : 18)
}

function choose(next: T): void {
  target.value = next
  clearTimeout(timer)
  if (props.prefix === undefined || prefersReducedMotion()) {
    typed.value = next
    model.value = next
    return
  }
  run()
}

watch(model, (next) => {
  if (next === target.value)
    return
  clearTimeout(timer)
  target.value = next
  typed.value = next
})

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="term-choice">
    <div
      class="term-choice-menu"
      role="radiogroup"
      :aria-labelledby="label ? labelId : undefined"
    >
      <span
        v-if="label"
        :id="labelId"
        class="term-choice-label"
      >{{ label }}</span>
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        role="radio"
        class="term-choice-item"
        :class="{ 'is-active': isActive(option.value) }"
        :aria-checked="isActive(option.value)"
        :tabindex="tabindex(option.value)"
        @click="choose(option.value)"
        @keydown="onKeydown($event, choose)"
      >
        {{ option.label }}
      </button>
    </div>
    <p
      v-if="prefix !== undefined"
      class="term-choice-cmd"
      aria-hidden="true"
    >
      {{ prefix }}{{ typed }}<span class="term-choice-cursor" />
    </p>
  </div>
</template>
