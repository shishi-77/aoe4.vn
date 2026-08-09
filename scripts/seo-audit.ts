import { guides } from '@/data/guides'
import { newsPosts } from '@/data/news'
import { auditContent } from '@/lib/seoAudit'
import { hasFactsSheet } from './facts-sheet-fs'

const findings = auditContent(guides, newsPosts, hasFactsSheet)

console.log(
  JSON.stringify(
    { checkedGuides: guides.length, checkedNews: newsPosts.length, findings },
    null,
    2,
  ),
)

if (findings.length > 0) process.exit(1)
