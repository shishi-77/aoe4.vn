import { shareLink } from '@/lib/shareLinks'

const path = process.argv[2]

if (!path || !path.startsWith('/')) {
  console.error('Usage: npx vite-node scripts/share-links.ts </guides/slug/ | /news/slug/>')
  process.exit(1)
}

console.log(`Facebook: ${shareLink(path, 'facebook')}`)
console.log(`Discord:  ${shareLink(path, 'discord')}`)
