import { site } from '@/data/site'

export type ShareSource = 'facebook' | 'discord'

/** Absolute article URL with UTM attribution for community posts. */
export function shareLink(path: string, source: ShareSource): string {
  const url = new URL(path, site.url)
  url.searchParams.set('utm_source', source)
  url.searchParams.set('utm_medium', 'social')
  url.searchParams.set('utm_campaign', 'article_share')
  return url.toString()
}
