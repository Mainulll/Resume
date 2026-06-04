const modules = import.meta.glob('/src/content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const WORDS_PER_MINUTE = 220
const FILENAME_RX = /\/(\d{4}-\d{2}-\d{2})-(.+)\.md$/

function parseFrontmatter(raw) {
  const text = raw.replace(/\r\n/g, '\n')
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) return { data: {}, content: text }
  const [, fm, content] = m
  const data = {}
  for (const line of fm.split('\n')) {
    const km = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.*)$/)
    if (!km) continue
    data[km[1]] = parseValue(km[2].trim())
  }
  return { data, content }
}

function parseValue(v) {
  if (v === '' || v === 'null' || v === '~') return null
  if (v === 'true') return true
  if (v === 'false') return false
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1)
  }
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim()
    if (!inner) return []
    return inner.split(',').map((s) => parseValue(s.trim()))
  }
  if (/^-?\d+$/.test(v)) return parseInt(v, 10)
  if (/^-?\d+\.\d+$/.test(v)) return parseFloat(v)
  return v
}

function toDateString(v) {
  if (!v) return null
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  return String(v).slice(0, 10)
}

function parseEntry(path, raw) {
  const m = path.match(FILENAME_RX)
  if (!m) throw new Error(`Post filename must match YYYY-MM-DD-slug.md: ${path}`)
  const [, fileDate, slug] = m

  const { data, content } = parseFrontmatter(raw)
  const date = toDateString(data.date) ?? fileDate
  const words = content.trim().split(/\s+/).filter(Boolean).length
  const readingMinutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))

  return {
    slug,
    title: data.title ?? slug,
    date,
    displayDate: date.replace(/-/g, '.'),
    excerpt: data.excerpt ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    draft: Boolean(data.draft),
    readingMinutes,
    content,
  }
}

const ALL = Object.entries(modules)
  .map(([path, raw]) => parseEntry(path, raw))
  .sort((a, b) => (a.date < b.date ? 1 : -1))

const IS_PROD = import.meta.env?.PROD ?? false

export const allPosts = IS_PROD ? ALL.filter((p) => !p.draft) : ALL

export function getPost(slug) {
  return allPosts.find((p) => p.slug === slug)
}

export function latestPosts(n = 3) {
  return allPosts.slice(0, n)
}
