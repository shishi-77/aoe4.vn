import { lacHong } from './lac-hong'
import { haNoiOpen1 } from './ha-noi-open-1'
export type { Tournament, Prize, TournamentLinks, Venue } from './lac-hong'

export const tournaments = [lacHong, haNoiOpen1]

export function getTournamentBySlug(slug: string) {
  return tournaments.find((t) => t.slug === slug)
}
