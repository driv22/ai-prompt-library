import promptsData from '@/data/prompts.json'

const _counts: Record<string, number> = {}
;(promptsData as Array<{ category: string }>).forEach(p => {
  _counts[p.category] = (_counts[p.category] || 0) + 1
})

export const categoryColorMap: Record<string, string> = {
  'Business Strategy & Operations': '#6366f1',
  'Career & Job Search':            '#8b5cf6',
  'Content & Writing':              '#06b6d4',
  'Engineering & Product':          '#10b981',
  'Excel & Data':                   '#22c55e',
  'Freelancing & Business Building':'#f59e0b',
  'Investing & Finance':            '#3b82f6',
  'Learning & Self-Development':    '#a78bfa',
  'Legal':                          '#94a3b8',
  'Marketing & SEO':                '#f97316',
  'Personal Finance':               '#0ea5e9',
  'Presentations':                  '#ec4899',
  'Productivity & Automation':      '#14b8a6',
  'Research & Analysis':            '#84cc16',
  'Notebooks':                      '#d946ef',
  'Competitive Analysis':           '#ef4444',
  'Travel':                         '#fb923c',
  'Meeting Recordings':             '#38bdf8',
  'Personal Productivity':          '#a3e635',
  'Cowork':                         '#818cf8',
}

export const toolColorMap: Record<string, string> = {
  'Copilot Chat':  '#6366f1',
  'Excel':         '#22c55e',
  'Word':          '#3b82f6',
  'Teams':         '#8b5cf6',
  'PowerPoint':    '#f97316',
  'Outlook':       '#06b6d4',
  'Notebooks':     '#d946ef',
  'Cowork':        '#818cf8',
  'Researcher':    '#f59e0b',
  'Any AI Tool':   '#94a3b8',
}

export const categories = [
  { name: 'Business Strategy & Operations', slug: 'business-strategy',     icon: 'Building2',     count: _counts['Business Strategy & Operations'] || 0 },
  { name: 'Career & Job Search',            slug: 'career',                icon: 'Briefcase',     count: _counts['Career & Job Search'] || 0 },
  { name: 'Content & Writing',              slug: 'content-writing',       icon: 'PenLine',       count: _counts['Content & Writing'] || 0 },
  { name: 'Engineering & Product',          slug: 'engineering',           icon: 'Code2',         count: _counts['Engineering & Product'] || 0 },
  { name: 'Excel & Data',                   slug: 'excel-data',            icon: 'BarChart3',     count: _counts['Excel & Data'] || 0 },
  { name: 'Freelancing & Business Building',slug: 'freelancing',           icon: 'Rocket',        count: _counts['Freelancing & Business Building'] || 0 },
  { name: 'Investing & Finance',            slug: 'investing',             icon: 'TrendingUp',    count: _counts['Investing & Finance'] || 0 },
  { name: 'Learning & Self-Development',    slug: 'learning',              icon: 'GraduationCap', count: _counts['Learning & Self-Development'] || 0 },
  { name: 'Legal',                          slug: 'legal',                 icon: 'Scale',         count: _counts['Legal'] || 0 },
  { name: 'Marketing & SEO',                slug: 'marketing',             icon: 'Megaphone',     count: _counts['Marketing & SEO'] || 0 },
  { name: 'Personal Finance',               slug: 'personal-finance',      icon: 'Wallet',        count: _counts['Personal Finance'] || 0 },
  { name: 'Presentations',                  slug: 'presentations',         icon: 'Presentation',  count: _counts['Presentations'] || 0 },
  { name: 'Productivity & Automation',      slug: 'productivity',          icon: 'Zap',           count: _counts['Productivity & Automation'] || 0 },
  { name: 'Research & Analysis',            slug: 'research',              icon: 'Search',        count: _counts['Research & Analysis'] || 0 },
  { name: 'Notebooks',                      slug: 'notebooks',             icon: 'BookOpen',      count: _counts['Notebooks'] || 0 },
  { name: 'Competitive Analysis',           slug: 'competitive',           icon: 'Trophy',        count: _counts['Competitive Analysis'] || 0 },
  { name: 'Travel',                         slug: 'travel',                icon: 'Plane',         count: _counts['Travel'] || 0 },
  { name: 'Meeting Recordings',             slug: 'meetings',              icon: 'Video',         count: _counts['Meeting Recordings'] || 0 },
  { name: 'Personal Productivity',          slug: 'personal-productivity', icon: 'Target',        count: _counts['Personal Productivity'] || 0 },
  { name: 'Cowork',                         slug: 'cowork',                icon: 'Bot',           count: _counts['Cowork'] || 0 },
]
