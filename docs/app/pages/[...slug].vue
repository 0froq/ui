<script setup lang="ts">
const route = useRoute()

const rest = computed(() => {
  const slug = route.params.slug
  const parts = Array.isArray(slug) ? slug : slug ? [slug] : []
  return parts.length ? `/${parts.join('/')}` : '/'
})

const { data: page } = await useAsyncData(
  () => `page-${rest.value}`,
  () => queryCollection('pages').path(rest.value).first(),
)
if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

useHead(() => ({ title: page.value?.title || undefined }))
useSeoMeta({ description: () => page.value?.description })
</script>

<template>
  <div
    v-if="page"
    class="l-wrap"
  >
    <PageHead
      v-if="page.head"
      :kicker="page.kicker"
      :title="page.title"
      :lede="page.description"
    />
    <ContentRenderer
      :value="page"
      class="md"
    />
  </div>
</template>
