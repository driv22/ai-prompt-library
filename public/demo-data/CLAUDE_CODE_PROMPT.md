# Claude Code Build Prompt
## AI Prompt Library — Enterprise Website
### Copy this entire prompt into Claude Code to start the build

---

## BEFORE YOU WRITE A SINGLE LINE OF CODE

Read and internalize the `frontend-design` skill before making any visual or architectural decisions. It lives at `/mnt/skills/public/frontend-design/SKILL.md`. The core mandate from that skill applies to every component you build:

- Commit to a **bold, intentional aesthetic direction** — not generic AI tool design
- Choose **distinctive typography** — avoid Inter, Roboto, Arial, and Space Grotesk
- Use **gradient meshes, noise textures, layered depth** — not flat solid backgrounds
- Every hover state, animation, and spacing decision should feel **considered and precise**
- The one thing a visitor should remember: *this feels like a real product*

This is non-negotiable. Generic output is a failure condition for this build.

---

## PROJECT OVERVIEW

Build a production-grade, statically-exported prompt library website called **"The AI Prompt Library"** (or a name I can confirm later). This site will be deployed to GitHub Pages with a custom domain. It hosts 250 curated AI prompts organized into 20 categories, with enterprise-grade demo datasets attached to select prompts that need data to demonstrate their value.

The audience is enterprise customers — finance, legal, operations, sales, and technology professionals evaluating or expanding AI adoption. The site will be shared as a professional resource and needs to look and feel like a first-class product, not a side project.

---

## TECH STACK — NON-NEGOTIABLE

- **Framework:** Next.js 14 with `output: 'export'` (static site generation — required for GitHub Pages)
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Icons:** Lucide React
- **Search:** Fuse.js (client-side fuzzy search)
- **Animations:** Framer Motion
- **Default theme:** Dark mode with light mode toggle
- **Deployment:** GitHub Pages via GitHub Actions
- **Node version:** 18+

Do NOT use server components, server actions, or any Next.js API routes. Everything must work as a fully static export (`next export` / `output: 'export'`).

---

## DATA ARCHITECTURE

### Source of Truth: `/data/prompts.json`

All prompts live in a single JSON file. This is how new prompts get added — editors update this file and push to GitHub, which auto-deploys. Structure:

```json
[
  {
    "id": "bso-001",
    "title": "Executive Weekly Briefing Preparation",
    "category": "Business Strategy & Operations",
    "categorySlug": "business-strategy",
    "tool": "Copilot Chat",
    "tags": ["executive", "briefing", "weekly", "M365"],
    "body": "Prepare a comprehensive executive briefing...",
    "hasDemoData": true,
    "demoDataFiles": [
      {
        "filename": "01_business_intelligence_audit_revenue.csv",
        "label": "12-Month Revenue Data",
        "description": "120-row enterprise revenue dataset across 4 product lines and 5 regions",
        "type": "csv"
      }
    ],
    "demoNote": "Upload the revenue CSV and support tickets CSV to Copilot Chat, then run this prompt.",
    "featured": false
  }
]
```

### Demo Data Files: `/public/demo-data/`

All 13 demo data files live here and are served as static assets with direct download links. Files:

```
01_business_intelligence_audit_revenue.csv        (120 rows, 12-month P&L)
01_business_intelligence_audit_support_tickets.csv (400 enterprise support tickets)
01_business_intelligence_audit_nps.csv             (628 NPS survey responses)
04_lead_research_500rows.csv                       (500 B2B lead list)
05_excel_kpi_sales_analytics.csv                   (720 rows, 3-year sales KPIs)
08_portfolio_risk_scanner.csv                      (20-position $18M equity portfolio)
09_earnings_reaction_aapl.csv                      (8 quarters AAPL earnings history)
10_teams_meeting_transcript.txt                    (52-min enterprise Teams transcript)
11_vendor_agreement_sample.txt                     (MSA with 12 embedded red flags)
12_competitor_reviews.csv                          (200 G2/Gartner-style competitor reviews)
13_enterprise_expenses.csv                         (350-row Q4 enterprise expenses, $1.7M)
14_pl_investor_narrative.csv                       (36-month SaaS P&L, ARR $42M→$78M)
15_market_share_breakdown.csv                      (Top 20 AI software competitors)
```

---

## THE 20 CATEGORIES

Build the category structure from this exact list. Each needs a slug, icon (Lucide), and short description for the UI:

| Category | Slug | Icon | Count |
|----------|------|------|-------|
| Business Strategy & Operations | business-strategy | `Building2` | 22 |
| Career & Job Search | career | `Briefcase` | 16 |
| Content & Writing | content-writing | `PenLine` | 25 |
| Engineering & Product | engineering | `Code2` | 14 |
| Excel & Data | excel-data | `BarChart3` | 15 |
| Freelancing & Business Building | freelancing | `Rocket` | 16 |
| Investing & Finance | investing | `TrendingUp` | 27 |
| Learning & Self-Development | learning | `GraduationCap` | 6 |
| Legal | legal | `Scale` | 6 |
| Marketing & SEO | marketing | `Megaphone` | 15 |
| Personal Finance | personal-finance | `Wallet` | 18 |
| Presentations | presentations | `Presentation` | 8 |
| Productivity & Automation | productivity | `Zap` | 7 |
| Research & Analysis | research | `Search` | 5 |
| Notebooks | notebooks | `BookOpen` | 10 |
| Competitive Analysis | competitive | `Trophy` | 21 |
| Travel | travel | `Plane` | 11 |
| Meeting Recordings | meetings | `Video` | 1 |
| Personal Productivity | personal-productivity | `Target` | 1 |
| Cowork | cowork | `Bot` | 6 |

---

## SITE STRUCTURE & PAGES

### `/` — Homepage
- Hero section: Site name, tagline ("250 enterprise-grade AI prompts, ready to deploy"), search bar (full-width, prominent)
- Stats bar: 250 prompts · 20 categories · 13 demo datasets
- Category grid: All 20 categories as cards with icon, name, prompt count
- Featured prompts section: 6 hand-picked prompts shown as cards
- "How to use" section: 3-step explainer (Browse → Copy → Paste with demo data)

### `/prompts` — Full Library
- Left sidebar: Category filter list with counts, Tool filter (Copilot Chat, Excel, Word, Teams, PowerPoint, Outlook, Notebooks, Cowork, Any), Demo Data toggle filter
- Main area: Search bar at top, prompt cards in responsive grid
- Each card shows: title, category badge, tool badge, "Demo Data" badge (if applicable), truncated prompt body (3 lines), Copy button
- Pagination or infinite scroll (build as infinite scroll with "Load More")
- Active filter chips showing current filters with X to remove

### `/prompts/[id]` — Prompt Detail Page
Full prompt detail view:
- Breadcrumb: Library → Category → Prompt Title
- Prompt title (large)
- Metadata row: Category · Tool · Tags
- "Demo Data Available" banner (if applicable) — highlighted, prominent
- Full prompt body in a styled code/pre block with syntax-like formatting for `[PLACEHOLDERS]` highlighted in accent color
- One-click copy button (copies full prompt text)
- Demo Data section (if hasDemoData):
  - Each file listed with: filename, label, description, file type badge, download button
  - "How to use" note explaining how to pair the data with the prompt
- Related prompts section (same category, 3-4 cards)
- "← Back to Library" link

### `/categories/[slug]` — Category Page
- Category header with icon and description
- All prompts in that category
- Same card grid as /prompts

### `/about` — About Page
- What this library is
- How to use it
- How to contribute / add prompts (link to GitHub)
- Brief note on the demo data

---

## UI/UX REQUIREMENTS

### Design Direction
Dark mode default. Professional, premium, slightly editorial. Think: Vercel docs meets a well-designed developer tool. NOT a generic AI tool aesthetic.

**Typography (mandatory):**
- Headings/display: **Outfit** (import from Google Fonts) — geometric, confident, modern without being trendy
- Body/UI text: **DM Sans** — clean, readable, slightly warmer than system fonts
- Prompt body text: **JetBrains Mono** — monospace, communicates "this is code/a prompt", excellent readability
- Import all three from Google Fonts in the root layout. Do NOT use Inter, Roboto, Arial, or Space Grotesk anywhere.

**Hero background:**
- Animated gradient mesh — slow-moving, dark indigo/slate tones (`#0a0a0f` base with `#1e1b4b` and `#0f172a` blending)
- Pure CSS animation (`@keyframes`), no JS library
- Subtle grain texture overlay at 3-5% opacity on top of the gradient
- This creates atmosphere without being distracting

**Card backgrounds:**
- Very subtle noise texture overlay on card surfaces — `background-image: url("data:image/svg+xml...")` SVG noise at 4% opacity
- Cards should feel tactile, not flat
- Box-shadow on hover: `0 0 0 1px rgba(99,102,241,0.4), 0 8px 32px rgba(99,102,241,0.12)` — indigo glow, not just a border change

**Category badge colors:**
Build a `categoryColorMap` — every category gets a unique accent. Do NOT make them all the same color. Suggested palette:

```ts
const categoryColorMap: Record<string, string> = {
  'Business Strategy & Operations': '#6366f1', // indigo
  'Career & Job Search':            '#8b5cf6', // violet
  'Content & Writing':              '#06b6d4', // cyan
  'Engineering & Product':          '#10b981', // emerald
  'Excel & Data':                   '#22c55e', // green
  'Freelancing & Business Building':'#f59e0b', // amber
  'Investing & Finance':            '#3b82f6', // blue
  'Learning & Self-Development':    '#a78bfa', // purple
  'Legal':                          '#64748b', // slate
  'Marketing & SEO':                '#f97316', // orange
  'Personal Finance':               '#0ea5e9', // sky
  'Presentations':                  '#ec4899', // pink
  'Productivity & Automation':      '#14b8a6', // teal
  'Research & Analysis':            '#84cc16', // lime
  'Notebooks':                      '#d946ef', // fuchsia
  'Competitive Analysis':           '#ef4444', // red
  'Travel':                         '#fb923c', // orange-400
  'Meeting Recordings':             '#38bdf8', // sky-400
  'Personal Productivity':          '#a3e635', // lime-400
  'Cowork':                         '#818cf8', // indigo-400
}
```

**Demo Data badge treatment:**
- Color: `#d97706` (amber-600) background, white text
- Icon: `Zap` from Lucide (small, inline)
- Subtle CSS pulse animation on first render only (`animation: pulse 2s ease-out 1`)
- This badge should feel like a premium signal, not just a label

### Critical UI Patterns

**Prompt Cards:**
- Show title, category (colored badge), tool (neutral badge)
- Show "📊 Demo Data" badge in accent color when hasDemoData = true
- Truncate prompt body to 3 lines with ellipsis
- Hover state: subtle lift + border glow
- Copy button: shows "Copied!" with checkmark for 2 seconds after click

**Prompt Body Display:**
- In detail view: display in a styled block with monospace font
- Highlight `[PLACEHOLDER]` and `{{VARIABLE}}` patterns in a distinct accent color (e.g., amber/yellow)
- This makes the prompt immediately scannable and professional

**Demo Data Section (detail view):**
- Card-style layout for each file
- File type icon (CSV → spreadsheet icon, TXT → document icon)
- Row count / size shown as metadata
- Download button with file size
- Clear instructional note: "Upload this file to [Tool] before running the prompt"

**Search:**
- Fuse.js fuzzy search across title, body, tags, category
- Results update live as user types (no submit needed)
- Show match count: "47 prompts match 'financial'"
- **Loading state:** Show skeleton loaders (animated shimmer cards) while Fuse.js initializes its index on first load — this makes the site feel fast even on slow connections. Use a CSS shimmer animation, not a spinner.
- **Empty state:** When search returns 0 results, do NOT show plain text. Show a designed empty state: centered icon (Search from Lucide, large, muted), heading "No prompts found", subtext "Try a different search or clear your filters", and a "Clear all filters" button. This should feel intentional, not broken.

**Copy Behavior:**
- Single click copies the full raw prompt text to clipboard
- Replace `[PLACEHOLDER]` patterns with `[PLACEHOLDER]` as-is (user fills them in)
- Toast notification: "Prompt copied to clipboard" with checkmark

### Color System
Build with CSS variables. Dark mode palette:

```css
:root {
  --bg-base:        #0a0a0f;   /* near-black with blue undertone */
  --bg-surface:     #111118;   /* cards, sidebar, elevated surfaces */
  --bg-surface-2:   #16161f;   /* hover states, nested surfaces */
  --border:         #1e1e2e;   /* subtle borders */
  --border-bright:  #2d2d42;   /* active/hover borders */
  --text-primary:   #e8e8f0;   /* headings, primary content */
  --text-secondary: #a0a0b8;   /* body text */
  --text-muted:     #6b6b80;   /* labels, metadata */
  --accent:         #6366f1;   /* indigo — primary interactive */
  --accent-hover:   #4f46e5;   /* darker indigo on hover */
  --accent-glow:    rgba(99,102,241,0.15); /* glow effects */
  --demo-badge:     #d97706;   /* amber — demo data badges */
  --success:        #22c55e;   /* copy confirmation */
  --font-display:   'Outfit', sans-serif;
  --font-body:      'DM Sans', sans-serif;
  --font-mono:      'JetBrains Mono', monospace;
}
```

Light mode overrides (`[data-theme="light"]`): swap backgrounds to warm whites (`#fafaf8`, `#f4f4f0`), text to dark slate, keep accent colors identical.

Also build a `toolColorMap` so tool badges have distinct colors:

```ts
const toolColorMap: Record<string, string> = {
  'Copilot Chat':  '#6366f1', // indigo
  'Excel':         '#22c55e', // green
  'Word':          '#3b82f6', // blue
  'Teams':         '#8b5cf6', // violet
  'PowerPoint':    '#f97316', // orange
  'Outlook':       '#0ea5e9', // sky
  'Notebooks':     '#d946ef', // fuchsia
  'Cowork':        '#14b8a6', // teal
  'Any AI Tool':   '#64748b', // slate
  'Researcher':    '#a78bfa', // purple
  'Chat':          '#6366f1', // indigo
}
```

Build this mapping in the JSON data. Here's which prompts get demo data and which files:

**Full Business Intelligence Audit** → files: 01_revenue, 01_support_tickets, 01_nps
**Financial Review and Reporting** → files: 01_revenue, 13_expenses
**The PwC Data Analysis Report Writer** → files: 05_kpi_sales, 01_revenue
**The Excel Sales Analyzer** → files: 05_kpi_sales
**The Forecasting Engine** → files: 05_kpi_sales
**The Excel KPI Dashboard Designer** → files: 05_kpi_sales, 13_expenses
**The Excel Insight Generator** → files: 05_kpi_sales
**500-Row Lead Research + Personalization Engine** → files: 04_leads
**Portfolio Risk Scanner** → files: 08_portfolio
**Earnings Reaction Analyzer** → files: 09_earnings
**EARNINGS CALL INTELLIGENCE** → files: 09_earnings
**Investor-Ready Financial Narrative System** → files: 14_pl
**The "DCF Model Builder" Prompt** → files: 14_pl
**LONG/SHORT EQUITY THESIS** → files: 08_portfolio, 09_earnings
**Custom Teams Meeting Recap** → files: 10_transcript
**The Deloitte Meeting Notes and Action Items Extractor** → files: 10_transcript
**Full Contract Risk Review** → files: 11_vendor_agreement
**Vendor Agreement Red Flag Scan** → files: 11_vendor_agreement
**NDA Strength Check** → files: 11_vendor_agreement
**Contract Summary for Executives** → files: 11_vendor_agreement
**Deep Competitive Intelligence System** → files: 12_reviews, 15_market_share
**Competitor analysis** → files: 12_reviews, 15_market_share
**Market Share Breakdown** → files: 15_market_share
**Full Competitive Landscape Map** → files: 15_market_share, 12_reviews
**Expense tracker (Cowork)** → files: 13_expenses
**Data Generator → Insights** → files: 05_kpi_sales

---

## GITHUB PAGES DEPLOYMENT

### GitHub Actions Workflow: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### `next.config.js`
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: '', // Leave empty — custom domain handles this
}
module.exports = nextConfig
```

### `public/CNAME`
Create this file containing only the custom domain (I'll fill in the actual domain):
```
REPLACE_WITH_YOUR_DOMAIN
```

---

## "ADD A PROMPT" WORKFLOW

The add-prompt flow should be dead simple. Build:

1. **`/data/prompts.json`** — the single source of truth. Well-commented with a template at the top showing exactly how to add a new prompt.

2. **`/data/PROMPT_TEMPLATE.json`** — a standalone template file with comments explaining every field:
```json
{
  "_comment": "Copy this object and add it to prompts.json to add a new prompt",
  "id": "category-slug-NNN",
  "title": "Your Prompt Title",
  "category": "Exact Category Name from the 20 categories",
  "categorySlug": "category-slug",
  "tool": "Copilot Chat | Excel | Word | Teams | PowerPoint | Outlook | Notebooks | Cowork | Any AI Tool",
  "tags": ["tag1", "tag2", "tag3"],
  "body": "Full prompt text here. Use [PLACEHOLDER] for variables.",
  "hasDemoData": false,
  "demoDataFiles": [],
  "demoNote": "",
  "featured": false
}
```

3. **README.md** — includes a "How to Add a Prompt" section with 5-step instructions (edit JSON → commit → push → auto-deploys in ~2 min).

4. **Optional future enhancement (note in README):** A simple `/admin` page with a form UI that generates the correct JSON snippet to copy-paste into `prompts.json`. Build this as a stretch goal after the main site is working.

---

## BUILD ORDER

Build in this exact sequence to avoid blockers:

1. **Project scaffold** — `npx create-next-app`, install deps (Tailwind, shadcn/ui, Fuse.js, Framer Motion, Lucide)
2. **Data layer** — Create `prompts.json` with all 250 prompts fully populated (this is the most important step — take time to get every prompt in correctly)
3. **Copy demo data files** — Copy all 13 demo files into `/public/demo-data/`
4. **Layout + theme** — Build the root layout, dark/light toggle, nav, footer
5. **Homepage** — Hero, category grid, stats bar, featured section
6. **Library page** — `/prompts` with search, filters, card grid
7. **Detail page** — `/prompts/[id]` with full prompt, copy, demo data section
8. **Category pages** — `/categories/[slug]`
9. **GitHub Actions** — Deploy workflow + CNAME
10. **Polish pass** — Work through this list in order:
    - Animated gradient mesh on homepage hero (CSS `@keyframes`, no JS)
    - Noise texture overlay on cards (SVG data URI, 4% opacity)
    - Skeleton shimmer loaders for prompt grid initial load
    - Designed empty state for zero search results
    - Framer Motion staggered reveal on homepage category grid (cards animate in sequentially on load, 40ms delay between each)
    - Framer Motion fade+slide on prompt detail page load
    - `[PLACEHOLDER]` and `{{VARIABLE}}` syntax highlighting in prompt bodies
    - Demo Data badge pulse animation (fires once on mount)
    - Copy button satisfying feedback (icon swap + color change + "Copied!" text, 2s duration)
    - Filter chips with smooth enter/exit animations when added/removed
    - Mobile responsive audit (375px: sidebar becomes bottom sheet drawer, cards go 1-col; 768px: sidebar becomes collapsible panel)

---

## IMPORTANT NOTES FOR CLAUDE CODE

- **Populate ALL 250 prompts** in the JSON. Do not stub with placeholder data. Use the actual prompt titles and bodies. If a prompt body is very long, include it in full.
- **The demo data files are pre-built** — just copy them into `/public/demo-data/` as-is. Do not regenerate them.
- **Mobile-first** — the site must be fully responsive. Cards stack to 1 column on mobile, sidebar collapses to a filter drawer.
- **Accessibility** — Use semantic HTML, proper ARIA labels on interactive elements, keyboard navigation for the copy button and filters.
- **Performance** — Since this is static, it should load fast. Lazy-load prompt cards beyond the initial 20. Memoize Fuse.js index creation.
- **The copy button** is the single most-used interaction on the site — make it excellent. Large, clear, satisfying feedback.
- **No external API calls** at runtime — everything is static. Fuse.js runs entirely client-side.
- **Test the static export** — run `npm run build` before considering the task done. The `/out` directory should contain all pages as static HTML.

---

## DELIVERABLES CHECKLIST

Before marking complete, verify:
- [ ] `npm run build` passes with no errors
- [ ] `/out` directory generated with all pages
- [ ] All 250 prompts in prompts.json
- [ ] All 13 demo data files in `/public/demo-data/`
- [ ] Dark mode default with toggle working
- [ ] Light mode toggle works with warm white palette
- [ ] Outfit + DM Sans + JetBrains Mono fonts loading from Google Fonts
- [ ] NO Inter, Roboto, Arial, or Space Grotesk anywhere in the codebase
- [ ] Animated gradient mesh visible on homepage hero
- [ ] Noise texture on card surfaces (subtle, not distracting)
- [ ] categoryColorMap applied — all 20 categories have distinct badge colors
- [ ] toolColorMap applied — all tool badges have distinct colors
- [ ] Demo Data badge is amber with Zap icon and pulse animation
- [ ] Search works (Fuse.js, updates live)
- [ ] Skeleton shimmer loaders appear before Fuse.js initializes
- [ ] Designed empty state (not plain text) when search returns 0 results
- [ ] Category filter works
- [ ] Tool filter works
- [ ] Demo Data filter toggle works
- [ ] Active filter chips show with X to remove, animate in/out
- [ ] Copy button works, shows "Copied!" + checkmark for 2 seconds
- [ ] Demo data downloads work (direct file links)
- [ ] `[PLACEHOLDER]` and `{{VARIABLE}}` patterns highlighted in amber in prompt body
- [ ] Framer Motion stagger on homepage category grid
- [ ] Card hover: lift + indigo glow box-shadow (not just border)
- [ ] GitHub Actions workflow file present
- [ ] CNAME file present
- [ ] README with "How to Add a Prompt" instructions
- [ ] Mobile responsive — sidebar becomes bottom sheet at 375px
- [ ] No broken links or 404s in static export

---

## FINAL NOTE

This is a professional enterprise resource. Every decision — typography, spacing, copy, interactions — should reinforce that. The person sharing this library is a Microsoft M365 Copilot Solutions Engineer working with enterprise financial services clients. The site should make that audience think: *this person knows what they're doing.*

Refer back to the `frontend-design` skill throughout the build, not just at the start. Every time you're about to write a component, ask: does this look like something from a well-funded product team, or does it look like a default template? If it's the latter, push further.

When in doubt, do less but do it better. A site with 250 perfectly formatted prompts, clean search, and a design that actually looks premium is more valuable than a site with extra features that feel rushed.
