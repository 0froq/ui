<script setup lang="ts">
const route = useRoute()

const rest = computed(() => {
  const slug = route.params.slug
  const parts = Array.isArray(slug) ? slug : slug ? [slug] : []
  return parts.length ? `/${parts.join('/')}` : ''
})

const { data } = await useAsyncData(
  () => `docs-${rest.value}`,
  async () => {
    const root = '/docs'
    const [doc, all] = await Promise.all([
      queryCollection('docs').path(`${root}${rest.value}`).first(),
      queryCollection('docs').where('path', 'LIKE', `${root}%`).order('stem', 'ASC').select('path', 'title').all(),
    ])
    return { doc, all }
  },
)
const doc = computed(() => data.value?.doc)
if (!doc.value)
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const pages = computed(() => (data.value?.all ?? []).map(item => ({
  title: item.title || item.path,
  path: item.path,
})))
const index = computed(() => pages.value.findIndex(item => item.path === doc.value?.path))
const prev = computed(() => pages.value[index.value - 1])
const next = computed(() => pages.value[index.value + 1])

useHead({ title: () => doc.value?.title })
useSeoMeta({ description: () => doc.value?.description })
</script>

<template>
  <div
    v-if="doc"
    class="l-wrap"
  >
    <PageHead
      :title="doc.title"
      :lede="doc.description"
    >
      <template #kicker>
        <NuxtLink to="/docs">
          文档
        </NuxtLink>
      </template>
    </PageHead>
    <div class="docs">
      <nav class="toc">
        <NuxtLink
          v-for="item in pages"
          :key="item.path"
          :to="item.path"
          :aria-current="item.path === doc.path ? 'page' : undefined"
        >
          {{ item.title }}
        </NuxtLink>
      </nav>
      <ContentRenderer
        :value="doc"
        class="md"
      />
    </div>
    <nav class="pager">
      <NuxtLink
        v-if="prev"
        :to="prev.path"
      >
        ← {{ prev.title }}
      </NuxtLink>
      <span v-else />
      <NuxtLink
        v-if="next"
        :to="next.path"
      >
        {{ next.title }} →
      </NuxtLink>
    </nav>
  </div>
</template>
