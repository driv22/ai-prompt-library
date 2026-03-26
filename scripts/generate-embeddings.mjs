/**
 * Run once (or after adding new prompts) to pre-compute semantic embeddings.
 * Usage: node scripts/generate-embeddings.mjs
 *
 * Outputs: public/embeddings.json
 */
import { pipeline } from '@xenova/transformers'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const prompts = JSON.parse(readFileSync(join(root, 'data', 'prompts.json'), 'utf-8'))

console.log(`Generating embeddings for ${prompts.length} prompts…`)
console.log('Downloading model on first run (~23 MB, cached after that)\n')

const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

const embeddings = []
const BATCH = 10

for (let i = 0; i < prompts.length; i++) {
  const p = prompts[i]
  // Combine the most semantically rich fields
  const text = [p.title, p.description, p.tags?.join(' '), p.category].filter(Boolean).join('. ')
  const out = await extractor(text, { pooling: 'mean', normalize: true })
  embeddings.push({ id: p.id, vec: Array.from(out.data) })

  if ((i + 1) % BATCH === 0 || i === prompts.length - 1) {
    process.stdout.write(`\r  ${i + 1}/${prompts.length} done`)
  }
}

writeFileSync(
  join(root, 'public', 'embeddings.json'),
  JSON.stringify(embeddings)
)

console.log(`\n\nSaved public/embeddings.json (${embeddings.length} vectors, ${embeddings[0].vec.length}d)`)
