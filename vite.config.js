import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

const SITE_URL = 'https://minul.vercel.app'
const SITE_TITLE = 'Minul Lokuliyana — Writing'
const SITE_DESCRIPTION = 'Short notes on customer success, construction tech, and process improvement.'

function rssPlugin() {
  return {
    name: 'rss-feed',
    apply: 'build',
    generateBundle() {
      const dir = join(process.cwd(), 'src', 'content', 'posts')
      let files = []
      try { files = readdirSync(dir).filter((f) => f.endsWith('.md')) } catch { return }

      const posts = files
        .map((name) => {
          const raw = readFileSync(join(dir, name), 'utf-8')
          const { data, content } = matter(raw)
          const m = name.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/)
          if (!m) return null
          const [, fileDate, slug] = m
          if (data.draft) return null
          const date = data.date
            ? (data.date instanceof Date
                ? data.date.toISOString().slice(0, 10)
                : String(data.date).slice(0, 10))
            : fileDate
          return {
            slug,
            title: data.title ?? slug,
            date,
            excerpt: data.excerpt ?? content.slice(0, 200),
          }
        })
        .filter(Boolean)
        .sort((a, b) => (a.date < b.date ? 1 : -1))

      const items = posts.map((p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/writing/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/writing/${p.slug}</guid>
      <pubDate>${new Date(p.date + 'T00:00:00Z').toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`).join('')

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}/writing</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-AU</language>${items}
  </channel>
</rss>
`
      this.emitFile({ type: 'asset', fileName: 'feed.xml', source: xml })
    },
  }
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineConfig({
  plugins: [react(), rssPlugin()],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-router': ['react-router-dom'],
          'vendor-markdown': ['react-markdown', 'remark-gfm', 'rehype-highlight', 'highlight.js'],
        },
      },
    },
  },
})
