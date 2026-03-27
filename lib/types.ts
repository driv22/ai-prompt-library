export interface Agent {
  id: string
  title: string
  category: string
  categorySlug: string
  description: string
  audience: string
  language: string
  version: string
  lastUpdated: string
  raiReviewed: boolean
  tested: boolean
  knowledgeSources: string
  conversationStarters: string[]
  instructions: string
  knowledgeSourcesDetail: string
  deploymentNotes: string
}

export interface DemoDataFile {
  filename: string
  label: string
  description: string
}

export interface Prompt {
  id: string
  title: string
  description: string
  prompt: string
  category: string
  categorySlug: string
  tool: string
  tags: string[]
  placeholders: string[]
  featured: boolean
  hasDemoData: boolean
  demoDataFiles: DemoDataFile[]
  usageCount: number
  createdAt: string
}
