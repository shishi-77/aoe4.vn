export interface Prize {
  rank: number
  label: string
  amount: string
  medal?: string
  note?: string
}

export interface TournamentLinks {
  discord: string
  banPick: string
  mapPool: string
  youtube: string
}

export interface Venue {
  name: string
  address: string
  /** Google Maps link for the venue address. */
  mapsUrl: string
}

export interface Tournament {
  slug: string
  name: string
  game: string
  format: string
  /** Bundled banner image (import from @/assets/imgs/...). */
  banner: string
  organizer: string
  entryFee: string
  registrationType: string
  venue: Venue
  /** ISO 8601 with explicit +07:00 offset (Vietnam time). */
  startsAt: string
  /** When the event is considered finished (ISO 8601, +07:00). */
  endsAt: string
  /** Registration cut-off (ISO 8601, +07:00). After this the CTAs switch to "join Discord". */
  registrationClosesAt: string
  /** Human-readable Vietnamese date/time label for display (kept in sync with startsAt). */
  dateLabel: string
  prizePoolTotal: string
  /** Bracket/series description shown in FormatSection, e.g. "BO3 - loại trực tiếp". */
  bracketFormat: string
  prizes: Prize[]
  maps: string[]
  links: TournamentLinks
  rules: string[]
  notes: string[]
  registrationDeadline: string
  ogImage?: string
}

/**
 * A tournament minus its bundled banner image.
 *
 * `vite.config.ts` is loaded before the `@/` alias exists, so anything it reads
 * must not import an asset. Build-time tooling consumes this shape; the runtime
 * app keeps using `Tournament`.
 */
export type TournamentData = Omit<Tournament, 'banner'>
