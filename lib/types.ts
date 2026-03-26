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
