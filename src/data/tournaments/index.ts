import { lacHong } from './lac-hong'
export type { Tournament, Prize, TournamentLinks, Venue } from './lac-hong'

export const tournaments = [lacHong]

export function getTournamentBySlug(slug: string) {
  return tournaments.find((t) => t.slug === slug)
}
