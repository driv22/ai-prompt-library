import { readFileSync, writeFileSync } from 'fs'

const raw = JSON.parse(readFileSync('C:/Users/DLRiv/AppData/Local/Temp/agents_output.json', 'utf8'))

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const fm = {}
  match[1].split('\n').forEach(line => {
    const idx = line.indexOf(':')
    if (idx === -1) return
    const key = line.slice(0, idx).trim()
    const val = line.slice(idx + 1).trim()
    fm[key] = val
  })
  return fm
}

function extractSection(content, heading) {
  const regex = new RegExp(`## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`)
  const m = content.match(regex)
  return m ? m[1].trim() : ''
}

function extractConversationStarters(content) {
  const section = extractSection(content, 'Conversation Starters')
  return section
    .split('\n')
    .filter(l => l.trim().startsWith('-'))
    .map(l => l.replace(/^-\s*`?/, '').replace(/`?$/, '').trim())
    .filter(Boolean)
}

function extractInstructions(content) {
  // Extract content inside the ``` block in Instructions section
  const instrSection = extractSection(content, 'Instructions')
  const codeMatch = instrSection.match(/```[\w]*\n([\s\S]*?)```/)
  return codeMatch ? codeMatch[1].trim() : instrSection.replace(/\*\(Paste.*?\)\*\n?/, '').trim()
}

function extractDescription(content) {
  // Try ## Description section first
  const section = extractSection(content, 'Description')
  if (section) return section.split('\n\n')[0].trim()
  // Fall back to blockquote
  const bq = content.match(/>\s*\*\*Description:\*\*\s*(.+)/)
  return bq ? bq[1].trim() : ''
}

const agents = raw
  .filter(a => a.id !== 'epc-energy') // remove placeholder industry readme
  .map(a => {
    const fm = parseFrontmatter(a.rawContent)
    return {
      id: a.id,
      title: fm.name || a.title,
      category: a.category,
      categorySlug: a.categorySlug,
      description: fm.description || extractDescription(a.rawContent),
      audience: fm.audience || '',
      language: fm.language || 'EN',
      version: fm.version || '1.0',
      lastUpdated: fm.last_updated || '',
      raiReviewed: fm.rai_reviewed === 'yes',
      tested: fm.tested === 'yes',
      knowledgeSources: fm.knowledge_sources || '',
      conversationStarters: extractConversationStarters(a.rawContent),
      instructions: extractInstructions(a.rawContent),
      knowledgeSourcesDetail: extractSection(a.rawContent, 'Knowledge Sources'),
      deploymentNotes: extractSection(a.rawContent, 'Deployment Notes'),
    }
  })

writeFileSync(
  'C:/Users/DLRiv/OneDrive/Claude/ai-prompt-library/data/agents.json',
  JSON.stringify(agents, null, 2)
)

console.log(`✓ Wrote ${agents.length} agents to data/agents.json`)
const cats = [...new Set(agents.map(a => a.category))].sort()
console.log('Categories:', cats.join(', '))
