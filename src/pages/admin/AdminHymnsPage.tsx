import { useState, useEffect } from 'react'
import { Music, Plus, Edit2, Trash2, Save, X, Eye, EyeOff, ChevronDown, ChevronUp, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface Hymn {
  id: string
  number: number
  title: string
  chorus: string | null
  full_text: string
  is_published: boolean
  category: string
  created_at: string
}

interface ParsedHymn {
  number: number
  title: string
  category: string
  chorus: string | null
  full_text: string
}

const EMPTY_FORM = { number: '', title: '', chorus: '', full_text: '', category: 'ack_hymnal' }

const IMPORT_EXAMPLE = `number: 21
title: Joy to the World
category: ack_hymnal
chorus:
lyrics:
1. Joy to the world! the Lord is come;
Let earth receive her King.

2. Joy to the earth! the Saviour reigns;
Let men their songs employ.
---
number: 22
title: O Come O Come Emmanuel
category: ack_hymnal
lyrics:
1. O come, O come, Emmanuel,
And ransom captive Israel.`

/**
 * Parses the bulk-import block format into hymn records.
 * Blocks are separated by a line containing only "---".
 * Within a block, "key: value" lines set fields; "lyrics:" and
 * "chorus:" begin multi-line bodies that run until the next key
 * (or the end of the block).
 */
function parseBulkImport(text: string, fallbackCategory: string): { hymns: ParsedHymn[]; errors: string[] } {
  const errors: string[] = []
  const hymns: ParsedHymn[] = []
  const blocks = text.split(/^\s*---\s*$/m).map(b => b.trim()).filter(Boolean)

  blocks.forEach((block, i) => {
    const lines = block.split('\n')
    let number: number | null = null
    let title = ''
    let category = fallbackCategory
    const chorusLines: string[] = []
    const lyricLines: string[] = []
    let mode: 'fields' | 'chorus' | 'lyrics' = 'fields'

    for (const raw of lines) {
      const line = raw
      const keyMatch = line.match(/^(number|title|category|chorus|lyrics)\s*:\s*(.*)$/i)
      if (keyMatch) {
        const key = keyMatch[1].toLowerCase()
        const val = keyMatch[2]
        if (key === 'number') { number = parseInt(val.trim()) || null; mode = 'fields' }
        else if (key === 'title') { title = val.trim(); mode = 'fields' }
        else if (key === 'category') {
          const c = val.trim().toLowerCase()
          if (c) category = c === 'golden_bells' || c === 'golden bells' ? 'golden_bells' : 'ack_hymnal'
          mode = 'fields'
        }
        else if (key === 'chorus') { mode = 'chorus'; if (val.trim()) chorusLines.push(val) }
        else if (key === 'lyrics') { mode = 'lyrics'; if (val.trim()) lyricLines.push(val) }
        continue
      }
      if (mode === 'chorus') chorusLines.push(line)
      else if (mode === 'lyrics') lyricLines.push(line)
    }

    const fullText = lyricLines.join('\n').trim()
    if (number === null) { errors.push(`Block ${i + 1}: missing "number:"`); return }
    if (!title) { errors.push(`Block ${i + 1} (no. ${number}): missing "title:"`); return }
    if (!fullText) { errors.push(`Block ${i + 1} (no. ${number}): missing "lyrics:"`); return }

    hymns.push({
      number,
      title,
      category,
      chorus: chorusLines.join('\n').trim() || null,
      full_text: fullText,
    })
  })

  return { hymns, errors }
}

export function AdminHymnsPage() {
  const { user } = useAuth()
  const [hymns, setHymns] = useState<Hymn[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Hymn | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [filterCategory, setFilterCategory] = useState<'all' | 'ack_hymnal' | 'golden_bells'>('all')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState('')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<string | null>(null)

  useEffect(() => { fetchHymns() }, [])

  async function fetchHymns() {
    const { data } = await supabase.from('hymns').select('*').order('number')
    setHymns(data || [])
    setLoading(false)
  }

  function openNew() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setError(null)
    setShowForm(true)
  }

  function openEdit(h: Hymn) {
    setEditing(h)
    setForm({ number: String(h.number), title: h.title, chorus: h.chorus ?? '', full_text: h.full_text, category: h.category || 'ack_hymnal' })
    setError(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSave() {
    if (!form.title.trim() || !form.number) { setError('Number and title are required.'); return }
    setSaving(true)
    setError(null)

    const payload = {
      number: parseInt(form.number),
      title: form.title.trim(),
      chorus: form.chorus.trim() || null,
      full_text: form.full_text.trim(),
      category: form.category,
      created_by: user?.id,
    }

    const { error: err } = editing
      ? await supabase.from('hymns').update(payload).eq('id', editing.id)
      : await supabase.from('hymns').insert(payload)

    if (err) { setError(err.message); setSaving(false); return }
    await fetchHymns()
    setShowForm(false)
    setSaving(false)
  }

  async function togglePublish(h: Hymn) {
    await supabase.from('hymns').update({ is_published: !h.is_published }).eq('id', h.id)
    setHymns(prev => prev.map(x => x.id === h.id ? { ...x, is_published: !x.is_published } : x))
  }

  async function handleDelete(id: string) {
    await supabase.from('hymns').delete().eq('id', id)
    setHymns(prev => prev.filter(h => h.id !== id))
    setDeleteConfirm(null)
  }

  const parsedPreview = importText.trim()
    ? parseBulkImport(importText, 'ack_hymnal')
    : { hymns: [], errors: [] }

  async function handleBulkImport() {
    const { hymns: parsed, errors } = parseBulkImport(importText, 'ack_hymnal')
    if (parsed.length === 0) {
      setImportResult(errors.length ? errors.join('\n') : 'Nothing to import.')
      return
    }
    setImporting(true)
    setImportResult(null)

    // Match existing rows by number + category to decide update vs insert
    const existingByKey = new Map(hymns.map(h => [`${h.number}|${h.category}`, h]))
    let updated = 0
    let inserted = 0
    const failures: string[] = []

    for (const p of parsed) {
      const existing = existingByKey.get(`${p.number}|${p.category}`)
      const payload = {
        number: p.number,
        title: p.title,
        category: p.category,
        chorus: p.chorus,
        full_text: p.full_text,
        created_by: user?.id,
      }
      const { error: err } = existing
        ? await supabase.from('hymns').update(payload).eq('id', existing.id)
        : await supabase.from('hymns').insert(payload)
      if (err) failures.push(`No. ${p.number} (${p.category}): ${err.message}`)
      else if (existing) updated++
      else inserted++
    }

    await fetchHymns()
    setImporting(false)
    const summary = `Imported ${parsed.length} hymn(s): ${updated} updated, ${inserted} added.`
    setImportResult(failures.length ? `${summary}\n\nErrors:\n${failures.join('\n')}` : summary)
    if (failures.length === 0) setImportText('')
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImportText(String(reader.result || ''))
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Music className="w-7 h-7 text-navy" />
          <div>
            <h1 className="text-2xl font-playfair text-navy">Hymns</h1>
            <p className="text-sm text-gray-500">{hymns.length} total · ACK Hymnal + Golden Bells</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setShowImport(v => !v); setImportResult(null) }}
            className="flex items-center gap-2 px-4 py-2 border border-navy/20 text-navy rounded-xl text-sm font-medium hover:bg-navy/5 transition-colors">
            <Upload className="w-4 h-4" /> Bulk Import
          </button>
          <button onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-xl text-sm font-medium hover:bg-navy/90 transition-colors">
            <Plus className="w-4 h-4" /> Add Hymn
          </button>
        </div>
      </div>

      {/* Bulk import panel */}
      {showImport && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-navy">Bulk Import Hymns</h2>
            <button onClick={() => setShowImport(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 space-y-1">
            <p className="font-semibold">Format — one block per hymn, separated by a line with only <code className="bg-white px-1 rounded">---</code></p>
            <p>Each block uses <code className="bg-white px-1 rounded">number:</code>, <code className="bg-white px-1 rounded">title:</code>, <code className="bg-white px-1 rounded">category:</code> (ack_hymnal or golden_bells), optional <code className="bg-white px-1 rounded">chorus:</code>, then <code className="bg-white px-1 rounded">lyrics:</code> followed by the verses.</p>
            <p>Hymns matching an existing number + category are <span className="font-semibold">updated</span>; new ones are added.</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" /> Upload .txt / .csv
              <input type="file" accept=".txt,.csv,text/plain" onChange={handleImportFile} className="hidden" />
            </label>
            <button onClick={() => setImportText(IMPORT_EXAMPLE)}
              className="text-sm text-navy hover:underline">Insert example</button>
          </div>

          <textarea value={importText}
            onChange={e => { setImportText(e.target.value); setImportResult(null) }}
            rows={14} placeholder={IMPORT_EXAMPLE}
            className="w-full px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-navy/20 focus:outline-none resize-y" />

          {importText.trim() && (
            <div className="text-xs text-gray-500">
              {parsedPreview.hymns.length} hymn(s) ready to import
              {parsedPreview.errors.length > 0 && (
                <span className="text-red-600"> · {parsedPreview.errors.length} block(s) with problems</span>
              )}
              {parsedPreview.errors.length > 0 && (
                <pre className="mt-1 text-red-600 whitespace-pre-wrap font-sans">{parsedPreview.errors.join('\n')}</pre>
              )}
            </div>
          )}

          {importResult && (
            <pre className="text-sm whitespace-pre-wrap font-sans bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-gray-700">{importResult}</pre>
          )}

          <div className="flex gap-3 pt-1">
            <button onClick={handleBulkImport} disabled={importing || parsedPreview.hymns.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-xl text-sm font-medium hover:bg-navy/90 disabled:opacity-50 transition-colors">
              <Upload className="w-4 h-4" />
              {importing ? 'Importing…' : `Import ${parsedPreview.hymns.length || ''} Hymn(s)`}
            </button>
            <button onClick={() => { setImportText(''); setImportResult(null) }}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {(['all', 'ack_hymnal', 'golden_bells'] as const).map(cat => (
          <button key={cat} onClick={() => setFilterCategory(cat)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${filterCategory === cat ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {cat === 'all' ? `All (${hymns.length})` : cat === 'ack_hymnal' ? `ACK Hymnal (${hymns.filter(h => h.category === 'ack_hymnal').length})` : `Golden Bells (${hymns.filter(h => h.category === 'golden_bells').length})`}
          </button>
        ))}
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-navy">{editing ? 'Edit Hymn' : 'New Hymn'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Hymn No. *</label>
              <input type="number" value={form.number}
                onChange={e => setForm({ ...form, number: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-navy/20 focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
              <input type="text" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Holy, Holy, Holy"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-navy/20 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Hymn Book / Category *</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-navy/20 focus:outline-none bg-white">
              <option value="ack_hymnal">ACK Hymnal</option>
              <option value="golden_bells">Golden Bells</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Chorus / Refrain <span className="text-gray-400">(optional — appears highlighted)</span>
            </label>
            <textarea value={form.chorus}
              onChange={e => setForm({ ...form, chorus: e.target.value })}
              rows={3} placeholder="Enter chorus or refrain lines here…"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-navy/20 focus:outline-none resize-none" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Full Lyrics *
              <span className="text-gray-400 font-normal ml-1">— number each verse: "1. First line"</span>
            </label>
            <textarea value={form.full_text}
              onChange={e => setForm({ ...form, full_text: e.target.value })}
              rows={12} placeholder={`1. Holy, holy, holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;\n\n2. Holy, holy, holy! All the saints adore Thee,\nCasting down their golden crowns around the glassy sea;`}
              className="w-full px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-navy/20 focus:outline-none resize-y" />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-xl text-sm font-medium hover:bg-navy/90 disabled:opacity-50 transition-colors">
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Hymn'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Hymns list */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading…</div>
      ) : hymns.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Music className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="font-medium text-gray-600">No hymns yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Hymn" to add hymns</p>
        </div>
      ) : (
        <div className="space-y-2">
          {hymns.filter(h => filterCategory === 'all' || h.category === filterCategory).map(h => (
            <div key={h.id} className={`bg-white rounded-xl border transition-all ${h.is_published ? 'border-gray-100' : 'border-orange-100 bg-orange-50/30'}`}>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 bg-navy/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-navy font-bold text-xs">{h.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-sm truncate">{h.title}</p>
                  <p className="text-xs text-gray-400">
                    {h.full_text.split('\n').filter(Boolean).length} lines
                    <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium ${h.category === 'golden_bells' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'}`}>
                      {h.category === 'golden_bells' ? 'Golden Bells' : 'ACK Hymnal'}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => togglePublish(h)} title={h.is_published ? 'Unpublish' : 'Publish'}
                    className={`p-1.5 rounded-lg transition-colors ${h.is_published ? 'text-green-600 hover:bg-green-50' : 'text-orange-500 hover:bg-orange-50'}`}>
                    {h.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(h)} className="p-1.5 text-gray-400 hover:text-navy hover:bg-navy/5 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteConfirm(h.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setExpanded(expanded === h.id ? null : h.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">
                    {expanded === h.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {expanded === h.id && (
                <div className="px-4 pb-4 border-t border-gray-50">
                  {h.chorus && (
                    <div className="mt-3 bg-amber-50 border-l-4 border-amber-300 rounded-r-lg px-3 py-2 text-sm text-gray-700 italic">
                      {h.chorus}
                    </div>
                  )}
                  <pre className="mt-3 text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                    {h.full_text}
                  </pre>
                </div>
              )}

              {deleteConfirm === h.id && (
                <div className="px-4 pb-3 border-t border-red-100 bg-red-50/50">
                  <p className="text-sm text-red-700 py-2">Delete "{h.title}"? This cannot be undone.</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(h.id)}
                      className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                      Delete
                    </button>
                    <button onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
