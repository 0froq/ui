<script setup lang="ts">
useHead({
  titleTemplate: (title) => {
    if (!title || title === 'froq/ui')
      return 'froq/ui'
    return `${title} — froq/ui`
  },
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
