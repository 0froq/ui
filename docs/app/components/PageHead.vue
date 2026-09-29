<script setup lang="ts">
defineProps<{
  kicker?: string
  title?: string
  lede?: string
}>()
</script>

<template>
  <header
    v-if="title || lede || kicker || $slots.kicker"
    class="page-head"
  >
    <p
      v-if="kicker || $slots.kicker"
      class="kicker"
    >
      <slot name="kicker">
        {{ kicker }}
      </slot>
    </p>
    <h1 v-if="title">
      {{ title }}
    </h1>
    <p
      v-if="lede"
      class="lede"
    >
      {{ lede }}
    </p>
  </header>
</template>
