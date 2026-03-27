/**
 * Run once (or after adding new agents) to pre-compute semantic embeddings.
 * Usage: node scripts/generate-agent-embeddings.mjs
 *
 * Outputs: public/agent-embeddings.json
 */
import { pipeline } from '@xenova/transformers'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const agents = JSON.parse(readFileSync(join(root, 'data', 'agents.json'), 'utf-8'))

console.log(`Generating embeddings for ${agents.length} agents…`)
console.log('Downloading model on first run (~23 MB, cached after that)\n')

const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

const embeddings = []
const BATCH = 10

for (let i = 0; i < agents.length; i++) {
  const a = agents[i]
  const text = [a.title, a.description, a.category, a.audience, a.tags?.join(' ')].filter(Boolean).join('. ')
  const out = await extractor(text, { pooling: 'mean', normalize: true })
  embeddings.push({ id: a.id, vec: Array.from(out.data) })

  if ((i + 1) % BATCH === 0 || i === agents.length - 1) {
    process.stdout.write(`\r  ${i + 1}/${agents.length} done`)
  }
}

writeFileSync(
  join(root, 'public', 'agent-embeddings.json'),
  JSON.stringify(embeddings)
)

console.log(`\n\nSaved public/agent-embeddings.json (${embeddings.length} vectors)`)
