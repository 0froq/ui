import type { MaybeRefOrGetter, Ref } from 'vue'
import type { ChoiceOption } from './types'
import { computed, toValue } from 'vue'
import { targetIndex } from '../core'

/**
 * The behavior of a single-choice radio group, with no opinion about how it looks.
 * `active` is the ref the group reads its selected state from.
 */
export function useChoice<T extends string>(options: MaybeRefOrGetter<readonly ChoiceOption<T>[]>, active: Ref<T>) {
  const values = computed(() => toValue(options).map(option => option.value))
  // Callers often pass a fresh array literal on every render, so watch content, not identity.
  const signature = computed(() => toValue(options).map(option => `${option.value}\u0000${option.label}`).join('\u0001'))

  function isActive(value: T): boolean {
    return active.value === value
  }

  function tabindex(value: T): 0 | -1 {
    return isActive(value) ? 0 : -1
  }

  function onKeydown(event: KeyboardEvent, choose: (value: T) => void): void {
    const index = targetIndex(event.key, values.value.indexOf(active.value), values.value.length)
    const next = index === undefined ? undefined : values.value[index]
    if (index === undefined || next === undefined)
      return
    event.preventDefault()
    choose(next)
    const group = (event.currentTarget as HTMLElement).closest('[role="radiogroup"]')
    group?.querySelectorAll<HTMLElement>('[role="radio"]')[index]?.focus()
  }

  return { values, signature, isActive, tabindex, onKeydown }
}
