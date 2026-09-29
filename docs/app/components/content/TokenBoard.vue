<script setup lang="ts">
import type { StyleName, TokenName } from '@froq/ui/core'
import { scopeClass, STYLES, TOKENS, tokenVar } from '@froq/ui/core'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  skin?: string
}>()

const COLOR = new Set<TokenName>(['bg', 'fg', 'muted', 'faint', 'line', 'accent'])

function isStyle(value: string): value is StyleName {
  return (STYLES as readonly string[]).includes(value)
}

const skins = computed(() => {
  if (props.skin === undefined)
    return [...STYLES]
  return isStyle(props.skin) ? [props.skin] : []
})

const roots = new Map<StyleName, HTMLElement>()
const values = ref<Partial<Record<StyleName, Partial<Record<TokenName, string>>>>>({})

function setRoot(skin: StyleName, el: Element | null): void {
  if (el instanceof HTMLElement)
    roots.set(skin, el)
  else
    roots.delete(skin)
}

function read(): void {
  const next: Partial<Record<StyleName, Partial<Record<TokenName, string>>>> = {}
  for (const skin of skins.value) {
    const el = roots.get(skin)
    if (!el)
      continue
    const style = getComputedStyle(el)
    const row: Partial<Record<TokenName, string>> = {}
    for (const name of TOKENS)
      row[name] = style.getPropertyValue(tokenVar(name)).trim()
    next[skin] = row
  }
  values.value = next
}

let observer: MutationObserver | undefined

onMounted(() => {
  read()
  observer = new MutationObserver(() => read())
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] })
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="boards">
    <p
      v-if="skin && skins.length === 0"
      class="demo-missing"
    >
      未知的风格：{{ skin }}
    </p>
    <section
      v-for="name in skins"
      :key="name"
      :ref="el => setRoot(name, el as Element | null)"
      class="board"
      :class="scopeClass(name)"
    >
      <h3 class="board-name">
        {{ name }}
      </h3>
      <div
        v-for="token in TOKENS"
        :key="token"
        class="token-row"
      >
        <span
          class="swatch"
          :class="{ 'is-blank': !COLOR.has(token) }"
          :style="COLOR.has(token) ? { '--swatch': `var(${tokenVar(token)})` } : undefined"
        />
        <span>{{ tokenVar(token) }}</span>
        <span class="token-value">{{ values[name]?.[token] }}</span>
      </div>
    </section>
  </div>
</template>
