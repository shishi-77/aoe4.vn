import type { TournamentData } from './types'
import { lacHongData } from './lac-hong.data'
import { haNoiOpen1Data } from './ha-noi-open-1.data'

/**
 * Asset-free tournament data, safe to import from build tooling that runs
 * before the `@/` alias is available. Same order as `tournaments`.
 */
export const tournamentsData: TournamentData[] = [lacHongData, haNoiOpen1Data]
