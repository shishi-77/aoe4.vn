/**
 * Game-naming convention checker.
 *
 * House rule (see CLAUDE.md): reader-facing prose names every game in Vietnamese -
 * `Đế chế 1`, `Đế chế 2`, `Đế chế 3`, `Đế chế 4`. Abbreviations (`AoE4`) and official
 * English names (`Age of Empires IV`) belong to the technical zone (page title,
 * description, slug, meta/JSON-LD), where they carry search traffic.
 *
 * Prose may still reach for them in two bounded cases, both checked here:
 *   1. A gloss parenthetical opened right after the Vietnamese name, which is how a
 *      reader learns the alias: `Đế chế 4 (tên chính thức Age of Empires IV, viết tắt AoE4)`.
 *   2. A quoted literal the reader must type or look for: `Tìm "Age of Empires IV" trong cửa hàng`.
 *
 * Bare `Đế chế` denotes the SERIES, never one game, so it must either carry a number or
 * follow a series marker (`dòng Đế chế`, `cộng đồng Đế chế`).
 */

/** Words that make a following bare `Đế chế` unambiguously mean the series, not one game. */
const SERIES_MARKERS = ['dòng', 'series', 'cộng đồng', 'làng']

const SERIES_MARKER_TAIL = new RegExp(`(?:${SERIES_MARKERS.join('|')})(?:\\s+game)?\\s+$`, 'i')

const GAME_NAME = 'Đế chế'
const ABBREVIATION = /AoE(?:\s?[0-9]+)?/gi
const OFFICIAL_NAME = /Age of Empires(?:\s+(?:IV|III|II|I))?/g
const BARE_NAME = new RegExp(GAME_NAME, 'g')
const FOLLOWED_BY_NUMBER = /^\s+[1-4]\b/

/** A gloss opens with `(` placed directly after `Đế chế` or `Đế chế <n>`. */
const GLOSS_OPENER = new RegExp(`${GAME_NAME}(?:\\s+[1-4])?\\s*\\(`, 'g')

const QUOTE_PAIRS: [string, string][] = [
  ['"', '"'],
  ['“', '”'],
]

interface Span {
  start: number
  end: number
}

function inAnySpan(index: number, spans: Span[]): boolean {
  return spans.some((s) => index >= s.start && index < s.end)
}

/** Ranges of `Đế chế ... ( ... )` gloss parentheticals, where an alias may appear. */
function glossSpans(text: string): Span[] {
  const spans: Span[] = []
  for (const match of text.matchAll(GLOSS_OPENER)) {
    const open = match.index + match[0].length - 1
    const close = text.indexOf(')', open)
    spans.push({ start: open, end: close === -1 ? text.length : close })
  }
  return spans
}

/** Ranges inside quotation marks, where a literal store or launcher entry may appear. */
function quotedSpans(text: string): Span[] {
  const spans: Span[] = []
  for (const [open, close] of QUOTE_PAIRS) {
    let from = 0
    while (from < text.length) {
      const start = text.indexOf(open, from)
      if (start === -1) break
      const end = text.indexOf(close, start + 1)
      if (end === -1) break
      spans.push({ start, end: end + 1 })
      from = end + 1
    }
  }
  return spans
}

function excerpt(text: string, index: number): string {
  const start = Math.max(0, index - 30)
  const raw = text.slice(start, Math.min(text.length, index + 40))
  return `${start > 0 ? '...' : ''}${raw}${index + 40 < text.length ? '...' : ''}`
}

function checkText(text: string): string[] {
  const failures: string[] = []
  const gloss = glossSpans(text)
  const quoted = quotedSpans(text)

  for (const match of text.matchAll(ABBREVIATION)) {
    if (inAnySpan(match.index, gloss)) continue
    // A dot right after the match means a hostname (aoe4.vn), not a game reference.
    if (text[match.index + match[0].length] === '.') continue
    failures.push(
      `abbreviation "${match[0]}" in prose - use "Đế chế <n>", or gloss it once as "Đế chế 4 (viết tắt AoE4)": ${excerpt(text, match.index)}`,
    )
  }

  for (const match of text.matchAll(OFFICIAL_NAME)) {
    if (inAnySpan(match.index, gloss) || inAnySpan(match.index, quoted)) continue
    failures.push(
      `official name "${match[0]}" in prose - use "Đế chế <n>", gloss it after the Vietnamese name, or quote it when the reader must search for it: ${excerpt(text, match.index)}`,
    )
  }

  for (const match of text.matchAll(BARE_NAME)) {
    const after = text.slice(match.index + GAME_NAME.length)
    if (FOLLOWED_BY_NUMBER.test(after)) continue
    const before = text.slice(0, match.index)
    if (SERIES_MARKER_TAIL.test(before)) continue
    // Quoted `"Đế chế"` mentions the name itself rather than naming a game with it.
    if (inAnySpan(match.index, quoted)) continue
    failures.push(
      `bare "Đế chế" must name a game ("Đế chế 1") or follow a series marker (${SERIES_MARKERS.join(', ')}): ${excerpt(text, match.index)}`,
    )
  }

  return failures
}

/** Naming failures across reader-facing prose (headings, paragraphs, questions, answers). */
export function gameNamingFailures(texts: string[]): string[] {
  return texts.flatMap(checkText)
}
