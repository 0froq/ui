<script setup lang="ts">
import { Choice } from '@froq/ui/paper'

type Theme = 'light' | 'dark'

const { site } = useAppConfig()
const route = useRoute()
const theme = ref<Theme>('light')
const ready = ref(false)
const themes = [
  { value: 'light' as const, label: 'light' },
  { value: 'dark' as const, label: 'dark' },
]

function current(to: string): 'page' | undefined {
  return route.path === to ? 'page' : undefined
}

onMounted(() => {
  theme.value = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  ready.value = true
})

watch(theme, (value) => {
  if (!ready.value)
    return
  const dark = value === 'dark'
  document.documentElement.dataset.theme = value
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem('ui-theme', value)
})
</script>

<template>
  <header class="l-top">
    <NuxtLink
      class="l-brand"
      to="/"
    >
      froq/ui
    </NuxtLink>
    <nav class="l-nav">
      <NuxtLink
        v-for="item in site.nav"
        :key="item.to"
        :to="item.to"
        :aria-current="current(item.to)"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>
    <ClientOnly>
      <Choice
        v-model="theme"
        label="Theme"
        :options="themes"
      />
    </ClientOnly>
  </header>
</template>
