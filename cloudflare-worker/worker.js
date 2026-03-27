/**
 * Prompt Vault — Demo Script Generator Worker
 * Deploy to Cloudflare Workers (free tier: 100k requests/day)
 *
 * Setup:
 * 1. Go to https://workers.cloudflare.com → Create Worker → paste this code
 * 2. Add secret: Settings → Variables → Add Variable (secret) → ANTHROPIC_API_KEY
 * 3. Update ALLOWED_ORIGIN below to match your domain
 */

const ALLOWED_ORIGINS = [
  'https://driv22.github.io',
  'https://promptvault.driv.space',
  'http://localhost:3000', // for local dev
]

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      })
    }

    const { prompts, company, industry, audience, duration } = body

    // Basic validation
    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return new Response(JSON.stringify({ error: 'No prompts provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      })
    }
    if (prompts.length > 10) {
      return new Response(JSON.stringify({ error: 'Maximum 10 prompts per script' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      })
    }

    // Build the system prompt
    const systemPrompt = `You are an expert enterprise technology consultant and demo specialist with 15+ years of experience running executive-level Microsoft 365 Copilot demonstrations. You write polished, persuasive demo scripts that feel natural when spoken aloud, highlight business value clearly, and are tailored precisely to the audience.

Your scripts follow this structure:
1. Opening hook that addresses the audience's specific pain points
2. Scene-setting context that makes the demo feel real
3. For each prompt: a smooth spoken introduction, the exact prompt text formatted clearly, the expected outcome and business impact, a transition to the next prompt
4. A powerful closing that reinforces ROI and next steps

Style rules:
- Write in second person ("You'll say...") so the presenter knows exactly what to say
- Use natural spoken language, not corporate jargon
- Include stage directions in [brackets] for actions like [paste prompt into Copilot Chat]
- Keep each prompt section punchy — 3–4 sentences of intro max
- Make the business impact concrete (time saved, decisions accelerated, risk reduced)`

    const userMessage = `Generate a ${duration}-minute enterprise demo script for the following context:

**Company being demoed to:** ${company || 'a Fortune 500 enterprise'}
**Industry:** ${industry || 'General Business'}
**Audience:** ${audience || 'Business Decision Makers'}

**Prompts to feature in this demo (use all of them, in order):**
${prompts.map((p, i) => `
${i + 1}. **${p.title}** (Category: ${p.category})
   Prompt text: "${p.prompt.slice(0, 300)}${p.prompt.length > 300 ? '...' : ''}"
`).join('')}

Write a complete, presenter-ready script. Format it clearly with sections for each prompt. Make it feel tailored specifically to ${industry || 'this industry'} and the ${audience || 'executive'} audience. Include realistic business outcomes and ROI talking points throughout.`

    try {
      const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-5',
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        }),
      })

      if (!anthropicResponse.ok) {
        const err = await anthropicResponse.text()
        console.error('Anthropic error:', err)
        return new Response(JSON.stringify({ error: 'AI generation failed. Please try again.' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
        })
      }

      const data = await anthropicResponse.json()
      const script = data.content?.[0]?.text || ''

      return new Response(JSON.stringify({ script }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      })
    } catch (err) {
      console.error('Worker error:', err)
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      })
    }
  },
}
