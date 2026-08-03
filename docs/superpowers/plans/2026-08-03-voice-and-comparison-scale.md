# Voice Foundation + Comparison Scale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix article voice at the root (real exemplar corpus + stricter judge), add the `comparison` article kind with tiered facts rules, and put article production on a Mon/Wed/Fri scheduled agent at 2-3 PRs/week.

**Architecture:** Two phases separated by a hard owner gate. Phase A builds the voice foundation: owner-pasted exemplar corpus in `docs/voice-corpus/`, a distilled `voice-guide.md` consumed by the write-article skill, real-excerpt anchors in the guide-evaluator judge prompt, and new golden fixtures capturing "PASS-but-stiff" articles. A blind test (owner prefers new version in >= 2/3 articles) gates Phase B. Phase B adds `kind: 'comparison'` across `guideVerdict`/`contentQueue`/`Guide` types, generalizes the AoE1-respect hard gate to all RTS games, extends both skills with a comparison mode (tiered facts: AoE1 = corpus only, AoE4 = corpus or official URL, AoE2/AoE3/StarCraft = official URL verified by WebFetch), seeds ~15 comparison topics, and creates a scheduled cloud routine that writes one article per run and opens a PR (never merges).

**Tech Stack:** Vue 3 + Vite static site (no UI changes in this plan), TypeScript data files, vitest, Claude Code skills (markdown), scheduled cloud routine via the `schedule` skill.

**Spec:** `docs/superpowers/specs/2026-08-03-voice-and-comparison-scale-design.md`

## Global Constraints

- Never commit to `main`. Phase A work happens on branch `claude/voice-foundation`; Phase B on `claude/comparison-kind` (branched from main after Phase A merges).
- `docs/` is in `.gitignore` (line 36). Every commit touching `docs/**` MUST use `git add -f` (repo precedent: spec/plan commits fbe5375, ffd03f1).
- Use hyphen `-` in all content, NEVER em-dash. Em-dash in an article caps voice at 3 (evaluator rule).
- English for identifiers/branch names/commit messages; Vietnamese only for user-facing display text and skill/doc prose (repo precedent).
- Import with `@/` alias, never relative `../`.
- Before every PR: `npm run lint:check && npm run type-check && npm run test:run` - all green.
- Voice corpus samples are for internal style learning ONLY - never republish or copy sentences from them into articles.
- Machine never merges PRs. Owner is the only merger.
- Owner checkpoints (marked `[OWNER]`) require the owner in the session - if absent, stop at the checkpoint and resume next session.

---

# Phase A - Voice foundation (branch `claude/voice-foundation`)

### Task 1: Voice corpus scaffolding

**Files:**
- Create: `docs/voice-corpus/README.md`
- Create: `docs/voice-corpus/samples.md`

**Interfaces:**
- Produces: `docs/voice-corpus/samples.md` - the owner-maintained exemplar file all later tasks read. Sample entry format: `## Mẫu N` heading, `- Nguồn:` line, optional `- Thích vì:` line, then the excerpt as `>` blockquote lines.

- [ ] **Step 1: Create branch**

```bash
git checkout main && git pull && git checkout -b claude/voice-foundation
```

- [ ] **Step 2: Write `docs/voice-corpus/README.md`**

```markdown
# Kho văn mẫu (voice corpus)

Nơi owner dán văn mẫu "chuẩn gu" để máy học giọng. Máy KHÔNG bao giờ trích đăng
các đoạn này lên site - chỉ dùng nội bộ để chưng cất `voice-guide.md`.

## Cách thêm mẫu

Mở `samples.md`, dán thêm một mục theo format:

    ## Mẫu N
    - Nguồn: <post cộng đồng Đế chế / cây bút ngoài Đế chế - ghi chung chung, không cần link>
    - Thích vì: <1 dòng, không bắt buộc>

    > Đoạn văn nguyên bản dán vào đây.
    > Giữ xuống dòng bằng nhiều dòng ">".

Sau khi thêm/sửa mẫu: chạy lại "Bước 0 - Chuẩn bị giọng văn" trong skill
write-article để sinh lại `voice-guide.md`. Không sửa tay voice-guide.md.

## Quy tắc

- 10-20 mẫu là đủ dùng; thêm dần khi gặp mẫu đắt.
- Mẫu chỉ cần là đoạn 2-6 câu có chất giọng rõ; không cần cả bài.
- Văn mẫu chỉ dùng nội bộ - không trích đăng, không chép nguyên câu vào bài.
- Thư mục này nằm trong `docs/` (gitignore) nên khi commit phải dùng `git add -f`.
```

- [ ] **Step 3: Write `docs/voice-corpus/samples.md`**

```markdown
# Văn mẫu chuẩn gu (owner dán vào đây)

Format mỗi mục: xem README.md cùng thư mục. Mục "Mẫu 1" dưới đây chỉ minh họa
format - XÓA nó khi dán mẫu thật đầu tiên.

## Mẫu 1
- Nguồn: (post cộng đồng / cây bút ngoài Đế chế)
- Thích vì: (không bắt buộc)

> (dán đoạn văn vào đây)
```

- [ ] **Step 4: Commit (force-add, docs/ is gitignored)**

```bash
git add -f docs/voice-corpus/README.md docs/voice-corpus/samples.md
git commit -m "feat(voice): scaffold voice corpus for owner exemplars"
```

- [ ] **Step 5: [OWNER] Owner pastes 10-20 samples into `samples.md`**

Stop and ask the owner to paste samples now (community posts + non-AoE Vietnamese writers they like). Verification: `samples.md` contains >= 10 `## Mẫu` entries and the placeholder "Mẫu 1" is gone. Then:

```bash
git add -f docs/voice-corpus/samples.md
git commit -m "feat(voice): add owner-curated voice samples"
```

---

### Task 2: Distill voice-guide.md and add "Bước 0" to write-article

**Files:**
- Create: `docs/voice-corpus/voice-guide.md` (generated from samples)
- Modify: `.claude/skills/write-article/SKILL.md`

**Interfaces:**
- Consumes: `docs/voice-corpus/samples.md` from Task 1.
- Produces: `docs/voice-corpus/voice-guide.md` with two fixed top-level sections: `## Đặc điểm giọng` (trait bullets, each with a verbatim corpus quote) and `## Few-shot (5-8 đoạn đắt nhất)` (each excerpt under a `###` context label: `mở bài` / `giải thích cơ chế` / `nêu quan điểm` / `chốt hạ`). Task 3 pulls judge anchors from the Few-shot section.

- [ ] **Step 1: Insert "Bước 0" into `.claude/skills/write-article/SKILL.md`**

Insert this block immediately BEFORE the line `## Bước 1 - Facts sheet`:

```markdown
## Bước 0 - Chuẩn bị giọng văn (bắt buộc trước khi viết bất kỳ bài nào)

1. Đọc `docs/voice-corpus/voice-guide.md`. Nếu file chưa có, hoặc
   `docs/voice-corpus/samples.md` đã đổi sau lần sinh ghi ở đầu voice-guide ->
   chưng cất lại: đọc TOÀN BỘ samples.md, viết voice-guide.md gồm đúng hai mục:
   - `## Đặc điểm giọng`: nhịp và độ dài câu, từ vựng và xưng hô, cách vào bài,
     cách chốt, cách nêu quan điểm - MỖI đặc điểm kèm một trích dẫn nguyên văn
     từ corpus làm ví dụ.
   - `## Few-shot (5-8 đoạn đắt nhất)`: mỗi đoạn dưới một heading `###` nhãn
     ngữ cảnh (mở bài / giải thích cơ chế / nêu quan điểm / chốt hạ), trích
     nguyên văn dạng blockquote.
   Dòng đầu file: `> Sinh tự động từ samples.md ngày YYYY-MM-DD, N mẫu - không sửa tay.`
   Commit bằng `git add -f` (docs/ nằm trong gitignore).
2. Văn mẫu CHỈ để học giọng - TUYỆT ĐỐI không chép nguyên câu từ corpus vào bài.
   Bài viết ra là văn mới cùng chất giọng.
3. Chống công thức: đọc mở bài + chốt bài của 3 bài mới nhất trên site (theo
   updatedAt/publishedAt); bài sắp viết không được lặp khuôn mở/chốt của chúng.
```

- [ ] **Step 2: Point Bước 3 of write-article at the voice-guide**

In the same file, replace:

```
3. CHỈ dùng claim đã duyệt trong facts sheet. Giọng văn: theo mỏ neo trong guide-evaluator
   (tự nhiên, không "văn AI", không slang gượng, TUYỆT ĐỐI không dìm AoE1).
```

with:

```
3. CHỈ dùng claim đã duyệt trong facts sheet. Giọng văn: viết theo
   `docs/voice-corpus/voice-guide.md` (đặc điểm + few-shot, đã đọc ở Bước 0) ngay từ
   nháp đầu - không viết chay rồi chờ evaluator vá. Tự nhiên, không "văn AI", không
   slang gượng, TUYỆT ĐỐI không dìm game/cộng đồng RTS nào (AoE1, AoE2, AoE3, StarCraft...).
```

- [ ] **Step 3: Run the distillation once, now**

Follow the Bước 0 procedure just written: read all of `samples.md`, write `docs/voice-corpus/voice-guide.md` in exactly the two-section structure above. Verification: file exists, has both `##` sections, every trait bullet quotes the corpus verbatim, Few-shot has 5-8 labeled excerpts.

- [ ] **Step 4: Commit**

```bash
git add -f docs/voice-corpus/voice-guide.md
git add .claude/skills/write-article/SKILL.md
git commit -m "feat(voice): distill voice guide and wire it into write-article as step 0"
```

---

### Task 3: Evaluator anchor swap + new golden fixtures + calibration run

**Files:**
- Modify: `.claude/skills/guide-evaluator/SKILL.md` (pinned judge prompt, voice ~8 anchor)
- Create: `.claude/skills/guide-evaluator/golden/frozen-bad-voice-v2-<slug>.md` (one per owner-flagged article, 2-3 files)
- Modify: `.claude/skills/guide-evaluator/golden/expected.json`
- Modify: `.claude/skills/guide-evaluator/golden/README.md`

**Interfaces:**
- Consumes: `voice-guide.md` Few-shot section from Task 2.
- Produces: updated pinned prompt (calibration-relevant change) + golden cases named `frozen-bad-voice-v2-<slug>` with `{ "kind": "strategy", "expect": { "voiceMax": 6 } }`.

- [ ] **Step 1: [OWNER] Owner names the PASS-but-stiff articles**

Ask the owner to name 2-3 slugs of CURRENT articles (latest main versions) they still find stiff/bland ("đơ/nhạt"). Record slugs and one-line owner reason each. These drive both the fixtures here and the blind test in Task 4.

- [ ] **Step 2: Swap the voice ~8 anchor to real corpus excerpts**

In `.claude/skills/guide-evaluator/SKILL.md`, inside the PROMPT GHIM block, replace the line:

```
- voice ~8 (vừa, giọng dân Đế chế gãy gọn): "Đế chế đánh random, ra quân nào đánh theo bài quân đó."
```

with (fill the two quotes with the two SHORTEST excerpts from the voice-guide Few-shot section, preferring labels `giải thích cơ chế` and `nêu quan điểm`; keep each under ~25 words, no em-dash):

```
- voice ~8 (vừa, văn thật của người thật - chuẩn đối chiếu): "<trích few-shot 1>" /
  "<trích few-shot 2>". Bài đạt 8+ khi đọc lẫn được vào giọng này; thấp hơn rõ rệt -> 6 trở xuống.
```

- [ ] **Step 3: Freeze the flagged articles as golden fixtures**

For each owner-flagged slug, create `.claude/skills/guide-evaluator/golden/frozen-bad-voice-v2-<slug>.md` following the existing fixture format exactly (see `frozen-bad-voice-cung-r-ngua-chem-aoe4.md`):

```
FIXTURE ĐÔNG LẠNH từ src/data/guides/<slug>.ts tại main (<short-sha>) - nhãn owner: <lý do owner> (2026-08-03). Không theo dõi file gốc.
FIXTURE dùng làm mẫu TRƯỢT voice - KHÔNG DÙNG LÀM MẪU VĂN TỐT.

```ts
<verbatim content of git show main:src/data/guides/<slug>.ts>
```
```

Get content with: `git show main:src/data/guides/<slug>.ts` and sha with `git rev-parse --short main`.

- [ ] **Step 4: Register cases in `expected.json` and note in README**

Add one entry per fixture to `.claude/skills/guide-evaluator/golden/expected.json`:

```json
"frozen-bad-voice-v2-<slug>": { "kind": "strategy", "expect": { "voiceMax": 6 } }
```

(If a flagged article is `kind: 'utility'`, use `"kind": "utility"` instead - check the guide's data file.) Append to `golden/README.md`:

```
- Các file frozen-bad-voice-v2-* là bản main 2026-08-03 của bài owner chê "đơ/nhạt
  dù PASS" - nhãn để calibration bắt kiểu lệch "judge dễ tính hơn owner".
```

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/guide-evaluator/SKILL.md .claude/skills/guide-evaluator/golden/
git commit -m "feat(evaluator): real-corpus voice anchors + v2 golden fixtures for owner-flagged stiff articles"
```

- [ ] **Step 6: Run calibration and check the report**

Invoke the `evaluator-calibrate` skill (full run, all cases). Expected: every old fixture still passes its expectation AND every new `frozen-bad-voice-v2-*` case scores voice <= 6. If a new case scores 7+: the anchor swap was too weak - pick sharper few-shot excerpts (Step 2) and re-run. If old `frozen-good-*` cases now fail floors: anchors overshot - add back one mid-range comparison sentence to the anchor line ("giọng hướng dẫn gãy gọn tự nhiên vẫn là 7-8, không phải mọi bài đều dưới chuẩn văn mẫu") and re-run. Iterate max 3 times; if still failing, stop and report to owner.

- [ ] **Step 7: Commit calibration artifacts**

```bash
git add -f docs/reviews/
git commit -m "test(evaluator): calibration run after anchor swap"
```

---

### Task 4: Blind test gate (polish 2-3 articles, owner picks blind)

**Files:**
- Modify: `src/data/guides/<slug>.ts` (the 2-3 owner-flagged articles)
- Create (scratchpad, NOT committed): blind comparison docs + mapping file

**Interfaces:**
- Consumes: flagged slugs from Task 3 Step 1; upgraded writer (Task 2) and evaluator (Task 3).
- Produces: gate verdict PASS (owner prefers new >= 2/3) or FAIL. PASS unlocks Phase B.

- [ ] **Step 1: Polish each flagged article with the new pipeline**

For each slug, run the ralph-loop polish command exactly as documented at the bottom of `.claude/skills/guide-evaluator/SKILL.md` (the `/ralph-loop "Trau chuốt guide <slug>..."` block), with ONE addition to its prompt: "Trước khi sửa, đọc docs/voice-corpus/voice-guide.md và viết theo giọng đó." Do NOT commit mid-loop (the regression gate baselines against HEAD).

- [ ] **Step 2: Build blind comparison docs in the scratchpad**

For each article create `<scratchpad>/blind-<slug>.md` containing "Bản A" and "Bản B" - the old (git HEAD) and new (working tree) `paragraphs` text, order randomized per article (e.g. by coin flip using the second character of the git sha). Record the mapping in `<scratchpad>/blind-mapping.md`. Do not show the mapping to the owner.

- [ ] **Step 3: [OWNER] Owner picks blind**

Owner reads each `blind-<slug>.md` and answers "A hay B đọc hay hơn?" per article. Then reveal the mapping.

- [ ] **Step 4: Apply the verdict**

- Owner picked the NEW version in >= 2/3 articles -> gate PASS. Commit:

```bash
git add src/data/guides/
git commit -m "feat(guides): polish owner-flagged articles with voice-guide pipeline"
```

- Gate FAIL -> `git checkout -- src/data/guides/`, ask the owner what reads wrong, adjust corpus samples and/or re-distill voice-guide (Task 2 Step 3), then repeat Task 4. Do NOT proceed to Phase B on a failed gate.

- [ ] **Step 5: Verify and open Phase A PR**

```bash
npm run lint:check && npm run type-check && npm run test:run
```

All green -> push and open PR titled "Voice foundation: exemplar corpus, distilled voice guide, stricter judge anchors" with body: what changed (corpus, Bước 0, anchors, v2 fixtures, polished articles), calibration result summary, blind test result (X/3 owner picked new). [OWNER] merges. After merge, `git checkout main && git pull`.

---

# Phase B - Comparison kind + scale (branch `claude/comparison-kind`, from main AFTER Phase A merges)

### Task 5: `comparison` kind + generalized disparagement in guideVerdict (TDD)

**Files:**
- Modify: `src/lib/guideVerdict.ts`
- Modify: `src/lib/__tests__/guideVerdict.spec.ts`
- Modify: `src/lib/calibration.ts`
- Modify: `src/lib/__tests__/calibration.spec.ts`

**Interfaces:**
- Produces: `GuideKind = 'utility' | 'strategy' | 'comparison'`; `COMPARISON_FLOORS: QualityFloors` (= strategy values); `floorsForKind('comparison')` returns `COMPARISON_FLOORS`; `AccuracyResult.disparagement?: number` (canonical, any-RTS) with `aoe1Disparagement?: number` kept as deprecated alias - `guideVerdict` sums both; `CalibrationResult.disparagement?: number` treated identically. Tasks 6-8 rely on these exact names.

- [ ] **Step 1: Create branch**

```bash
git checkout main && git pull && git checkout -b claude/comparison-kind
```

- [ ] **Step 2: Write failing tests in `src/lib/__tests__/guideVerdict.spec.ts`**

Add inside the existing `describe('guideVerdict', ...)` (reuse existing `strong`/`clean` consts) and import `COMPARISON_FLOORS` in the existing import block:

```ts
it('comparison dùng sàn như strategy', () => {
  expect(floorsForKind('comparison')).toEqual(STRATEGY_FLOORS)
  expect(COMPARISON_FLOORS).toEqual(STRATEGY_FLOORS)
  expect(floorsForArticleKind('comparison')).toEqual(STRATEGY_FLOORS)
})

it('fail nếu dìm bất kỳ game RTS nào (trường disparagement mới)', () => {
  const v = guideVerdict(true, strong, { contradictions: 0, disparagement: 1 })
  expect(v.pass).toBe(false)
  expect(v.reasons.some((r) => r.includes('dìm'))).toBe(true)
})

it('aoe1Disparagement (alias cũ) vẫn chặn PASS và cộng dồn với disparagement', () => {
  expect(guideVerdict(true, strong, { contradictions: 0, aoe1Disparagement: 1 }).pass).toBe(false)
  const v = guideVerdict(true, strong, { contradictions: 0, disparagement: 1, aoe1Disparagement: 1 })
  expect(v.reasons.some((r) => r.includes('2 câu dìm'))).toBe(true)
})
```

Also UPDATE the existing test `'fail nếu dìm Đế chế 1 (dù điểm cao, không mâu thuẫn)'`: change its assertion from `r.includes('dìm Đế chế 1')` to `r.includes('dìm')` (the reason message generalizes in Step 4).

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm run test:run -- guideVerdict`
Expected: FAIL - `COMPARISON_FLOORS` not exported, `disparagement` not a known property, `floorsForKind('comparison')` type error.

- [ ] **Step 4: Implement in `src/lib/guideVerdict.ts`**

1. Change the kind type:

```ts
/** Loại bài quyết định sàn nào áp lên. Mặc định 'strategy' (chặt hơn). */
export type GuideKind = 'utility' | 'strategy' | 'comparison'
```

2. After `UTILITY_FLOORS`, add:

```ts
/**
 * Bài so sánh cầu nối (AoE4 vs AoE2/AoE3/StarCraft...) kéo dân game khác khám phá
 * AoE4. Sống chết ở giọng văn nên sàn giữ nguyên mức strategy.
 */
export const COMPARISON_FLOORS: QualityFloors = STRATEGY_FLOORS
```

3. Replace the body of `floorsForKind`:

```ts
export function floorsForKind(kind: GuideKind | undefined): QualityFloors {
  if (kind === 'utility') return UTILITY_FLOORS
  if (kind === 'comparison') return COMPARISON_FLOORS
  return STRATEGY_FLOORS
}
```

4. In `AccuracyResult`, replace the `aoe1Disparagement` member (and its JSDoc) with:

```ts
  /**
   * Số câu DÌM/HẠ THẤP bất kỳ game/cộng đồng RTS nào (AoE1, AoE2, AoE3, StarCraft...).
   * Người đọc bài so sánh chính là dân game đó - chê game của họ là tự đuổi khách.
   * So sánh làm rõ khác biệt thì được; phán game nào dở/nhàm/lỗi thời -> vi phạm cứng,
   * chặn PASS y như một mâu thuẫn sự thật. Bỏ trống -> coi như 0.
   */
  disparagement?: number
  /** @deprecated Tên cũ (chỉ AoE1). Vẫn được cộng dồn vào disparagement. */
  aoe1Disparagement?: number
```

5. In `guideVerdict`, replace the `aoe1Disparagement` check with:

```ts
  const disparagement = (accuracy.disparagement ?? 0) + (accuracy.aoe1Disparagement ?? 0)
  if (disparagement > 0)
    reasons.push(`respect: ${disparagement} câu dìm game/cộng đồng RTS (AoE1/AoE2/AoE3/StarCraft...) - cấm`)
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test:run -- guideVerdict`
Expected: PASS (all, including the updated legacy test).

- [ ] **Step 6: Write failing calibration test in `src/lib/__tests__/calibration.spec.ts`**

Add (match the file's existing helper style for building expected/results - read the file first and reuse its fixtures/helpers):

```ts
it('trường disparagement mới thỏa được kỳ vọng aoe1DisparagementMin (alias cộng dồn)', () => {
  const expected = {
    'bad-aoe1-disparagement': {
      kind: 'strategy' as const,
      expect: { aoe1DisparagementMin: 1 },
    },
  }
  const results = [{ case: 'bad-aoe1-disparagement', disparagement: 1 }]
  const verdicts = checkCalibration(expected, results)
  expect(verdicts).toHaveLength(1)
  expect(verdicts[0]!.pass).toBe(true)
})
```

Run: `npm run test:run -- calibration` - Expected: FAIL (`disparagement` unknown on `CalibrationResult`, min check reads only `aoe1Disparagement`).

- [ ] **Step 7: Implement in `src/lib/calibration.ts`**

1. In `CalibrationResult`, below `aoe1Disparagement?: number`, add:

```ts
  /** Canonical any-RTS disparagement count; summed with the legacy aoe1Disparagement. */
  disparagement?: number
```

2. In `checkCalibration`, before the `aoe1DisparagementMin` check, add `const disp = (r.disparagement ?? 0) + (r.aoe1Disparagement ?? 0)` and use `disp` in BOTH the Min and Max checks (replacing `r.aoe1Disparagement ?? 0`), keeping the message text pattern `aoe1Disparagement ${disp} ...` unchanged so existing report tooling still matches.

- [ ] **Step 8: Run full test suite**

Run: `npm run test:run`
Expected: PASS. Then: `npm run type-check` - expected clean.

- [ ] **Step 9: Commit**

```bash
git add src/lib/guideVerdict.ts src/lib/calibration.ts src/lib/__tests__/guideVerdict.spec.ts src/lib/__tests__/calibration.spec.ts
git commit -m "feat(verdict): comparison kind floors + generalize disparagement gate to all RTS games"
```

---

### Task 6: `comparison` in Guide type and content queue (TDD)

**Files:**
- Modify: `src/data/guides/index.ts`
- Modify: `src/lib/contentQueue.ts`
- Modify: `src/lib/__tests__/contentQueue.spec.ts`

**Interfaces:**
- Consumes: nothing new (types only).
- Produces: `Guide.kind?: 'utility' | 'strategy' | 'comparison'`; `Guide.sources?: string[]`; `QueueItem.kind: 'guide' | 'news' | 'comparison'`. Tasks 7-9 rely on these exact names.

- [ ] **Step 1: Write failing test in `src/lib/__tests__/contentQueue.spec.ts`**

Add next to the existing kind test (reuse the file's `item()` helper):

```ts
it('kind comparison hợp lệ, kind lạ vẫn bị bắt', () => {
  expect(validateQueue([item({ kind: 'comparison' })])).toEqual([])
  expect(validateQueue([item({ kind: 'video' })]).length).toBeGreaterThan(0)
})
```

Run: `npm run test:run -- contentQueue` - Expected: FAIL (`comparison` rejected as bad kind; TS may also flag the literal - if so cast `item({ kind: 'comparison' as QueueItem['kind'] })` is NOT needed after Step 2, write it plainly and let it fail at runtime or compile - either failure mode confirms the gap).

- [ ] **Step 2: Implement**

In `src/lib/contentQueue.ts`:
- `kind: 'guide' | 'news'` -> `kind: 'guide' | 'news' | 'comparison'` on `QueueItem`.
- Validation line -> `if (it.kind !== 'guide' && it.kind !== 'news' && it.kind !== 'comparison') problems.push(`${label}: bad kind`)`

In `src/data/guides/index.ts`:
- On `Guide`, change the `kind` member to `kind?: 'utility' | 'strategy' | 'comparison'` and extend its JSDoc with one line: `'comparison' (bài so sánh cầu nối AoE4 vs AoE2/AoE3/StarCraft...) chấm sàn như 'strategy'.`
- Below `kind`, add:

```ts
  /**
   * URL nguồn chính thức cho bài comparison (wiki game, Liquipedia, patch notes...).
   * Chỉ để evaluator truy vết claim - không render lên UI.
   */
  sources?: string[]
```

- [ ] **Step 3: Run tests and type-check**

Run: `npm run test:run && npm run type-check`
Expected: all PASS (guide registry tests untouched; `score-guide-seo.ts` already passes `guide.kind ?? 'strategy'` through, so `comparison` flows to the evaluator automatically).

- [ ] **Step 4: Commit**

```bash
git add src/data/guides/index.ts src/lib/contentQueue.ts src/lib/__tests__/contentQueue.spec.ts
git commit -m "feat(content): comparison kind in Guide type and content queue"
```

---

### Task 7: Evaluator skill - comparison mode + all-RTS respect gate

**Files:**
- Modify: `.claude/skills/guide-evaluator/SKILL.md`

**Interfaces:**
- Consumes: `floorsForKind('comparison')` (Task 5), `Guide.sources` (Task 6).
- Produces: judge protocol where fact-check subagents return JSON key `disparagement` (replacing `aoe1Disparagement`), and a "Chế độ comparison" section. Task 8's write-article changes assume this mode exists.

All edits below are exact old -> new replacements in `.claude/skills/guide-evaluator/SKILL.md`:

- [ ] **Step 1: Generalize the hard gate in the v3 header**

Replace:

```
- **Cổng tôn trọng AoE1 (cứng)**: TUYỆT ĐỐI không dìm/hạ thấp Đế chế 1 (AoE1) hay cộng đồng
  AoE1 - đây là cộng đồng RTS gốc và lớn nhất VN, người đọc chính là dân AoE1. Có bất kỳ câu
  chê AoE1 dở/nhàm/"các phe na ná nhau" -> FAIL cứng như một mâu thuẫn sự thật. So sánh
  AoE1<->AoE4 để LÀM RÕ thì được; hạ thấp AoE1 thì KHÔNG.
```

with:

```
- **Cổng tôn trọng game RTS (cứng)**: TUYỆT ĐỐI không dìm/hạ thấp BẤT KỲ game/cộng đồng RTS
  nào - AoE1 (cộng đồng gốc và lớn nhất VN), AoE2, AoE3, StarCraft... Người đọc bài so sánh
  chính là dân game đó; chê game của họ là tự đuổi khách. Có bất kỳ câu chê một game RTS
  dở/nhàm/lỗi thời/"các phe na ná nhau" -> FAIL cứng như một mâu thuẫn sự thật. So sánh
  giữa các game để LÀM RÕ khác biệt thì được; phán game nào dở hơn thì KHÔNG.
```

- [ ] **Step 2: Generalize the pinned prompt's voice bullet**

In the PROMPT GHIM, replace the sentence fragment:

```
TUYỆT ĐỐI KHÔNG dìm/hạ thấp
  Đế chế 1 (AoE1) hay cộng đồng AoE1 (vd "phe AoE1 na ná nhau", "AoE1 nhàm/cũ kỹ"); so sánh
  AoE1<->AoE4 để làm rõ thì được, chê AoE1 dở thì KHÔNG. Có câu dìm AoE1 -> voice <= 2.
```

with:

```
TUYỆT ĐỐI KHÔNG dìm/hạ thấp
  bất kỳ game/cộng đồng RTS nào - AoE1, AoE2, AoE3, StarCraft... (vd "phe AoE1 na ná nhau",
  "AoE2 lỗi thời"); so sánh giữa các game để làm rõ thì được, chê game nào dở thì KHÔNG.
  Có câu dìm game RTS -> voice <= 2.
```

(Also update the head-to-head prompt in Bước 2.5 the same way: its two sentences about "dìm/hạ thấp Đế chế 1 (AoE1) hay cộng đồng AoE1" become "dìm/hạ thấp bất kỳ game/cộng đồng RTS nào".)

- [ ] **Step 3: Generalize Bước 3 fact-check task 2 and the JSON key**

Replace the "Nhiệm vụ 2" block and JSON line:

```
Nhiệm vụ 2 - quét MỌI câu DÌM/HẠ THẤP Đế chế 1 (AoE1) hoặc cộng đồng AoE1 -> `aoe1Disparagement[]`
(mỗi cái: câu trích + vì sao là dìm). Người đọc chính là dân AoE1; hạ thấp AoE1 là cấm.
- Là dìm: "phe AoE1 na ná nhau", "AoE1 nhàm/cũ kỹ/lỗi thời", "AoE1 nông", "chọn phe AoE1 chỉ đổi màu".
- KHÔNG phải dìm: so sánh trung tính làm rõ điểm khác biệt AoE4 mà không chê AoE1 (vd "AoE4 mỗi
  phe một cơ chế riêng" - nêu đặc điểm AoE4, không đụng chạm AoE1).
Trả JSON: {"contradictions":[...],"claimsToVerify":[...],"aoe1Disparagement":[...]}
```

with:

```
Nhiệm vụ 2 - quét MỌI câu DÌM/HẠ THẤP bất kỳ game/cộng đồng RTS nào (AoE1, AoE2, AoE3,
StarCraft...) -> `disparagement[]` (mỗi cái: câu trích + game bị dìm + vì sao là dìm).
Người đọc bài so sánh chính là dân game đó; hạ thấp game nào cũng là cấm.
- Là dìm: "phe AoE1 na ná nhau", "AoE1/AoE2 nhàm/cũ kỹ/lỗi thời", "AoE3 là bản thất bại",
  "StarCraft chỉ dành cho hàn xẻng", "chọn phe game X chỉ đổi màu".
- KHÔNG phải dìm: so sánh trung tính làm rõ điểm khác biệt (vd "AoE4 mỗi phe một cơ chế
  riêng" - nêu đặc điểm AoE4, không đụng chạm game khác; "nhịp StarCraft nhanh hơn AoE4" -
  mô tả trung tính).
Trả JSON: {"contradictions":[...],"claimsToVerify":[...],"disparagement":[...]}
```

Then sweep the REST of the file: every remaining `aoe1Disparagement` occurrence (Bước 4 call site, scorecard template line "Tôn trọng AoE1", ralph-loop prompt "dìm/hạ thấp Đế chế 1", news mode item 4) is renamed/generalized the same way - `disparagement` as the field, "Tôn trọng game RTS" as the scorecard line, "không dìm game/cộng đồng RTS nào" as the prose. The `guideVerdict(...)` call example becomes `{contradictions: contradictions.length, disparagement: disparagement.length}`.

- [ ] **Step 4: Add the comparison mode section**

Append after the "## Chế độ news" section:

```markdown
## Chế độ comparison (guide có kind 'comparison')

Bài so sánh cầu nối (AoE4 vs AoE2/AoE3/StarCraft...) nằm trong `src/data/guides` như guide
thường. Chấm theo ĐÚNG giao thức guide với các thay đổi sau:

1. **Bước 1**: `score-guide-seo.ts` trả `kind: 'comparison'` - sàn ở Bước 4 là
   `floorsForKind('comparison')` (structure 7, voice 7, conversion 6 - như strategy).
2. **Bước 3 (fact-check phân tầng theo game)**: subagent đọc thêm facts sheet
   `docs/facts-review/<slug>.md` (bảng claim -> nguồn). Không có facts sheet -> FAIL hygiene,
   ghi rõ lý do. Phân loại TỪNG claim theo game nó nói về:
   - **AoE1 / meta VN**: chỉ đối chiếu kho `facts/aoe1-facts.md`. Mâu thuẫn kho ->
     `contradictions[]`; ngoài kho -> `claimsToVerify[]` (KHÔNG tự phán đúng sai).
   - **AoE4**: đối chiếu kho `facts/aoe4-facts.md` TRƯỚC; claim ngoài kho nhưng có URL nguồn
     trong facts sheet -> xác minh trực tiếp như news (WebFetch); không kho không nguồn ->
     `claimsToVerify[]`.
   - **AoE2 / AoE3 / StarCraft**: BẮT BUỘC có URL nguồn chính thức trong facts sheet (wiki
     game, Liquipedia, patch notes...). WebFetch từng URL đối chiếu như chế độ news: nguồn
     xác nhận -> qua; nguồn nói ngược -> `contradictions[]`; không xác minh được (URL chết,
     nguồn không nhắc) -> `unverifiableClaims[]`; claim KHÔNG có dòng nguồn nào ->
     `contradictions[]` (luật cứng của kind này).
   WebFetch lỗi không làm sập vòng chấm - claim rơi về `unverifiableClaims`.
3. **Bước 4**: `floorsForKind('comparison')`. `unverifiableClaims` không chặn PASS trong
   phiên có owner nhưng CHẶN điều kiện headless (xem skill write-article).
4. **Bước 5**: scorecard ghi `Loại bài (kind): comparison` + dòng `Truy vết nguồn:` như
   chế độ news.
```

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/guide-evaluator/SKILL.md
git commit -m "feat(evaluator): comparison mode with tiered facts + all-RTS respect gate"
```

---

### Task 8: write-article skill - comparison mode + headless eligibility

**Files:**
- Modify: `.claude/skills/write-article/SKILL.md`

**Interfaces:**
- Consumes: evaluator comparison mode (Task 7), `QueueItem.kind 'comparison'` (Task 6).
- Produces: the headless eligibility rule the scheduled routine (Task 11) references verbatim.

- [ ] **Step 1: Extend Bước 1 (facts sheet) with the comparison tier table**

In `.claude/skills/write-article/SKILL.md`, in Bước 1 item 2, after the `news` bullet, add:

```markdown
   - Bài `comparison`: phân tầng theo game claim nói về:
     | Claim về | Yêu cầu |
     | --- | --- |
     | AoE1 / meta VN | Trong kho `aoe1-facts.md` -> `[ĐÃ CÓ TRONG KHO]`; ngoài kho -> `[CẦN XÁC NHẬN]` (câu hỏi cho owner) |
     | AoE4 | Kho `aoe4-facts.md` -> `[ĐÃ CÓ TRONG KHO]`; hoặc URL nguồn chính thức (WebFetch trích đúng) |
     | AoE2 / AoE3 / StarCraft | BẮT BUỘC URL nguồn chính thức (wiki game, Liquipedia, patch notes); không tìm được nguồn -> `[KHÔNG CÓ NGUỒN - SẼ BỎ KHỎI BÀI]` |
```

- [ ] **Step 2: Extend Bước 2 (owner gate)**

After the news bullet in Bước 2, add:

```markdown
- Comparison: 0 claim `[CẦN XÁC NHẬN]` (mọi claim có kho hoặc nguồn) -> bỏ qua cổng owner,
  ghi dòng "Bỏ qua cổng owner: mọi claim có kho/nguồn" vào facts sheet. Có claim AoE1/meta VN
  ngoài kho -> status `facts-pending`, chờ owner như guide thường.
```

- [ ] **Step 3: Extend Bước 3 (viết bài)**

After the news sentence in Bước 3 item 2, add:

```markdown
   Comparison: tạo `src/data/guides/<slug>.ts` như guide với `kind: 'comparison'`,
   `sources[]` = đúng các URL trong facts sheet, `cta: true`; internal link >= 1 tới bài
   liên quan có thật (ưu tiên bài so sánh/guide AoE4 gần chủ đề).
```

- [ ] **Step 4: Replace the "Giai đoạn 2" section with the headless eligibility rule**

Replace the entire final section (from `## Giai đoạn 2 (chưa bật - chỉ ghi nhận)` to end of file) with:

```markdown
## Điều kiện headless (scheduled agent dùng - đang bật)

Một queue item ĐỦ ĐIỀU KIỆN cho phiên chạy không có owner khi thỏa MỘT trong:

1. `comparison` hoặc `news`: facts sheet KHÔNG có claim `[CẦN XÁC NHẬN]` - mọi claim có kho
   hoặc URL nguồn. Sau khi chấm, scorecard có `unverifiableClaims` -> PR vẫn mở nhưng liệt kê
   rõ trong PR body mục "Cần owner liếc trước khi merge".
2. `guide`: 100% claim `[ĐÃ CÓ TRONG KHO]`.

Item không đủ điều kiện -> phiên headless BỎ QUA (đặt/giữ `facts-pending` nếu vừa soạn facts
sheet), thử item kế tiếp trong queue. Headless TUYỆT ĐỐI không merge PR - owner là người merge
duy nhất, mọi trường hợp.
```

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/write-article/SKILL.md
git commit -m "feat(write-article): comparison mode with tiered facts + headless eligibility rule"
```

---

### Task 9: Seed comparison topics into the queue

**Files:**
- Modify: `src/data/content-queue.json`

**Interfaces:**
- Consumes: `QueueItem` shape with `kind: 'comparison'` (Task 6).
- Produces: 10-15 approved queue items with `status: 'proposed'` for Tasks 10-11 to consume.

- [ ] **Step 1: [OWNER] Propose ~15 topics, owner gật/lắc each**

Present this candidate list to the owner one by one (gật = keep, lắc = drop; owner may edit keywords/slugs or add their own):

1. `aoe4-vs-aoe2-khac-biet-cot-loi` - "aoe4 vs aoe2" - khác biệt cốt lõi giữa hai game
2. `dan-aoe2-chuyen-sang-aoe4` - "chuyển từ aoe2 sang aoe4" - dân AoE2 lâu năm sang AoE4 giữ gì, học lại gì
3. `aoe4-vs-starcraft-tu-duy-chien-thuat` - "aoe4 vs starcraft" - hai trường phái tư duy RTS
4. `dan-starcraft-choi-aoe4` - "starcraft chuyển sang aoe4" - macro/micro SC áp vào AoE4 được gì
5. `aoe4-vs-aoe3-khac-nhau-the-nao` - "aoe4 vs aoe3" - hai hướng đi khác nhau của dòng Age
6. `kinh-te-aoe4-vs-aoe2` - "kinh tế aoe4 aoe2" - dân làm gỗ làm ruộng hai game khác gì
7. `quan-khac-che-aoe4-vs-aoe2` - "khắc chế quân aoe4" - bảng khắc chế hai game đặt cạnh nhau
8. `tuong-thanh-aoe4-vs-aoe2` - "tường thành aoe4 aoe2" - công thành hai game
9. `civ-aoe4-vs-dan-toc-aoe2` - "civ aoe4 vs aoe2" - thiết kế phe/dân tộc khác nhau ra sao
10. `ranked-aoe4-vs-ladder-starcraft` - "rank aoe4" - leo rank AoE4 dưới góc nhìn dân ladder SC
11. `aoe3-co-gi-hay` - "aoe3 có gì hay" - AoE3 có gì riêng, và ai hợp AoE4 hơn
12. `game-rts-nao-de-bat-dau-2026` - "game rts cho người mới" - RTS nào dễ vào nhất 2026 (góc nhìn công bằng, dẫn về AoE4)
13. `esports-aoe4-vs-starcraft2` - "giải đấu aoe4" - hệ sinh thái giải đấu hai game
14. `micro-aoe4-vs-starcraft` - "micro aoe4" - trần micro hai game khác nhau thế nào
15. `aoe2-dinh-cao-vi-sao-van-nen-thu-aoe4` - "aoe2 hay aoe4" - AoE2 đang đỉnh cao, vì sao vẫn đáng thử AoE4 (không dìm AoE2)

- [ ] **Step 2: Write approved items into `src/data/content-queue.json`**

One entry per approved topic, exact shape (dates = today):

```json
{
  "slug": "<slug>",
  "targetKeyword": "<keyword>",
  "kind": "comparison",
  "evidence": { "query": "<keyword>", "impressions": 0, "position": 0, "source": "manual" },
  "status": "proposed",
  "createdAt": "2026-08-03",
  "updatedAt": "2026-08-03"
}
```

- [ ] **Step 3: Validate and commit**

Run: `npm run test:run -- contentQueue` (queue file validation) then:

```bash
git add src/data/content-queue.json
git commit -m "feat(queue): seed owner-approved comparison topics"
```

- [ ] **Step 4: Verify Phase B code work and open PR**

```bash
npm run lint:check && npm run type-check && npm run test:run
```

All green -> push, open PR titled "Comparison kind: tiered facts, all-RTS respect gate, seeded topic queue" summarizing Tasks 5-9. [OWNER] merges. Then `git checkout main && git pull`.

---

### Task 10: Dry-run one comparison article end-to-end

**Files:**
- Create: `src/data/guides/<first-approved-slug>.ts` (+ registry entry in `src/data/guides/index.ts`)
- Create: `docs/facts-review/<slug>.md`
- Modify: `src/data/content-queue.json` (status transitions)

**Interfaces:**
- Consumes: everything from Phase B; runs the REAL pipeline, no shortcuts.

- [ ] **Step 1: [OWNER] Run `/write-article <first-approved-slug>` in-session with owner watching**

Follow the write-article skill exactly (Bước 0 voice prep -> facts sheet with tiered sources -> gate -> draft with `kind: 'comparison'` + `sources[]` -> evaluator loop max 3 rounds -> PR on branch `claude/article-<slug>`). This validates comparison mode end-to-end before anything runs headless.

- [ ] **Step 2: Verify the dry-run proved the loop**

Checklist: facts sheet has per-game tiers; evaluator scorecard says `kind: comparison` and has the `Truy vết nguồn:` line; no disparagement of any game; PR body lists any `unverifiableClaims`. [OWNER] merges the article PR. Fix any skill-instruction gap discovered, commit the fix to a `claude/fix-comparison-dryrun` branch, PR, merge, BEFORE Task 11.

---

### Task 11: Scheduled routine (Mon/Wed/Fri) + monitoring

**Files:**
- None in repo (cloud routine via the `schedule` skill).

**Interfaces:**
- Consumes: headless eligibility rule (Task 8), seeded queue (Task 9), merged main with all skills.

- [ ] **Step 1: Create the routine with the `schedule` skill**

Name: `aoe4vn-article-writer`. Schedule: Mon/Wed/Fri 08:00 Asia/Ho_Chi_Minh (`0 8 * * 1,3,5` local). Repo: this repo, branch base `main`. Prompt (verbatim):

```
Bạn chạy headless trong repo aoe4.vn. Nhiệm vụ: viết đúng MỘT bài từ hàng đợi rồi dừng.

1. Đọc src/data/content-queue.json. Duyệt lần lượt các item status proposed/facts-pending/
   facts-approved theo thứ tự trong file.
2. Với từng item, kiểm tra "Điều kiện headless" trong .claude/skills/write-article/SKILL.md.
   Item chưa có facts sheet -> soạn facts sheet theo Bước 1 của skill; nếu kết quả có claim
   [CẦN XÁC NHẬN] -> đặt status facts-pending, commit facts sheet (git add -f docs/), thử
   item kế tiếp.
3. Gặp item đủ điều kiện đầu tiên -> chạy TRỌN skill write-article cho nó (Bước 0 giọng văn,
   viết, chấm guide-evaluator tối đa 3 vòng, PR). FAIL 3 vòng -> parked + PR draft theo skill.
4. TUYỆT ĐỐI không merge bất kỳ PR nào. Owner là người merge duy nhất.
5. Không còn item nào đủ điều kiện (hoặc queue rỗng) -> KHÔNG viết gì; kết thúc với báo cáo
   ngắn nêu rõ vì sao từng item bị bỏ qua và nhắc owner seed thêm đề tài.
Mỗi lần chạy tối đa MỘT bài. Mọi quy tắc trong CLAUDE.md và các skill áp dụng đầy đủ.
```

- [ ] **Step 2: [OWNER] Trigger one manual run with owner watching**

Trigger the routine once immediately (run-now). Verification: it picks the next eligible queue item, opens exactly one PR, does not merge, and its report is coherent. If it misbehaves: pause the routine, fix the skill/prompt on a branch, PR, merge, re-test.

- [ ] **Step 3: Two-week monitoring note**

Tell the owner the operating rhythm: expect 2-3 PRs/week; merge = publish; if two consecutive runs report "no eligible item", seed more topics (rerun Task 9 Step 1 style session or `/propose-topics` once Search Console has comparison-query data). Success criteria from the spec: >= 10 comparison articles in the first month, impressions from AoE2/AoE3/StarCraft queries appearing, owner hands-on time <= ~15 min/week.

---

## Self-review notes (done at plan-writing time)

- Spec coverage: §2.1 -> Task 1; §2.2 -> Task 2; §2.3 -> Task 2; §2.4 -> Task 3; §2.5 -> Task 4; §3.1 -> Tasks 5-8; §3.2 -> Task 9; §3.3 -> Task 11; §4 error handling -> encoded in Tasks 7, 8, 11 prompts; §5 testing -> TDD steps + calibration run (Task 3) + dry-run (Task 10); §6 success criteria -> Task 11 Step 3; §7 order -> task order matches.
- Type consistency: `COMPARISON_FLOORS` / `disparagement` / `sources` / `kind: 'comparison'` names are identical across Tasks 5-9.
- The evaluator SKILL.md pinned-prompt anchor excerpts (Task 3 Step 2) are intentionally template-filled at execution time - they MUST come from the owner corpus, which does not exist until Task 1 Step 5. This is an owner-data dependency, not a placeholder.
