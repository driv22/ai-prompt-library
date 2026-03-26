# AI Prompt Library

250 enterprise-grade AI prompts for Microsoft 365 Copilot.

## Adding a New Prompt

1. Open `/data/prompts.json`
2. Copy the template from `/data/PROMPT_TEMPLATE.json`
3. Fill in all fields
4. Add to the prompts array
5. Commit and push to `main`

GitHub Actions auto-deploys in ~2 minutes. No CMS or build knowledge needed.

### Schema reference

| Field | Description |
|-------|-------------|
| `id` | Unique ID: `category-NNN` (e.g. `bso-001`) |
| `title` | Display name |
| `category` | Must match exactly one of the 20 category names |
| `categorySlug` | URL-safe version of category |
| `tool` | One of: Copilot Chat, Excel, Word, Teams, PowerPoint, Outlook, Notebooks, Cowork, Researcher, Any AI Tool |
| `tags` | Array of searchable keywords |
| `body` | Full prompt text. Use [PLACEHOLDER] for user-customizable fields |
| `hasDemoData` | true if demo files are attached |
| `demoDataFiles` | Array of file objects (see template) |
| `demoNote` | Instructions for using demo data with this prompt |
| `featured` | Show on homepage featured section |
