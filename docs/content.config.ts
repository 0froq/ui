import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: {
        include: '*.md',
        exclude: ['docs/**'],
      },
      schema: z.object({
        kicker: z.string().optional(),
        head: z.boolean().default(true),
      }),
    }),
    // Numeric prefixes (`1.install.md`) order the sidebar and are dropped from the path.
    docs: defineCollection({
      type: 'page',
      source: 'docs/**/*.md',
      schema: z.object({
        kicker: z.string().optional(),
      }),
    }),
  },
})
