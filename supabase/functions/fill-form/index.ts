// Supabase Edge Function: fill-form
// Deno runtime — uses Gemini API via GEMINI_API_KEY (Supabase Secrets)
// @ts-nocheck — Deno types are not available in the Vite/TS project; runtime provides Deno global
declare const Deno: {
  env: { get(key: string): string | undefined }
  serve: (handler: (req: Request) => Response | Promise<Response>) => void
}

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const FORM_SCHEMA = {
  name: { type: 'string', label: 'Type name', description: 'Short CV type identifier (e.g. "ASP.NET"). 1-3 words.', example: 'ASP.NET' },
  title: { type: 'string', label: 'CV title', description: 'Professional headline (e.g. "Senior ASP.NET Core Developer").', example: 'ASP.NET Core Developer' },
  summary: { type: 'string', label: 'Summary', description: '2-3 sentence professional summary, 40-70 words.', example: 'Results-driven ASP.NET Core developer...' },
  keywords: { type: 'string[]', label: 'Matching keywords', description: '5-10 lowercase technical keywords.', example: ['asp.net', 'c#', 'sql server'] },
} as const

function buildPrompt(
  input: string,
  currentForm?: Record<string, unknown>,
  availableCatalog?: { skills: string[]; experiences: string[]; projects: string[] },
): string {
  const ctx = currentForm ? `Current form values (improve them):\n${JSON.stringify(currentForm, null, 2)}` : 'No existing values — generate from input only.'
  const fields = Object.entries(FORM_SCHEMA).map(([k, m]) => `- "${k}": ${m.type} — ${m.description} (example: ${JSON.stringify(m.example)})`).join('\n')

  let catalogSection = ''
  if (availableCatalog && (availableCatalog.skills.length || availableCatalog.experiences.length || availableCatalog.projects.length)) {
    const skillList = availableCatalog.skills.slice(0, 30).join(', ') || 'none'
    const expList = availableCatalog.experiences.slice(0, 20).join(', ') || 'none'
    const projList = availableCatalog.projects.slice(0, 20).join(', ') || 'none'
    catalogSection = `
AVAILABLE DATABASE CATALOG (use this to ground your answer — prefer terms that exist here):
- Skills in DB: [${skillList}]
- Experience titles in DB: [${expList}]
- Project titles in DB: [${projList}]

GROUNDING RULE: At least 70% of "keywords" MUST be chosen from the Skills in DB list above (exact lowercase match). Only add new keywords if the title requires a skill not yet in DB. This ensures "Matching keywords" will actually match existing skills/experiences/projects for auto-selection.
`
  }

  return `You are an expert CV assistant.

FORM FIELDS - you MUST return JSON with EXACTLY these keys:
${fields}

RULES:
- Return ONLY valid JSON with 4 keys: "name", "title", "summary", "keywords".
- "name": 1-3 words Title Case.
- "title": 3-6 words Title Case.
- "summary": 2-3 sentences, 40-70 words, no markdown.
- "keywords": 5-10 lowercase tech keywords array.
- Language: English.
${catalogSection}
USER INPUT (main CV title):
"""${input}"""

${ctx}

Generate the JSON now.`
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed. Use POST.' }, 405)
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      return jsonResponse({ error: 'GEMINI_API_KEY is not set in Supabase Secrets. Run: supabase secrets set GEMINI_API_KEY=... and redeploy.' }, 500)
    }

    let body: Record<string, unknown>
    try {
      body = await req.json() as Record<string, unknown>
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400)
    }

    const rawInput = (body.input as string) ?? (body.prompt as string) ?? (body.userInput as string) ?? (body.title as string) ?? (body.summary as string) ?? (body.name as string) ?? ''
    const input = String(rawInput).trim()
    if (!input) {
      return jsonResponse({ error: 'Missing "input". Example: { "input": "Senior ASP.NET Core Developer" }' }, 400)
    }

    const currentForm: Record<string, unknown> = {
      name: body.name,
      title: body.title,
      summary: body.summary,
      keywords: body.keywords,
    }
    const hasValues = Object.values(currentForm).some((v) => typeof v === 'string' && String(v).trim().length > 0)

    // Catalog sent by frontend to ground keywords to existing skills — optional but improves matching
    const availableSkills = Array.isArray(body.availableSkills) ? (body.availableSkills as unknown[]).map((s) => String(s)).filter(Boolean) : []
    const availableExperiences = Array.isArray(body.availableExperiences) ? (body.availableExperiences as unknown[]).map((s) => String(s)).filter(Boolean) : []
    const availableProjects = Array.isArray(body.availableProjects) ? (body.availableProjects as unknown[]).map((s) => String(s)).filter(Boolean) : []
    const hasCatalog = availableSkills.length > 0 || availableExperiences.length > 0 || availableProjects.length > 0
    const prompt = buildPrompt(input, hasValues ? currentForm : undefined, hasCatalog ? { skills: availableSkills, experiences: availableExperiences, projects: availableProjects } : undefined)

    // Try latest models with fallback — 1.5 no longer available on v1beta (404)
    const modelsToTry = ['gemini-3.6-flash', 'gemini-2.0-flash', 'gemini-flash-latest']
    let geminiData: Record<string, unknown> | null = null
    let lastErrText = ''
    let lastStatus = 0

    for (const model of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
      console.log(`Trying Gemini model: ${model}`)
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json',
          },
        }),
      })
      if (res.ok) {
        geminiData = await res.json() as Record<string, unknown>
        console.log(`Gemini model ${model} succeeded`)
        break
      }
      lastErrText = await res.text()
      lastStatus = res.status
      console.error(`Gemini model ${model} failed:`, lastStatus, lastErrText)
      // Fallback on any 404 (model not found / not supported for v1beta) or overloaded (503/429)
      const isModelNotFound = lastStatus === 404
      const isOverloaded = lastStatus === 503 || lastStatus === 429 || lastErrText.includes('high demand') || lastErrText.includes('UNAVAILABLE')
      const shouldFallback = isModelNotFound || isOverloaded
      if (!shouldFallback) {
        return jsonResponse({ error: 'Gemini API request failed', details: lastErrText, status: lastStatus, model }, 502)
      }
      // try next model
    }

    if (!geminiData) {
      return jsonResponse({ error: 'Gemini API request failed — all models unavailable', details: lastErrText, status: lastStatus }, 502)
    }
    console.log('Gemini raw:', JSON.stringify(geminiData).slice(0, 4000))

    const candidates = geminiData.candidates as Array<Record<string, unknown>> | undefined
    const candidate = candidates?.[0]
    const content = candidate?.content as { parts?: Array<{ text?: string }> } | undefined
    const rawText = content?.parts?.map((p) => p.text ?? '').join('').trim() ?? ''

    if (!rawText) {
      const finishReason = (candidate as Record<string, unknown>)?.finishReason ?? (geminiData.promptFeedback as unknown) ?? 'unknown'
      return jsonResponse({ error: 'Empty response from Gemini', finishReason, raw: geminiData }, 502)
    }

    console.log('Gemini rawText:', rawText.slice(0, 2000))

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(rawText) as Record<string, unknown>
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/)
      if (!match) {
        return jsonResponse({ error: 'Failed to parse Gemini JSON output', rawText }, 502)
      }
      try {
        parsed = JSON.parse(match[0]) as Record<string, unknown>
      } catch (e) {
        return jsonResponse({ error: 'Failed to parse extracted JSON', rawText, extract: match[0], parseError: String(e) }, 502)
      }
    }

    const result = {
      name: String(parsed.name ?? '').trim(),
      title: String(parsed.title ?? '').trim(),
      summary: String(parsed.summary ?? '').trim(),
      keywords: Array.isArray(parsed.keywords)
        ? (parsed.keywords as unknown[]).map((k) => String(k).trim().toLowerCase()).filter(Boolean)
        : typeof parsed.keywords === 'string'
        ? String(parsed.keywords).split(',').map((k) => k.trim().toLowerCase()).filter(Boolean)
        : [],
    }

    if (!result.name || !result.title || !result.summary || result.keywords.length === 0) {
      return jsonResponse({ error: 'Incomplete AI response', result, rawText }, 502)
    }

    return jsonResponse(result, 200)
  } catch (err) {
    console.error('fill-form error:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return jsonResponse({ error: msg }, 500)
  }
})
