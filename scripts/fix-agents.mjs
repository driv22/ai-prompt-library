import { readFileSync, writeFileSync } from 'fs'

function fixEncoding(str) {
  if (!str) return ''
  return str
    .replace(/â€"/g, '—')
    .replace(/â€˜/g, '\u2018')
    .replace(/â€™/g, '\u2019')
    .replace(/â€œ/g, '\u201C')
    .replace(/â€\u009D/g, '\u201D')
    .replace(/â€/g, '\u201D')
    .replace(/â†'/g, '\u2192')
    .replace(/â†"/g, '\u2194')
    .replace(/â€¦/g, '…')
    .replace(/Ã©/g, 'é')
}

function extractSection(content, heading) {
  // Use a non-greedy match that doesn't stop at ## inside code fences
  const idx = content.indexOf(`## ${heading}`)
  if (idx === -1) return ''
  const afterHeading = content.slice(idx + heading.length + 3)
  // Find next ## that is NOT inside a code fence
  let depth = 0
  let i = 0
  while (i < afterHeading.length) {
    if (afterHeading.slice(i, i + 3) === '```') {
      depth = depth ? 0 : 1
      i += 3
      continue
    }
    if (!depth && afterHeading.slice(i, i + 3) === '\n##') {
      break
    }
    i++
  }
  return afterHeading.slice(0, i).trim()
}

function extractInstructions(content) {
  const instrIdx = content.indexOf('## Instructions')
  if (instrIdx === -1) return ''
  const fenceOpenIdx = content.indexOf('```', instrIdx)
  if (fenceOpenIdx === -1) return ''
  const contentStart = content.indexOf('\n', fenceOpenIdx + 3) + 1
  const rest = content.slice(contentStart)
  const closingMatch = rest.match(/\n```(\n|$)/)
  return closingMatch ? rest.slice(0, closingMatch.index).trim() : rest.trim()
}

function extractConversationStarters(content) {
  const section = extractSection(content, 'Conversation Starters')
  return section
    .split('\n')
    .filter(l => l.trim().startsWith('-'))
    .map(l => l.replace(/^-\s*`?/, '').replace(/`?\s*$/, '').trim())
    .filter(Boolean)
    .map(fixEncoding)
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const fm = {}
  match[1].split('\n').forEach(line => {
    const idx = line.indexOf(':')
    if (idx === -1) return
    fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
  })
  return fm
}

const raw = JSON.parse(readFileSync('C:/Users/DLRiv/AppData/Local/Temp/agents_output.json', 'utf8'))
const existing = JSON.parse(readFileSync('C:/Users/DLRiv/OneDrive/Claude/ai-prompt-library/data/agents.json', 'utf8'))

const fixed = raw
  .filter(a => a.id !== 'epc-energy')
  .map(a => {
    const content = a.rawContent
    const fm = parseFrontmatter(content)
    const instructions = fixEncoding(extractInstructions(content))
    const knowledgeSourcesDetail = fixEncoding(extractSection(content, 'Knowledge Sources'))
    const deploymentNotes = fixEncoding(extractSection(content, 'Deployment Notes'))
    const description = fixEncoding(fm.description || extractSection(content, 'Description').split('\n\n')[0])
    return {
      id: a.id,
      title: fixEncoding(fm.name || a.title),
      category: a.category,
      categorySlug: a.categorySlug,
      description,
      audience: fixEncoding(fm.audience || ''),
      language: fm.language || 'EN',
      version: fm.version || '1.0',
      lastUpdated: fm.last_updated || '',
      raiReviewed: fm.rai_reviewed === 'yes',
      tested: fm.tested === 'yes',
      knowledgeSources: fixEncoding(fm.knowledge_sources || ''),
      conversationStarters: extractConversationStarters(content),
      instructions,
      knowledgeSourcesDetail,
      deploymentNotes,
    }
  })

writeFileSync(
  'C:/Users/DLRiv/OneDrive/Claude/ai-prompt-library/data/agents.json',
  JSON.stringify(fixed, null, 2)
)

console.log(`✓ Wrote ${fixed.length} agents`)
const sample = fixed[0]
console.log('Title:', sample.title)
console.log('Instructions length:', sample.instructions.length)
console.log('Instructions preview:', sample.instructions.slice(0, 100))
console.log('Deployment notes:', sample.deploymentNotes.slice(0, 80))
