import { computed, ref } from 'vue'

export interface DraftStep {
  team: 'A' | 'B'
  action: 'ban' | 'pick'
}

export interface DraftConfig {
  bansPerTeam: number
  picksPerTeam: number
  teamA: string
  teamB: string
}

export interface DraftState {
  config: DraftConfig
  /** civ id theo thứ tự đã chọn, khớp index của sequence. */
  choices: string[]
}

export const LAC_HONG_PRESET = { bansPerTeam: 1, picksPerTeam: 1 }

export function buildSequence(bansPerTeam: number, picksPerTeam: number): DraftStep[] {
  const seq: DraftStep[] = []
  for (let i = 0; i < bansPerTeam; i++) {
    seq.push({ team: 'A', action: 'ban' }, { team: 'B', action: 'ban' })
  }
  for (let i = 0; i < picksPerTeam; i++) {
    seq.push({ team: 'A', action: 'pick' }, { team: 'B', action: 'pick' })
  }
  return seq
}

export function encodeDraft(state: DraftState): string {
  // base64url của JSON, an toàn cho URL.
  const json = JSON.stringify(state)
  const b64 = btoa(unescape(encodeURIComponent(json)))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeDraft(s: string): DraftState | null {
  try {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(escape(atob(b64)))
    const parsed = JSON.parse(json)
    if (!parsed?.config || !Array.isArray(parsed.choices)) return null
    return parsed as DraftState
  } catch {
    return null
  }
}

export function useCivDraft(initial: DraftState) {
  const config = ref<DraftConfig>(initial.config)
  const choices = ref<string[]>([...initial.choices])
  const sequence = computed(() =>
    buildSequence(config.value.bansPerTeam, config.value.picksPerTeam),
  )
  const currentIndex = computed(() => choices.value.length)
  const currentStep = computed<DraftStep | null>(
    () => sequence.value[currentIndex.value] ?? null,
  )
  const isComplete = computed(() => currentIndex.value >= sequence.value.length)
  const used = computed(() => new Set(choices.value))

  function choose(civId: string) {
    if (isComplete.value || used.value.has(civId)) return
    choices.value.push(civId)
  }

  function reset() {
    choices.value = []
  }

  const shareUrl = computed(() => {
    const token = encodeDraft({ config: config.value, choices: choices.value })
    return `${typeof location !== 'undefined' ? location.origin : ''}/tools/civ-draft?d=${token}`
  })

  return { config, choices, sequence, currentStep, isComplete, used, choose, reset, shareUrl }
}
