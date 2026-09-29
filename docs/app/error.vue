<script setup lang="ts">
defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()
</script>

<template>
  <div class="site ui-paper">
    <main class="l-main">
      <header class="page-head">
        <p class="kicker">
          {{ error.statusCode }}
        </p>
        <h1>找不到这一页</h1>
        <p class="lede">
          {{ error.statusMessage || error.message }}
        </p>
      </header>
      <p>
        <NuxtLink to="/">
          回到首页
        </NuxtLink>
      </p>
    </main>
  </div>
</template>
