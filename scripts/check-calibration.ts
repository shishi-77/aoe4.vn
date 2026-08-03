import { readFileSync } from 'node:fs'
import {
  checkCalibration,
  type CalibrationExpectation,
  type CalibrationResult,
} from '@/lib/calibration'

const EXPECTED_PATH = '.claude/skills/guide-evaluator/golden/expected.json'

const resultsPath = process.argv[2]
if (!resultsPath) {
  console.error('Usage: npx vite-node scripts/check-calibration.ts <results.json>')
  process.exit(1)
}

function readJson(path: string): unknown {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (err) {
    console.error(`Cannot read/parse ${path}: ${err instanceof Error ? err.message : String(err)}`)
    process.exit(1)
  }
}

const expected = readJson(EXPECTED_PATH) as Record<string, CalibrationExpectation>
const results = readJson(resultsPath) as CalibrationResult[]

const verdicts = checkCalibration(expected, results)
for (const v of verdicts) {
  const detail = v.problems.length > 0 ? ` - ${v.problems.join('; ')}` : ''
  console.log(`${v.pass ? 'DAT   ' : 'TRUOT '}${v.case}${detail}`)
}
const passed = verdicts.filter((v) => v.pass).length
console.log(`\n${passed}/${verdicts.length} DAT`)
if (passed !== verdicts.length) process.exit(1)
