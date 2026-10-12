import type { MaybeRefOrGetter } from 'vue'
import { canonicalUrl, shareTitle } from '../../shared/site'

/** Document title plus Open Graph / Twitter tags for the current route. */
export function useShareMeta(input: {
  title?: MaybeRefOrGetter<string | undefined>
  description?: MaybeRefOrGetter<string | undefined>
  type?: MaybeRefOrGetter<'website' | 'article' | undefined>
} = {}): void {
  const route = useRoute()
  const title = computed(() => shareTitle(toValue(input.title)))
  const description = computed(() => {
    const value = input.description == null ? undefined : toValue(input.description)
    return value || undefined
  })

  useHead({
    title: () => input.title == null ? undefined : toValue(input.title) || undefined,
  })

  useSeoMeta({
    description,
    ogTitle: title,
    twitterTitle: title,
    ogDescription: description,
    twitterDescription: description,
    ogUrl: () => canonicalUrl(route.path),
    ogType: () => toValue(input.type) ?? 'website',
  })
}
