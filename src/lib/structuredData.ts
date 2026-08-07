import type { Tournament } from '@/data/tournaments'
import type { Guide } from '@/data/guides'
import type { NewsPost } from '@/data/news'
import type { site as siteData } from '@/data/site'

type Site = typeof siteData

/** Build an absolute URL on the site origin from a root-relative path. */
function absoluteUrl(siteUrl: string, path: string): string {
  return `${siteUrl}${path}`
}

/** Person when the owner has filled in site.author, Organization otherwise. */
function articleAuthor(site: Site): Record<string, unknown> {
  if (!site.author.name) return { '@type': 'Organization', name: site.name }
  const person: Record<string, unknown> = { '@type': 'Person', name: site.author.name }
  if (site.author.url) person.url = site.author.url
  return person
}

/** Shared fields telling an answer engine what this article is and where it lives. */
function articleContext(site: Site): Record<string, unknown> {
  return {
    inLanguage: 'vi-VN',
    isPartOf: { '@type': 'WebSite', name: site.name, url: absoluteUrl(site.url, '/') },
    about: { '@type': 'VideoGame', name: 'Age of Empires IV' },
  }
}

/**
 * Schema.org citation list. Returns an empty object when there are no sources,
 * so spreading it omits the key entirely - an empty array trips Search Console.
 */
function citations(sources: Array<{ name?: string; url: string }>): Record<string, unknown> {
  if (sources.length === 0) return {}
  return {
    citation: sources.map((s) => ({
      '@type': 'CreativeWork',
      ...(s.name ? { name: s.name } : {}),
      url: s.url,
    })),
  }
}

/**
 * Schema.org SportsEvent for a tournament detail page.
 *
 * Includes the fields Google Search Console flags as recommended for Events
 * (`description`, `performer`, `offers`) on top of the required ones.
 */
export function tournamentEventJsonLd(
  tournament: Tournament,
  site: Site,
): Record<string, unknown> {
  const url = absoluteUrl(site.url, `/tournaments/${tournament.slug}/`)
  const image = absoluteUrl(site.url, tournament.ogImage ?? tournament.banner)
  const isFree = /miễn phí/i.test(tournament.entryFee)

  const description =
    `${tournament.name} - giải đấu ${tournament.game} ${tournament.format} do ` +
    `${tournament.organizer} tổ chức tại ${tournament.venue.name}, ${tournament.dateLabel}. ` +
    `Tổng giải thưởng ${tournament.prizePoolTotal}.`

  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: tournament.name,
    description,
    sport: 'Esports',
    startDate: tournament.startsAt,
    endDate: tournament.endsAt,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image,
    url,
    isAccessibleForFree: isFree,
    location: {
      '@type': 'Place',
      name: tournament.venue.name,
      address: tournament.venue.address,
    },
    organizer: {
      '@type': 'Organization',
      name: tournament.organizer,
      url: tournament.links.discord,
    },
    performer: {
      '@type': 'PerformingGroup',
      name: 'Các đội tuyển Age of Empires IV Việt Nam',
    },
    offers: {
      '@type': 'Offer',
      price: isFree ? '0' : tournament.entryFee,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: tournament.links.discord,
      validThrough: tournament.registrationClosesAt,
    },
  }
}

/** Schema.org Organization describing the site/community (home page). */
export function organizationJsonLd(site: Site): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: absoluteUrl(site.url, '/'),
    logo: absoluteUrl(site.url, '/og.jpg'),
    description: site.description,
    sameAs: [site.links.discord, site.links.facebook, site.links.youtube, site.links.blog],
  }
}

/** Schema.org WebSite for the home page. */
export function websiteJsonLd(site: Site): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: absoluteUrl(site.url, '/'),
    description: site.description,
    inLanguage: 'vi-VN',
  }
}

/**
 * Schema.org Article for a guide detail page.
 *
 * Includes standard Article fields: headline, description, image,
 * datePublished, dateModified, author, and publisher.
 */
export function guideArticleJsonLd(guide: Guide, site: Site): Record<string, unknown> {
  const url = absoluteUrl(site.url, `/guides/${guide.slug}/`)
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    image: absoluteUrl(site.url, '/og.jpg'),
    datePublished: guide.updatedAt,
    dateModified: guide.updatedAt,
    mainEntityOfPage: url,
    ...articleContext(site),
    author: articleAuthor(site),
    publisher: { '@type': 'Organization', name: site.name },
    ...citations((guide.sources ?? []).map((u) => ({ url: u }))),
  }
}

/**
 * Schema.org NewsArticle for a news post page.
 */
export function newsArticleJsonLd(post: NewsPost, site: Site): Record<string, unknown> {
  const url = absoluteUrl(site.url, `/news/${post.slug}/`)
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.description,
    image: absoluteUrl(site.url, '/og.jpg'),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: url,
    ...articleContext(site),
    author: articleAuthor(site),
    publisher: { '@type': 'Organization', name: site.name },
    ...citations(post.sources.map((s) => ({ name: s.label, url: s.url }))),
  }
}
