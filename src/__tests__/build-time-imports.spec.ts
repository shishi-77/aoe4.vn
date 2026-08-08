import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Vite loads `vite.config.ts` before the `@/` alias is registered, so every module
 * the config reaches - directly or transitively - must avoid alias VALUE imports.
 * `import type` is erased before the loader sees it and is safe.
 *
 * The gate for that rule is ESLint, not this file:
 * `app/no-alias-value-imports-in-build-time-modules` in eslint.config.ts. It has
 * to be, because `vitest.config.ts` itself imports `./vite.config` - so a bad
 * alias import kills the test runner at startup with
 * "Cannot find package '@/data'" and no test in this suite ever executes. A test
 * cannot police a failure that stops it from running.
 *
 * What this file guards instead is the ESLint rule's blind spot. That rule matches
 * a hand-written list of globs, and a module added to the build-time graph but not
 * to the list would go unguarded - the same silent-drift shape that the two
 * tournament lists had. So: pin the graph. Adding a module here fails this test,
 * and the fix is to widen the ESLint rule to cover it.
 */

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const SRC = join(ROOT, 'src')
const CONFIG = join(ROOT, 'vite.config.ts')

/** `import ... from 'x'`, capturing a leading `type` keyword and the specifier. */
const IMPORT_PATTERN = /^import\s+(type\s+)?[^'"]*?['"]([^'"]+)['"]/gm

/**
 * Every project module reachable from vite.config.ts. Kept in sync by this test
 * on purpose: if you add a module to this graph, add it to the ESLint rule's
 * `files` list in eslint.config.ts as well, then update this list.
 */
const EXPECTED_GRAPH = [
  'src/data/faq.ts',
  'src/data/guides/aoe4-khac-de-che-the-nao.ts',
  'src/data/guides/aoe4-vs-aoe2-khac-biet-cot-loi.ts',
  'src/data/guides/build-order-co-ban-aoe4.ts',
  'src/data/guides/cac-che-do-choi-aoe4.ts',
  'src/data/guides/cac-nen-van-minh-aoe4.ts',
  'src/data/guides/cach-tai-aoe4.ts',
  'src/data/guides/cau-hinh-may-aoe4.ts',
  'src/data/guides/cung-r-ngua-chem-aoe4.ts',
  'src/data/guides/de-che-co-nhung-ban-nao.ts',
  'src/data/guides/game-rts-nao-de-bat-dau-2026.ts',
  'src/data/guides/huong-dan-aoe4-nguoi-moi.ts',
  'src/data/guides/index.ts',
  'src/data/guides/tim-nguoi-viet-choi-aoe4.ts',
  'src/data/guides/tuong-thanh-phong-thu-aoe4.ts',
  'src/data/news/index.ts',
  'src/data/news/ra-mat-chuyen-muc-tin-tuc.ts',
  'src/data/site.ts',
  'src/data/tournaments/ha-noi-open-1.data.ts',
  'src/data/tournaments/lac-hong.data.ts',
  'src/data/tournaments/data.ts',
  'src/data/tournaments/types.ts',
  'src/lib/contentMarkdown.ts',
  'src/lib/llmsTxt.ts',
  'src/lib/sitemap.ts',
  'vite.config.ts',
].sort()

interface ModuleImport {
  specifier: string
  /** True for statement-level `import type`, which never survives to the loader. */
  typeOnly: boolean
}

function parseImports(source: string): ModuleImport[] {
  return [...source.matchAll(IMPORT_PATTERN)].map((match) => ({
    specifier: match[2],
    typeOnly: Boolean(match[1]),
  }))
}

/**
 * Resolve a specifier to a TypeScript file inside the project.
 * Returns null for bare package names and for assets, neither of which we walk.
 */
function resolveModule(specifier: string, fromFile: string): string | null {
  let base: string
  if (specifier.startsWith('@/')) base = join(SRC, specifier.slice(2))
  else if (specifier.startsWith('.')) base = resolve(dirname(fromFile), specifier)
  else return null

  for (const candidate of [`${base}.ts`, join(base, 'index.ts')]) {
    if (existsSync(candidate)) return candidate
  }
  return null
}

/** Repo-relative path with forward slashes, so assertions read the same on Windows. */
function repoPath(file: string): string {
  return relative(ROOT, file).split('\\').join('/')
}

interface AliasValueImport {
  file: string
  specifier: string
}

/** Walk every module reachable from vite.config.ts. */
function walkBuildTimeGraph(): { visited: string[]; offenders: AliasValueImport[] } {
  const visited = new Set<string>()
  const offenders: AliasValueImport[] = []
  const queue = [CONFIG]

  while (queue.length > 0) {
    const file = queue.shift() as string
    if (visited.has(file)) continue
    visited.add(file)

    for (const entry of parseImports(readFileSync(file, 'utf8'))) {
      if (entry.specifier.startsWith('@/') && !entry.typeOnly) {
        offenders.push({ file: repoPath(file), specifier: entry.specifier })
      }
      const target = resolveModule(entry.specifier, file)
      if (target && !visited.has(target)) queue.push(target)
    }
  }

  return { visited: [...visited].map(repoPath).sort(), offenders }
}

describe('đồ thị import lúc nạp vite.config', () => {
  const { visited, offenders } = walkBuildTimeGraph()

  it('đúng bằng danh sách module mà rule ESLint đang phủ', () => {
    expect(visited).toEqual(EXPECTED_GRAPH)
  })

  it('không kéo theo lớp gắn banner, nơi alias value import là hợp lệ', () => {
    expect(visited).not.toContain('src/data/tournaments/lac-hong.ts')
    expect(visited).not.toContain('src/data/tournaments/ha-noi-open-1.ts')
  })

  it('không module nào trong đồ thị dùng alias @/ cho value import', () => {
    // Belt and braces. Today a violation kills the runner before this can fail,
    // so ESLint is what actually catches it - but this starts working the moment
    // vitest.config.ts stops importing ./vite.config.
    expect(offenders).toEqual([])
  })
})
