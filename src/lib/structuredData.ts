import type { Tournament } from '@/data/tournaments'
import type { Guide } from '@/data/guides'
import type { site as siteData } from '@/data/site'

type Site = typeof siteData

/** Build an absolute URL on the site origin from a root-relative path. */
function absoluteUrl(siteUrl: string, path: string): string {
  return `${siteUrl}${path}`
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
 * Includes standard Article fields: headline, description, datePublished,
 * dateModified, author, and publisher.
 */
export function guideArticleJsonLd(guide: Guide, site: Site): Record<string, unknown> {
  const url = absoluteUrl(site.url, `/guides/${guide.slug}/`)
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.updatedAt,
    dateModified: guide.updatedAt,
    mainEntityOfPage: url,
    author: { '@type': 'Organization', name: site.name },
    publisher: { '@type': 'Organization', name: site.name },
  }
}
