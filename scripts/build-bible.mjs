#!/usr/bin/env node
/**
 * Build offline Bible data from eBible.org USFM releases.
 *
 * Downloads the redistributable USFM bundle for each configured translation,
 * parses it into one compact JSON file per book, and writes the result to
 * public/bible/<VERSION>/<BOOK>.json alongside a manifest describing what is
 * available. The app fetches these directly, so no Bible API key is needed and
 * the text works fully offline once cached.
 *
 *   npm run build:bible            # all versions
 *   npm run build:bible -- ONEN    # just one
 *
 * Re-run when a translation is updated upstream; output is deterministic.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_ROOT = path.join(ROOT, 'public', 'bible')

/**
 * The three translations the official ACK "Kitabu Kipya cha Ibada" app offers.
 * All are marked Redistributable=True in eBible.org's translations.csv.
 */
const TRANSLATIONS = [
  {
    id: 'KJV',
    ebible: 'eng-kjv2006',
    name: 'King James Version',
    language: 'English',
    copyright: 'Public domain',
  },
  {
    id: 'WEB',
    ebible: 'engwebp',
    name: 'World English Bible',
    language: 'English',
    copyright: 'Public domain',
  },
  {
    id: 'ONEN',
    ebible: 'swhonen',
    name: 'Neno: Bibilia Takatifu',
    language: 'Kiswahili',
    copyright:
      'Biblica® Toleo Wazi Neno: Bibilia Takatifu™ © 1984, 1989, 2009, 2015 Biblica, Inc. Used under the Biblica Open licence.',
  },
]

/** Canonical book order + chapter counts, keyed by USFM book code. */
const BOOK_ORDER = [
  'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA',
  '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO',
  'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO',
  'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL',
  'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH',
  'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS',
  '1PE', '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV',
]
const BOOK_SET = new Set(BOOK_ORDER)

// ─── USFM cleaning ───────────────────────────────────────────────────────────

/**
 * Strip USFM character markup from a line of verse text.
 *
 * Footnotes (\f..\f*), cross references (\x..\x*) and their inline contents are
 * removed entirely — they are apparatus, not scripture. Character-level markers
 * that only style their content (\wj words of Jesus, \add supplied words, \nd
 * divine name, …) are unwrapped so the words survive.
 */
function cleanText(raw) {
  let s = raw
  // Drop note/reference spans including everything between marker and closer.
  s = s.replace(/\\(f|fe|x)\b.*?\\\1\*/g, '')
  // Drop any unterminated note opener that runs to end of line.
  s = s.replace(/\\(f|fe|x)\b.*$/g, '')
  // Drop USFM 3 attribute payloads: \w book|strong="G0976"\w* -> \w book\w*.
  // Without this the eBible KJV/WEB editions leak Strong's numbers into the text.
  s = s.replace(/\|[^\\|]*(?=\\\+?[a-z][a-z0-9]*\*)/g, '')
  // Unwrap remaining character markers, keeping their text.
  s = s.replace(/\\\+?[a-z][a-z0-9]*\*/g, '')
  s = s.replace(/\\\+?[a-z][a-z0-9]*\b\s?/g, '')
  // Normalise whitespace.
  return s.replace(/\s+/g, ' ').trim()
}

/** Paragraph markers whose indent level we keep so poetry renders correctly. */
const STYLE_MARKERS = new Set([
  'p', 'm', 'pi', 'pi1', 'pi2', 'mi', 'nb', 'pc', 'pr', 'cls',
  'q', 'q1', 'q2', 'q3', 'q4', 'qr', 'qc', 'qm', 'qm1', 'qm2',
  'li', 'li1', 'li2', 'li3', 'li4', 'lim', 'lim1', 'lim2',
  'd', 'sp',
])

/**
 * Parse one USFM book file into { id, name, abbr, chapters }.
 *
 * A verse's text can continue over any number of following lines carrying
 * paragraph markers (common in poetry and genealogies), so continuation lines
 * are appended to the open verse and separated with "\n" — the renderer turns
 * those into line breaks, which is what gives Matthew 1 its indented look.
 */
function parseUsfm(source) {
  const lines = source.split(/\r?\n/)
  let id = null
  let abbr = null
  // Name candidates in preference order: \toc2 and \h give the short form the
  // app shows in navigation ("Matthew"); \toc1/\mt1 are often long all-caps
  // title-page forms ("THE GOSPEL ACCORDING TO ST. MATTHEW").
  const names = { toc2: null, h: null, toc1: null, mt: null }

  const chapters = []
  let chapter = null
  let verse = null
  /** Heading text seen since the last verse, attached to the verse that follows. */
  let pendingHeadings = []
  let currentStyle = 'p'

  const closeVerse = () => {
    if (verse && verse.t) chapter.verses.push(verse)
    verse = null
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const markerMatch = trimmed.match(/^\\([a-z][a-z0-9]*)\*?\s?(.*)$/i)
    if (!markerMatch) {
      // Bare continuation text belonging to the open verse.
      if (verse) {
        const text = cleanText(trimmed)
        if (text) verse.t += (verse.t ? ' ' : '') + text
      }
      continue
    }

    const [, marker, rest] = markerMatch

    switch (marker) {
      case 'id':
        id = rest.trim().split(/\s+/)[0]?.toUpperCase() ?? null
        continue
      case 'h':
        names.h = names.h ?? cleanText(rest)
        continue
      case 'toc1':
        names.toc1 = names.toc1 ?? cleanText(rest)
        continue
      case 'toc2':
        names.toc2 = names.toc2 ?? cleanText(rest)
        continue
      case 'toc3':
        abbr = cleanText(rest) || abbr
        continue
      case 'mt':
      case 'mt1':
        names.mt = names.mt ?? cleanText(rest)
        continue
      case 'c': {
        closeVerse()
        const n = parseInt(rest.trim(), 10)
        if (!Number.isNaN(n)) {
          chapter = { n, verses: [] }
          chapters.push(chapter)
          pendingHeadings = []
          currentStyle = 'p'
        }
        continue
      }
      case 'v': {
        if (!chapter) continue
        closeVerse()
        const vMatch = rest.match(/^(\d+(?:[-–]\d+)?)\s*(.*)$/)
        if (!vMatch) continue
        verse = {
          v: parseInt(vMatch[1], 10),
          t: cleanText(vMatch[2]),
          s: currentStyle,
        }
        if (pendingHeadings.length) {
          verse.h = pendingHeadings
          pendingHeadings = []
        }
        continue
      }
      // Section headings — shown above the verse they precede.
      case 's': case 's1': case 's2': case 's3': case 'ms': case 'ms1': case 'r': {
        const text = cleanText(rest)
        if (text) pendingHeadings.push(text)
        continue
      }
      // Structural markers we intentionally drop.
      case 'ide': case 'mt2': case 'mt3': case 'rem':
      case 'usfm': case 'sts': case 'cl': case 'cp': case 'b':
        continue
      default:
        break
    }

    if (STYLE_MARKERS.has(marker)) {
      currentStyle = marker
      const text = cleanText(rest)
      if (verse) {
        // Continuation of the open verse on a new poetic/list line.
        if (text) verse.t += (verse.t ? '\n' : '') + text
      }
      continue
    }

    // Unknown marker: keep any text it carries rather than losing scripture.
    const text = cleanText(rest)
    if (verse && text) verse.t += (verse.t ? ' ' : '') + text
  }

  closeVerse()

  const name = names.toc2 || names.h || names.toc1 || names.mt

  return {
    id,
    name: name || id,
    abbr: abbr ?? id,
    chapters: chapters.filter((c) => c.verses.length > 0),
  }
}

// ─── Download + build ────────────────────────────────────────────────────────

function download(url, dest, attempts = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      execFileSync(
        'curl',
        ['-sSL', '--fail', '--retry', '3', '--retry-all-errors',
         '--connect-timeout', '30', '--max-time', '600', '-o', dest, url],
        { stdio: ['ignore', 'ignore', 'inherit'] },
      )
      return
    } catch (err) {
      // eBible.org drops long transfers fairly often; retry before giving up.
      if (attempt >= attempts) throw err
      process.stdout.write(`retry ${attempt}… `)
    }
  }
}

function buildTranslation(t) {
  console.log(`\n${t.id}  (eBible: ${t.ebible})`)
  const work = mkdtempSync(path.join(tmpdir(), `bible-${t.id}-`))
  try {
    const zip = path.join(work, 'usfm.zip')
    process.stdout.write('  downloading… ')
    download(`https://ebible.org/Scriptures/${t.ebible}_usfm.zip`, zip)
    console.log('done')

    const src = path.join(work, 'usfm')
    mkdirSync(src, { recursive: true })
    execFileSync('unzip', ['-o', '-q', zip, '-d', src])

    const outDir = path.join(OUT_ROOT, t.id)
    rmSync(outDir, { recursive: true, force: true })
    mkdirSync(outDir, { recursive: true })

    const parsed = new Map()
    for (const file of readdirSync(src)) {
      if (!file.toLowerCase().endsWith('.usfm')) continue
      const book = parseUsfm(readFileSync(path.join(src, file), 'utf8'))
      // Skip front/back matter and any non-canonical book (FRT, GLO, XXA…).
      if (!book.id || !BOOK_SET.has(book.id) || book.chapters.length === 0) continue
      parsed.set(book.id, book)
    }

    const books = []
    let totalVerses = 0
    for (const code of BOOK_ORDER) {
      const book = parsed.get(code)
      if (!book) continue
      writeFileSync(
        path.join(outDir, `${code}.json`),
        JSON.stringify({ id: code, name: book.name, abbr: book.abbr, chapters: book.chapters }),
      )
      const verses = book.chapters.reduce((sum, c) => sum + c.verses.length, 0)
      totalVerses += verses
      books.push({
        id: code,
        name: book.name,
        abbr: book.abbr,
        chapters: book.chapters.length,
        testament: BOOK_ORDER.indexOf(code) < 39 ? 'OT' : 'NT',
      })
    }

    const manifest = {
      id: t.id,
      name: t.name,
      language: t.language,
      copyright: t.copyright,
      source: `https://ebible.org/${t.ebible}/`,
      builtAt: new Date().toISOString().slice(0, 10),
      books,
    }
    writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest))

    const bytes = readdirSync(outDir).reduce(
      (sum, f) => sum + readFileSync(path.join(outDir, f)).length,
      0,
    )
    console.log(
      `  ${books.length} books, ${totalVerses.toLocaleString()} verses, ` +
        `${(bytes / 1024 / 1024).toFixed(1)} MB → public/bible/${t.id}/`,
    )
    return manifest
  } finally {
    rmSync(work, { recursive: true, force: true })
  }
}

const only = process.argv.slice(2).map((a) => a.toUpperCase())
const targets = only.length
  ? TRANSLATIONS.filter((t) => only.includes(t.id))
  : TRANSLATIONS

if (!targets.length) {
  console.error(`No matching translation. Known: ${TRANSLATIONS.map((t) => t.id).join(', ')}`)
  process.exit(1)
}

mkdirSync(OUT_ROOT, { recursive: true })
const built = targets.map(buildTranslation)

// The index lists every version present, so the app can offer them dynamically.
const indexPath = path.join(OUT_ROOT, 'index.json')
let existing = []
try {
  existing = JSON.parse(readFileSync(indexPath, 'utf8'))
} catch {
  existing = []
}
const byId = new Map(existing.map((v) => [v.id, v]))
for (const m of built) {
  byId.set(m.id, {
    id: m.id,
    name: m.name,
    language: m.language,
    copyright: m.copyright,
    source: m.source,
    builtAt: m.builtAt,
    books: m.books.length,
  })
}
const index = TRANSLATIONS.map((t) => byId.get(t.id)).filter(Boolean)
writeFileSync(indexPath, JSON.stringify(index, null, 2))
console.log(`\nWrote public/bible/index.json (${index.length} versions)`)
