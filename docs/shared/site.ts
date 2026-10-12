/** Production origin of the docs site, as documented in the README. */
export const SITE_ORIGIN = 'https://ui-a09.pages.dev'

export const SITE_NAME = 'froq/ui'

export const OG_IMAGE_URL = `${SITE_ORIGIN}/og.png`

export const SITE_DESCRIPTION = 'Small controls, shared behavior, one visual language. Built for froq’s projects, with the details still open to refinement.'

export function canonicalUrl(path: string): string {
  if (!path || path === '/')
    return SITE_ORIGIN
  return `${SITE_ORIGIN}${path}`
}

export function shareTitle(title: string | undefined | null): string {
  if (!title || title === SITE_NAME)
    return SITE_NAME
  return `${title} — ${SITE_NAME}`
}
