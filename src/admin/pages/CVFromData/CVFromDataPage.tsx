import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Check, Download, Loader2, Pencil, Plus, RefreshCw, Save, Sparkles } from 'lucide-react'
import { toast } from '@/shared/lib/toast'
import { supabase } from '@/shared/lib/supabase'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { CVDocument } from '@/portfolio/components/cv/CVDocument'
import { buildCVData, suggestedSelection } from '@/shared/lib/cv-mapper'
import { cvLibraryService } from '@/shared/services/cv-library-service'
import { CV_ENTRY_KINDS, type CVEntry, type CVEntryKind, type CVProfile } from '@/shared/types/cv-library'

const kindLabels: Record<CVEntryKind, string> = {
  identity: 'Personal details',
  skills: 'Skills',
  experience: 'Experience',
  education: 'Education',
  certifications: 'Certifications',
  languages: 'Languages',
  socialLinks: 'Social links',
  projects: 'Projects',
  achievements: 'Achievements',
  references: 'References',
}

const fieldLabel = (key: string) => key.replace(/([A-Z])/g, ' $1').replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase())
const inputClass = 'w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-primary'
const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary to-[#1d4fd7] px-4 py-2 text-sm font-medium text-white shadow-soft hover:bg-primary-light disabled:opacity-50'

function EntryEditor({ entry, onSaved, onClose }: { entry: CVEntry; onSaved: () => void; onClose: () => void }) {
  const [label, setLabel] = useState(entry.label)
  const [content, setContent] = useState<Record<string, unknown>>(entry.content)
  const [tags, setTags] = useState((entry.tags ?? []).join(', '))
  const [isPublic, setIsPublic] = useState(entry.is_public)
  const [isSaving, setIsSaving] = useState(false)

  const updateField = (key: string, value: string) => {
    const original = content[key]
    const nextValue = Array.isArray(original)
      ? key === 'highlights'
        ? value.split('\n').map((line) => line.trim()).filter(Boolean).map((text) => ({ text }))
        : value.split('\n').map((line) => line.trim()).filter(Boolean)
      : value
    setContent((current) => ({ ...current, [key]: nextValue }))
  }

  const save = async () => {
    if (!label.trim()) return toast.error('Add a label first')
    setIsSaving(true)
    try {
      await cvLibraryService.updateEntry(entry.id, {
        label: label.trim(),
        content,
        tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        is_public: isPublic,
      })
      toast.success('CV content saved')
      onSaved()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save CV content')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div role="dialog" aria-modal="true" aria-label={`Edit ${entry.label}`} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-surface p-6 shadow-dialog">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div><p className="text-xs text-text-tertiary">{kindLabels[entry.kind]}</p><h2 className="text-lg font-semibold text-text">Edit CV content</h2></div>
          <button type="button" onClick={onClose} className="text-sm text-text-secondary hover:text-text">Close</button>
        </div>
        <div className="space-y-4">
          <label className="block text-sm text-text-secondary">Label<input value={label} onChange={(event) => setLabel(event.target.value)} className={`mt-1 ${inputClass}`} /></label>
          {Object.entries(content).map(([key, value]) => {
            const displayValue = Array.isArray(value)
              ? key === 'highlights' ? value.map((item) => typeof item === 'object' && item !== null ? String((item as { text?: unknown }).text ?? '') : String(item)).join('\n') : value.join('\n')
              : String(value ?? '')
            const multiline = Array.isArray(value) || displayValue.length > 90 || ['summary', 'description'].includes(key)
            return <label key={key} className="block text-sm text-text-secondary">{fieldLabel(key)}
              {multiline
                ? <textarea value={displayValue} onChange={(event) => updateField(key, event.target.value)} rows={Math.min(8, Math.max(3, displayValue.split('\n').length))} className={`mt-1 ${inputClass}`} />
                : <input value={displayValue} onChange={(event) => updateField(key, event.target.value)} className={`mt-1 ${inputClass}`} />}
            </label>
          })}
          <label className="block text-sm text-text-secondary">Matching tags (comma separated)<input value={tags} onChange={(event) => setTags(event.target.value)} className={`mt-1 ${inputClass}`} /></label>
          <label className="flex items-center gap-2 text-sm text-text"><input type="checkbox" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} /> Show in the public CV</label>
          {entry.kind === 'references' && <p className="text-xs text-text-tertiary">References contain other people's contact details. Publish only with their permission.</p>}
        </div>
        <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button><button type="button" onClick={save} disabled={isSaving} className={buttonClass}><Save className="h-4 w-4" />{isSaving ? 'Saving…' : 'Save content'}</button></div>
      </div>
    </div>
  )
}

export function CVFromDataPage() {
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<'profile' | 'content'>('profile')
  const [profileId, setProfileId] = useState('')
  const [creating, setCreating] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: '', title: '', summary: '', keywords: '' })
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [editingEntry, setEditingEntry] = useState<CVEntry | null>(null)
  const [contentKind, setContentKind] = useState<CVEntryKind>('identity')
  const [chooseKind, setChooseKind] = useState<CVEntryKind>('skills')
  const [skillCategoryFilter, setSkillCategoryFilter] = useState<string>('all')
  const [isAiFilling, setIsAiFilling] = useState(false)

  const handleAiFill = async () => {
    const mainInput = profileForm.title.trim() || profileForm.name.trim() || profileForm.summary.trim()
    if (!mainInput) {
      toast.error('Enter a CV title first (e.g. "Senior ASP.NET Core Developer")')
      return
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
    if (!supabaseUrl || !supabaseAnonKey) {
      toast.error('Supabase not configured — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env', { duration: 6000 })
      console.error('[fill-form] Missing Supabase env. VITE_SUPABASE_URL:', supabaseUrl, 'VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'present' : 'missing')
      return
    }

    setIsAiFilling(true)
    try {
      // Build catalog from existing DB entries so Gemini grounds keywords to real skills
      const availableSkills = entries
        .filter((e) => e.kind === 'skills')
        .map((e) => String((e.content as Record<string, unknown>).name ?? e.label ?? ''))
        .filter(Boolean)
        .slice(0, 40)
      const availableExperiences = entries
        .filter((e) => e.kind === 'experience')
        .map((e) => String((e.content as Record<string, unknown>).position ?? e.label ?? ''))
        .filter(Boolean)
        .slice(0, 20)
      const availableProjects = entries
        .filter((e) => e.kind === 'projects')
        .map((e) => String((e.content as Record<string, unknown>).name ?? e.label ?? ''))
        .filter(Boolean)
        .slice(0, 20)

      const payload = {
        input: mainInput,
        name: profileForm.name,
        title: profileForm.title,
        summary: profileForm.summary,
        keywords: profileForm.keywords,
        availableSkills,
        availableExperiences,
        availableProjects,
      }
      console.log('[fill-form] invoking with payload:', payload, 'url:', `${supabaseUrl}/functions/v1/fill-form`)

      const { data, error } = await supabase.functions.invoke('fill-form', { body: payload })

      if (error) {
        // FunctionsError has context with status + response body — surface it instead of generic message
        const ctx = (error as unknown as { context?: unknown; status?: number })?.context
        const status = (error as unknown as { status?: number })?.status
        console.error('[fill-form] invoke error:', error, 'context:', ctx, 'status:', status)

        // Try to extract real message from context
        let detail = error.message
        try {
          if (ctx && typeof ctx === 'object') {
            const maybeJson = ctx as Record<string, unknown>
            if (typeof maybeJson.json === 'function') {
              // @ts-ignore
              const j = await (maybeJson.json as () => Promise<unknown>)()
              detail = JSON.stringify(j)
            } else if ('error' in maybeJson) detail = String(maybeJson.error)
            else detail = JSON.stringify(ctx)
          } else if (typeof ctx === 'string') detail = ctx
        } catch { /* ignore parse */ }

        // Most common: "Failed to send a request to the Edge Function" -> not deployed / CORS / verify_jwt / network
        if (detail.includes('Failed to send a request')) {
          throw new Error(
            `Edge Function not reachable. Checklist: 1) Deploy function: supabase functions deploy fill-form --no-verify-jwt  2) Set secret: supabase secrets set GEMINI_API_KEY=...  3) In Supabase Dashboard > Edge Functions > fill-form enable "No JWT verification"  4) Ensure VITE_SUPABASE_URL points to the same project. Original: ${detail}`,
          )
        }
        if (detail.includes('GEMINI_API_KEY')) {
          throw new Error(`GEMINI_API_KEY not set in Supabase Secrets. Run: supabase secrets set GEMINI_API_KEY=your_key then redeploy. Details: ${detail}`)
        }
        throw new Error(detail)
      }

      if (!data) throw new Error('Empty response from AI — check Edge Function logs in Supabase Dashboard')

      // Some Supabase versions wrap data; handle both {data: {...}} and direct
      const raw = (data as Record<string, unknown>)?.data ? (data as Record<string, unknown>).data as Record<string, unknown> : (data as Record<string, unknown>)
      const next = raw as { name?: string; title?: string; summary?: string; keywords?: string[] | string; error?: unknown; details?: unknown }
      console.log('[fill-form] response:', next)

      if (next.error) {
        const errMsg = typeof next.error === 'string' ? next.error : JSON.stringify(next.error)
        const details = next.details ? ` — ${typeof next.details === 'string' ? next.details : JSON.stringify(next.details)}` : ''
        throw new Error(errMsg + details)
      }

      const aiKeywordsArr: string[] = Array.isArray(next.keywords)
        ? (next.keywords as unknown[]).map((k) => String(k).trim().toLowerCase()).filter(Boolean)
        : typeof next.keywords === 'string'
          ? String(next.keywords).split(',').map((k) => k.trim().toLowerCase()).filter(Boolean)
          : []
      const keywordsValue = aiKeywordsArr.join(', ')

      if (!next.name && !next.title && !next.summary && !keywordsValue) {
        const keys = Object.keys(next)
        const isEmptyObj = keys.length === 0
        throw new Error(
          isEmptyObj
            ? `AI returned empty object {}. This usually means Gemini blocked or responseSchema error. Check Supabase Dashboard > Edge Functions > fill-form > Logs and verify GEMINI_API_KEY is valid and redeployed. Also try switching model to gemini-1.5-flash. Raw: ${JSON.stringify(next)}`
            : `AI returned empty fields. Raw: ${JSON.stringify(next)} — check Edge Function logs for Gemini rawText.`,
        )
      }

      // Auto-select skills/experiences/projects based on AI keywords (grounded to DB)
      const keywordsLower = aiKeywordsArr.map((k) => k.toLowerCase())
      const newSelected = new Set<string>(selectedIds)
      let addedSkills = 0, addedExps = 0, addedProjs = 0

      if (keywordsLower.length > 0 && entries.length > 0) {
        for (const entry of entries) {
          if (!['skills', 'experience', 'projects'].includes(entry.kind)) continue
          const haystack = `${entry.label} ${JSON.stringify(entry.content)} ${entry.tags.join(' ')}`.toLowerCase()
          const matchesKeyword = keywordsLower.some((kw) => haystack.includes(kw))
          const tagExact = entry.tags.some((t) => keywordsLower.includes(String(t).toLowerCase()))
          if (matchesKeyword || tagExact) {
            if (!newSelected.has(entry.id)) {
              newSelected.add(entry.id)
              if (entry.kind === 'skills') addedSkills++
              else if (entry.kind === 'experience') addedExps++
              else if (entry.kind === 'projects') addedProjs++
            }
          }
        }
        // Also fallback to suggestedSelection logic for broader matching
        if (addedSkills + addedExps + addedProjs === 0) {
          const tmpProfile = { keywords: aiKeywordsArr } as unknown as CVProfile
          const suggested = suggestedSelection(entries, tmpProfile as CVProfile, [])
          for (const id of suggested) {
            const e = entries.find((x) => x.id === id)
            if (e && ['skills', 'experience', 'projects'].includes(e.kind) && !newSelected.has(id)) {
              newSelected.add(id)
              if (e.kind === 'skills') addedSkills++
              else if (e.kind === 'experience') addedExps++
              else if (e.kind === 'projects') addedProjs++
            }
          }
        }
      }

      // Build final Matching keywords from selected skills + AI keywords (ensures keywords reflect actually added skills)
      let finalKeywordsValue = keywordsValue
      if (newSelected.size > 0) {
        const selectedSkillNames = entries
          .filter((e) => e.kind === 'skills' && newSelected.has(e.id))
          .map((e) => String((e.content as Record<string, unknown>).name ?? e.label).toLowerCase().trim())
          .filter(Boolean)
        const merged = [...new Set([...aiKeywordsArr, ...selectedSkillNames])].slice(0, 12)
        if (merged.length > 0) finalKeywordsValue = merged.join(', ')
      }

      setProfileForm({
        name: typeof next.name === 'string' && next.name.trim() ? next.name.trim() : profileForm.name,
        title: typeof next.title === 'string' && next.title.trim() ? next.title.trim() : profileForm.title,
        summary: typeof next.summary === 'string' && next.summary.trim() ? next.summary.trim() : profileForm.summary,
        keywords: finalKeywordsValue || profileForm.keywords || keywordsValue,
      })

      if (newSelected.size !== selectedIds.size) {
        setSelectedIds(newSelected)
      }

      const totalAdded = addedSkills + addedExps + addedProjs
      if (totalAdded > 0) {
        toast.success(`Auto-filled + selected ${addedSkills} skills, ${addedExps} experiences, ${addedProjs} projects`, { duration: 5000 })
      } else {
        toast.success('Form auto-filled with AI')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : typeof err === 'object' && err !== null && 'message' in err ? String((err as { message: unknown }).message) : 'AI fill failed'
      console.error('[fill-form] failed:', err)
      toast.error(message, { duration: 7000 })
    } finally {
      setIsAiFilling(false)
    }
  }

  const entriesQuery = useQuery({ queryKey: ['admin', 'cv-entries'], queryFn: cvLibraryService.adminEntries })
  const profilesQuery = useQuery({ queryKey: ['admin', 'cv-profiles'], queryFn: cvLibraryService.profiles })
  const entries = entriesQuery.data ?? []
  const profiles = profilesQuery.data ?? []
  const currentProfile = profiles.find((profile) => profile.id === profileId)
  const overridesQuery = useQuery({ queryKey: ['admin', 'cv-profile-entries', profileId], queryFn: () => cvLibraryService.profileEntries(profileId), enabled: Boolean(profileId) })

  useEffect(() => {
    if (!profileId && profiles.length > 0 && !creating) setProfileId(profiles[0].id)
  }, [profiles, profileId, creating])

  useEffect(() => {
    if (!currentProfile || !entries.length || overridesQuery.isLoading) return
    setProfileForm({ name: currentProfile.name, title: currentProfile.title, summary: currentProfile.summary, keywords: currentProfile.keywords.join(', ') })
    setSelectedIds(suggestedSelection(entries, currentProfile, overridesQuery.data ?? []))
  }, [currentProfile, entries, overridesQuery.data, overridesQuery.isLoading])

  const draftProfile = useMemo<CVProfile | undefined>(() => currentProfile && ({
    ...currentProfile,
    name: profileForm.name,
    title: profileForm.title,
    summary: profileForm.summary,
    keywords: profileForm.keywords.split(',').map((keyword) => keyword.trim()).filter(Boolean),
  }), [currentProfile, profileForm])
  const cvData = useMemo(() => buildCVData(entries, draftProfile, selectedIds), [entries, draftProfile, selectedIds])

  const saveProfileMutation = useMutation({
    mutationFn: async () => {
      const values = { name: profileForm.name.trim(), title: profileForm.title.trim(), summary: profileForm.summary.trim(), keywords: profileForm.keywords.split(',').map((word) => word.trim()).filter(Boolean) }
      if (!values.name) throw new Error('Enter a CV type name')
      if (creating) return cvLibraryService.createProfile({ ...values, slug: `cv-${Date.now()}` })
      if (!profileId) throw new Error('Select a CV type')
      await cvLibraryService.updateProfile(profileId, values)
      return null
    },
    onSuccess: (profile) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cv-profiles'] })
      if (profile) { setProfileId(profile.id); setCreating(false) }
      toast.success('CV type saved')
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not save CV type'),
  })

  const saveSelectionMutation = useMutation({
    mutationFn: () => cvLibraryService.saveSelection(profileId, entries.filter((entry) => entry.kind !== 'identity').map((entry) => ({ profile_id: profileId, entry_id: entry.id, included: selectedIds.has(entry.id) }))),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'cv-profile-entries', profileId] }); toast.success('CV selection saved') },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not save CV selection'),
  })

  if (entriesQuery.isLoading || profilesQuery.isLoading) return <PageSkeleton />
  if (entriesQuery.isError || profilesQuery.isError) return <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-text">CV data could not be loaded. Apply the CV library migration, then reload this page.</p>

  const toggleEntry = (entryId: string) => setSelectedIds((current) => {
    const next = new Set(current)
    if (next.has(entryId)) next.delete(entryId)
    else next.add(entryId)
    return next
  })

  return (
    <div className="space-y-6">
      <PageHeader title="CV from database" description="Build a role-focused CV from saved content. Your original Create CV page stays separate." />
      <div className="flex gap-2 border-b border-border pb-3">
        <button type="button" onClick={() => setTab('profile')} className={`rounded-lg px-4 py-2 text-sm ${tab === 'profile' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface-hover'}`}>CV types & selection</button>
        <button type="button" onClick={() => setTab('content')} className={`rounded-lg px-4 py-2 text-sm ${tab === 'content' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface-hover'}`}>CV content ({entries.length})</button>
      </div>

      {tab === 'profile' ? <>
        <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-text">CV type</h2>
            <button type="button" onClick={() => { setCreating(true); setProfileId(''); setProfileForm({ name: '', title: '', summary: '', keywords: '' }); setSelectedIds(new Set()) }} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text"><Plus className="h-4 w-4" /> New type</button>
          </div>
          {!creating && <label className="mb-4 block text-sm text-text-secondary">Choose a type<select value={profileId} onChange={(event) => setProfileId(event.target.value)} className={`mt-1 ${inputClass}`}><option value="">Choose…</option>{profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}</select></label>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-text-secondary">Type name<input value={profileForm.name} onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))} className={`mt-1 ${inputClass}`} placeholder="ASP.NET" /></label>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-text-secondary">CV title</span>
                <button
                  type="button"
                  onClick={handleAiFill}
                  disabled={isAiFilling || !profileForm.title.trim()}
                  title={profileForm.title.trim() ? 'Auto-fill remaining fields with AI based on this title' : 'Enter a CV title first'}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-primary/15"
                >
                  {isAiFilling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  {isAiFilling ? 'Filling…' : 'Auto-fill with AI'}
                </button>
              </div>
              <input value={profileForm.title} onChange={(event) => setProfileForm((current) => ({ ...current, title: event.target.value }))} className={inputClass} placeholder="ASP.NET Core Developer" />
              <p className="text-[11px] text-text-tertiary">Tip: type a title and click AI to generate name, summary & keywords</p>
            </div>
            <label className="sm:col-span-2 text-sm text-text-secondary">Matching keywords (comma separated)<input value={profileForm.keywords} onChange={(event) => setProfileForm((current) => ({ ...current, keywords: event.target.value }))} className={`mt-1 ${inputClass}`} placeholder="asp.net, c#, sql server" /></label>
            <label className="sm:col-span-2 text-sm text-text-secondary">Summary for this CV<textarea value={profileForm.summary} onChange={(event) => setProfileForm((current) => ({ ...current, summary: event.target.value }))} rows={3} className={`mt-1 ${inputClass}`} /></label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => saveProfileMutation.mutate()} disabled={saveProfileMutation.isPending} className={buttonClass}><Save className="h-4 w-4" />Save type</button>{creating && <button type="button" onClick={() => { setCreating(false); setProfileId(profiles[0]?.id ?? '') }} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>}</div>
        </section>

        {currentProfile && !creating && <>
          <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
            {(() => {
              const selectable = entries.filter((e) => e.kind !== 'identity')
              const allSelected = selectable.length > 0 && selectable.every((e) => selectedIds.has(e.id))
              return (
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-text">Choose content</h2>
                    <p className="text-sm text-text-secondary">Pick what appears in this CV — tabs keep it tidy, no checkboxes in sight.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (allSelected) setSelectedIds(new Set())
                        else setSelectedIds(new Set(selectable.map((e) => e.id)))
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg px-3 py-2 text-xs font-medium text-text hover:bg-surface-hover hover:border-primary/30 transition-colors"
                    >
                      <span className={`h-4 w-4 rounded-md border flex items-center justify-center transition-colors ${allSelected ? 'bg-primary border-primary text-white' : 'border-border bg-transparent'}`}>
                        {allSelected && <Check className="h-3 w-3" />}
                      </span>
                      {allSelected ? 'Deselect all' : 'Select all'}
                    </button>
                    <button type="button" onClick={() => setSelectedIds(suggestedSelection(entries, { ...currentProfile, keywords: profileForm.keywords.split(',').map((word) => word.trim()).filter(Boolean) }))} className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-xs font-medium text-text hover:bg-surface-hover"><RefreshCw className="h-3.5 w-3.5" />Apply suggestions</button>
                  </div>
                </div>
              )
            })()}

            {/* Tabs — wrap, no scroll */}
            <div className="mb-4 flex flex-wrap gap-1.5">
              {CV_ENTRY_KINDS.filter((k) => k !== 'identity').map((kind) => {
                const items = entries.filter((e) => e.kind === kind)
                if (!items.length) return null
                const count = items.filter((it) => selectedIds.has(it.id)).length
                const isActive = chooseKind === kind
                return (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => { setChooseKind(kind); setSkillCategoryFilter('all') }}
                    className={`shrink-0 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium transition-all border ${isActive ? 'bg-primary text-white border-primary shadow-sm' : 'bg-bg text-text-secondary border-border hover:border-primary/30 hover:text-text'}`}
                  >
                    {kindLabels[kind]}
                    <span className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : count > 0 ? 'bg-primary/10 text-primary' : 'bg-surface-hover text-text-tertiary'}`}>
                      {count}/{items.length}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Active tab content — skills grouped by category + internal filter */}
            {(() => {
              const allItems = entries.filter((e) => e.kind === chooseKind)

              // Skills: grouped by content.category, filterable
              if (chooseKind === 'skills' && allItems.length > 0) {
                const categories = [...new Set(allItems.map((e) => String((e.content as Record<string, unknown>).category || 'General')))]
                const displayItems = skillCategoryFilter === 'all' ? allItems : allItems.filter((e) => String((e.content as Record<string, unknown>).category || 'General') === skillCategoryFilter)
                const kindAllSelected = displayItems.length > 0 && displayItems.every((it) => selectedIds.has(it.id))

                const renderCard = (entry: typeof allItems[number]) => {
                  const isSelected = selectedIds.has(entry.id)
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => toggleEntry(entry.id)}
                      className={`group text-left relative flex items-start gap-3 rounded-xl border p-4 text-sm transition-all ${isSelected ? 'bg-primary/[0.06] border-primary shadow-sm' : 'bg-bg border-border hover:border-primary/25 hover:bg-surface-hover'}`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className={`block font-medium leading-tight ${isSelected ? 'text-primary' : 'text-text'}`}>{entry.label}</span>
                        <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-tertiary">
                          {String(entry.content.description ?? entry.content.category ?? '') || (entry.tags.length ? entry.tags.slice(0, 3).join(' · ') : '—')}
                        </span>
                        {entry.tags.length > 0 && (
                          <span className="mt-2 flex flex-wrap gap-1">
                            {entry.tags.slice(0, 3).map((t) => (
                              <span key={t} className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${isSelected ? 'bg-primary/10 text-primary' : 'bg-surface-hover text-text-tertiary'}`}>
                                {t}
                              </span>
                            ))}
                          </span>
                        )}
                      </span>
                      <span className={`shrink-0 mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border transition-all ${isSelected ? 'bg-primary border-primary text-white shadow-sm' : 'border-border bg-surface text-transparent group-hover:border-primary/30'}`}>
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  )
                }

                return (
                  <div>
                    {/* Internal category filter — wrap, no scroll */}
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSkillCategoryFilter('all')}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${skillCategoryFilter === 'all' ? 'bg-primary text-white border-primary' : 'bg-bg text-text-secondary border-border hover:border-primary/30'}`}
                      >
                        All categories <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${skillCategoryFilter === 'all' ? 'bg-white/20' : 'bg-surface-hover'}`}>{allItems.length}</span>
                      </button>
                      {categories.map((cat) => {
                        const count = allItems.filter((e) => String((e.content as Record<string, unknown>).category || 'General') === cat).length
                        const selected = allItems.filter((e) => String((e.content as Record<string, unknown>).category || 'General') === cat && selectedIds.has(e.id)).length
                        const isActive = skillCategoryFilter === cat
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setSkillCategoryFilter(cat)}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${isActive ? 'bg-primary text-white border-primary' : 'bg-bg text-text-secondary border-border hover:border-primary/30'}`}
                          >
                            {cat} <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${isActive ? 'bg-white/20' : selected > 0 ? 'bg-primary/10 text-primary' : 'bg-surface-hover'}`}>{selected}/{count}</span>
                          </button>
                        )
                      })}
                    </div>

                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="text-xs text-text-tertiary">
                        {skillCategoryFilter === 'all' ? `${allItems.length} skills across ${categories.length} categories — grouped` : `${displayItems.length} skills in ${skillCategoryFilter}`}
                        {' — click cards to select'}
                      </p>
                      {displayItems.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedIds((current) => {
                              const next = new Set(current)
                              if (kindAllSelected) displayItems.forEach((it) => next.delete(it.id))
                              else displayItems.forEach((it) => next.add(it.id))
                              return next
                            })
                          }}
                          className="text-xs font-medium text-primary hover:text-primary-light"
                        >
                          {kindAllSelected ? 'Deselect all' : 'Select all'}
                        </button>
                      )}
                    </div>

                    {skillCategoryFilter === 'all' ? (
                      <div className="space-y-6">
                        {categories.map((cat) => {
                          const catItems = allItems.filter((e) => String((e.content as Record<string, unknown>).category || 'General') === cat)
                          if (!catItems.length) return null
                          return (
                            <div key={cat}>
                              <div className="mb-2 flex items-center gap-2">
                                <h4 className="text-xs font-semibold text-text">{cat}</h4>
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{catItems.filter((it) => selectedIds.has(it.id)).length}/{catItems.length}</span>
                                <div className="h-px flex-1 bg-border/50" />
                              </div>
                              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {catItems.map((entry) => renderCard(entry))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {displayItems.map((entry) => renderCard(entry))}
                      </div>
                    )}
                  </div>
                )
              }

              // Other kinds: flat grid
              const items = allItems
              const kindAllSelected = items.length > 0 && items.every((it) => selectedIds.has(it.id))
              return (
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-xs text-text-tertiary">
                      {items.length} {kindLabels[chooseKind].toLowerCase()} available — click cards to select
                    </p>
                    {items.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedIds((current) => {
                            const next = new Set(current)
                            if (kindAllSelected) items.forEach((it) => next.delete(it.id))
                            else items.forEach((it) => next.add(it.id))
                            return next
                          })
                        }}
                        className="text-xs font-medium text-primary hover:text-primary-light"
                      >
                        {kindAllSelected ? 'Deselect all' : 'Select all'}
                      </button>
                    )}
                  </div>
                  {items.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-bg p-8 text-center">
                      <p className="text-sm text-text-tertiary">No {kindLabels[chooseKind].toLowerCase()} yet</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {items.map((entry) => {
                        const isSelected = selectedIds.has(entry.id)
                        return (
                          <button
                            key={entry.id}
                            type="button"
                            onClick={() => toggleEntry(entry.id)}
                            className={`group text-left relative flex items-start gap-3 rounded-xl border p-4 text-sm transition-all ${isSelected ? 'bg-primary/[0.06] border-primary shadow-sm' : 'bg-bg border-border hover:border-primary/25 hover:bg-surface-hover'}`}
                          >
                            <span className="min-w-0 flex-1">
                              <span className={`block font-medium leading-tight ${isSelected ? 'text-primary' : 'text-text'}`}>{entry.label}</span>
                              <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-tertiary">
                                {String(entry.content.description ?? entry.content.category ?? entry.content.technologies ?? entry.content.position ?? '') || (entry.tags.length ? entry.tags.slice(0, 3).join(' · ') : '—')}
                              </span>
                            </span>
                            <span className={`shrink-0 mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border transition-all ${isSelected ? 'bg-primary border-primary text-white shadow-sm' : 'border-border bg-surface text-transparent group-hover:border-primary/30'}`}>
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })()}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5"><button type="button" onClick={() => saveSelectionMutation.mutate()} disabled={saveSelectionMutation.isPending} className={buttonClass}><Save className="h-4 w-4" />Save selection</button><p className="text-xs text-text-tertiary">Selection updates the preview instantly — save to keep it for this CV type.</p></div>
          </section>
          <section className="rounded-xl border border-border bg-surface p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold text-text">CV preview</h2><p className="text-sm text-text-secondary">{cvData.name} · {cvData.title} · {selectedIds.size} selected items</p></div><PDFDownloadLink document={<CVDocument data={cvData} />} fileName={`${(currentProfile.slug || 'cv').replace(/[^a-z0-9-]/gi, '-')}.pdf`} className={buttonClass}>{({ loading }) => <><Download className="h-4 w-4" />{loading ? 'Preparing PDF…' : 'Download this CV'}</>}</PDFDownloadLink></div><div className="mt-4 grid gap-3 text-sm text-text-secondary sm:grid-cols-3"><p>Skills: {cvData.skills.length}</p><p>Experience: {cvData.experience.length}</p><p>Projects: {cvData.projects.length}</p></div></section>
        </>}
      </> : <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold text-text">CV source content</h2><p className="text-sm text-text-secondary">Imported from the original Create CV defaults. Edit here to update the database and public CV.</p></div><select value={contentKind} onChange={(event) => setContentKind(event.target.value as CVEntryKind)} className={`${inputClass} w-auto`}>{CV_ENTRY_KINDS.map((kind) => <option key={kind} value={kind}>{kindLabels[kind]}</option>)}</select></div>
        <div className="divide-y divide-border">{entries.filter((entry) => entry.kind === contentKind).map((entry) => <div key={entry.id} className="flex items-center gap-3 py-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-text">{entry.label}</p><p className="text-xs text-text-tertiary">{entry.is_public ? 'Public CV' : 'Admin only'}{entry.tags.length ? ` · ${entry.tags.join(', ')}` : ''}</p></div><button type="button" onClick={() => setEditingEntry(entry)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"><Pencil className="h-4 w-4" />Edit</button></div>)}</div>
      </section>}
      {editingEntry && <EntryEditor key={editingEntry.id} entry={editingEntry} onClose={() => setEditingEntry(null)} onSaved={() => { queryClient.invalidateQueries({ queryKey: ['admin', 'cv-entries'] }); queryClient.invalidateQueries({ queryKey: ['portfolio', 'cv-entries'] }); setEditingEntry(null) }} />}
    </div>
  )
}
